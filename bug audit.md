# 🔍 Omnes Marketplace — Comprehensive Bug Audit Report

**Date:** 2026-05-22  
**Scope:** Full-stack audit (backend PHP, frontend React/TS, database schema, Docker infra)  
**Auditor:** Antigravity AI

---

## Audit Summary

| Metric | Value |
|---|---|
| **Files Audited** | ~60 source files |
| **Total Issues Found** | 18 |
| **Critical** | 3 |
| **High** | 6 |
| **Medium** | 5 |
| **Low** | 4 |
| **Production Readiness Score** | **4.5 / 10** |

### Highest-Risk Components
1. **`backend/.env`** — Contains live secrets in a file that also has placeholder lines, creating confusion
2. **`ProductController.php` + `Product.php` (Model)** — Bypasses the repository pattern entirely; uses raw Active Record model with schema mismatch
3. **`RateLimitMiddleware.php`** — In-memory rate limiting is ineffective in production (resets per-request in PHP-FPM)
4. **`frontend/src/pages/Cart.tsx`, `Checkout.tsx`, `ProductDetail.tsx`** — Fully hardcoded/static, no backend integration
5. **`Register.tsx`** — Sends a `role` field the backend ignores, creating a UX lie

---

## Issues by Severity

---

# 🔴 CRITICAL Issues

---

## 1. In-Memory Rate Limiting is Completely Broken in PHP-FPM

**Severity: Critical**

### Problem

The `RateLimitMiddleware` stores request counts in a PHP instance property (`private array $requests = []`). In PHP-FPM (used via Docker), **every request spawns a fresh process** — the `$requests` array is always empty. Rate limiting provides **zero protection**.

### Root Cause

PHP is a share-nothing architecture. Unlike Node.js, PHP does not persist in-memory state between HTTP requests. The middleware class is instantiated fresh for each request.

### Impact

- **No brute-force protection** on any endpoint
- **No DDoS mitigation** at the application level
- The `ImageUploadRateLimitMiddleware` (which likely has a similar pattern) is also broken
- Attackers can send unlimited login attempts, upload requests, or API calls

### How to Reproduce

1. Send 200 requests to `POST /api/v1/auth/login` within 1 second
2. Observe that none are rate-limited — all return 200/401 (never 429)

### Recommended Fix

Use a **shared storage backend** for rate limiting:

```php
// Option 1: Redis (recommended)
$redis = new Redis();
$key = "rate_limit:{$identifier}";
$count = $redis->incr($key);
if ($count === 1) $redis->expire($key, $windowSize);

// Option 2: Database (simpler, but slower)
// INSERT INTO rate_limits (identifier, count, window_start) ...

// Option 3: APCu (single-server only)
$count = apcu_inc("rate:{$identifier}", 1, $success);
```

### Prevention

- Never use in-memory state for cross-request logic in PHP
- Add integration tests that verify rate limiting across multiple requests

---

## 2. Product Creation Uses Schema-Incompatible Active Record Model

**Severity: Critical**

### Problem

`ProductController::create()` uses the `Product` **model** (Active Record), while the database schema requires fields like `uuid`, `slug`, `stock`, and `status` that the model **never sets**. The `INSERT` will fail with a SQL error because `uuid` and `slug` are `NOT NULL` columns with no defaults.

From [Product.php:72](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Models/Product.php#L72):
```php
$query = "INSERT INTO products SET name=:name, description=:description, 
          price=:price, seller_id=:seller_id, image_url=:image_url, thumbnail_url=:thumbnail_url";
```

But the schema requires:
- `uuid CHAR(36) NOT NULL` — **not provided**
- `slug VARCHAR(255) NOT NULL` — **not provided**  
- The `products` table also has no `image_url` or `thumbnail_url` columns — **they don't exist in the schema**

### Root Cause

Dual architecture conflict: the codebase has both a **Repository layer** (`ProductRepository.php`) and an **Active Record model** (`Product.php`). The controller uses the legacy model which is out of sync with the database schema.

### Impact

- **Product creation is completely broken** — every `POST /api/v1/products` will fail with a database error
- Image upload for products will also fail since it depends on successful product creation
- The entire seller workflow is non-functional

### How to Reproduce

1. Login as a seller
2. Send `POST /api/v1/products` with `{ "name": "Test", "price": 10, "description": "test" }`
3. Observe SQL error: missing `uuid` and `slug` columns, and non-existent `image_url`/`thumbnail_url` columns

### Recommended Fix

Migrate `ProductController` to use `ProductRepository` instead of the `Product` model:

```php
public function __construct(private ProductRepository $products, private PDO $db) {}

public function create(Request $request, Response $response): Response
{
    // Use the repository which is aware of the full schema
    $productId = $this->products->create([
        'uuid' => $this->generateUuid(),
        'seller_id' => $sellerId,
        'name' => $name,
        'slug' => $this->generateSlug($name),
        'description' => $description,
        'price' => $price,
        'status' => 'draft',
    ]);
}
```

### Prevention

- Remove the legacy `Product` model entirely or mark it `@deprecated`
- Establish a strict "repositories only" policy for database access
- Add schema-aware integration tests

---

## 3. Negotiation Status Enum Mismatch Between Code and Database

**Severity: Critical**

### Problem

The `NegotiationService` uses status values `'pending'` and `'countered'`, but the database schema defines the enum as:
```sql
status ENUM('open', 'accepted', 'rejected', 'cancelled', 'expired')
```

There is **no `'pending'` or `'countered'` value** in the schema. Every negotiation insert/update will fail.

### Root Cause

Schema and business logic were developed independently without synchronization.

### Impact

- **Entire negotiation system is broken** — offers can't be created, accepted, countered, or rejected
- Any attempt to use negotiations will throw a database constraint error

### How to Reproduce

1. Login as a buyer
2. Send `POST /api/v1/negotiations/offers` with valid product_id and offer
3. Observe MySQL enum constraint violation error

### Recommended Fix

Either update the schema to include the missing statuses:
```sql
status ENUM('open', 'pending', 'countered', 'accepted', 'rejected', 'cancelled', 'expired')
```

Or update the service to use schema-compatible values (`'open'` instead of `'pending'`).

### Prevention

- Use PHP constants/enums mirroring the database ENUM values
- Add migration tests that validate code constants against DB schema

---

# 🟠 HIGH Issues

---

## 4. Frontend Pages are Completely Static — No Backend Integration

**Severity: High**

### Problem

Multiple critical pages have **zero backend integration**:

| Page | Issue |
|---|---|
| [Cart.tsx](file:///home/kushal/Desktop/omnesMarketplace/frontend/src/pages/Cart.tsx) | Uses hardcoded `CART_ITEMS` array. No API calls. Cart buttons (+-) are non-functional |
| [Checkout.tsx](file:///home/kushal/Desktop/omnesMarketplace/frontend/src/pages/Checkout.tsx) | Fully static. No form submission. "Complete Purchase" does nothing |
| [ProductDetail.tsx](file:///home/kushal/Desktop/omnesMarketplace/frontend/src/pages/ProductDetail.tsx) | Hardcoded product. Doesn't fetch from `/products/{id}`. "Add to Cart" is dead |

### Root Cause

Pages were scaffolded as UI mockups and never wired to the API.

### Impact

- **No e-commerce functionality** — users cannot actually buy anything
- Cart state is not persisted across page loads
- The checkout flow is purely decorative

### How to Reproduce

1. Navigate to `/cart` — see hardcoded items that can't be modified
2. Click "Proceed to Checkout" — form inputs do nothing
3. Navigate to `/product/123` — always shows "Titan Precision Chronograph" regardless of ID

### Recommended Fix

Wire each page to its respective API endpoints:
- `Cart.tsx` → `GET /api/v1/cart`, `POST /api/v1/cart/items`, `DELETE /api/v1/cart/items/{id}`
- `Checkout.tsx` → `POST /api/v1/orders`
- `ProductDetail.tsx` → `GET /api/v1/products/{id}`

### Prevention

- Mark static pages with `// TODO: integrate API` comments during scaffolding
- Add Cypress/Playwright e2e tests that verify data flows from API to UI

---

## 5. Registration Sends `role` But Backend Ignores It

**Severity: High**

### Problem

The [Register.tsx](file:///home/kushal/Desktop/omnesMarketplace/frontend/src/pages/Register.tsx#L33-L38) sends a `role` field (`buyer`/`seller`) in the registration payload, but the [AuthService::register()](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Services/AuthService.php#L70) **always assigns the `buyer` role** regardless:

```php
$this->users->assignRole($userId, 'buyer'); // Hardcoded!
```

### Root Cause

The frontend role selector was built, but the backend registration logic was never updated to accept and validate the role parameter.

### Impact

- Users who register as "sellers" are actually created as buyers
- Sellers cannot list products after registration — UX trust violation
- The entire seller registration flow is deceptive

### How to Reproduce

1. Go to `/register?role=seller`
2. Register a new account
3. Login — observe the user only has the `buyer` role
4. Attempt to create a product — get "Insufficient permissions"

### Recommended Fix

```php
$requestedRole = in_array($data['role'] ?? 'buyer', ['buyer', 'seller'], true) 
    ? $data['role'] 
    : 'buyer';
$this->users->assignRole($userId, $requestedRole);
```

### Prevention

- End-to-end tests covering role-specific registration flows
- API documentation specifying accepted `role` values

---

## 6. No Token Refresh Mechanism — Sessions Silently Expire

**Severity: High**

### Problem

The backend issues both access tokens (short-lived) and refresh tokens (stored in cookies), but the frontend **never implements token refresh**. When the access token expires, API calls silently fail with 401 and the user gets no feedback.

The [apiClient.ts](file:///home/kushal/Desktop/omnesMarketplace/frontend/src/services/apiClient.ts) has no response interceptor to handle 401s:

```typescript
// No response interceptor exists — 401s are unhandled
```

### Root Cause

Only the request interceptor was implemented. No response interceptor catches expired tokens to trigger a refresh flow.

### Impact

- Users get silently logged out after the access token expires
- No automatic retry of failed requests
- Poor UX — users see cryptic error messages instead of being redirected to login

### How to Reproduce

1. Login to the application
2. Wait for the access token to expire (check JWT `exp` claim)
3. Try any authenticated action — it fails silently or shows a generic error
4. The refresh token in the cookie is never used

### Recommended Fix

Add a response interceptor:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data } = await apiClient.post('/auth/refresh');
        useAuthStore.getState().setAuth(data.user, data.access_token);
        error.config.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(error.config);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

Also add a `POST /auth/refresh` endpoint on the backend.

### Prevention

- Implement auth refresh as part of the initial auth feature, not as a follow-up
- Test token expiration scenarios in integration tests

---

## 7. `User` Model Hashes Passwords with Weak DEFAULT_COST

**Severity: High**

### Problem

The legacy [User.php model](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Models/User.php#L30) hashes passwords with `PASSWORD_BCRYPT` using PHP's default cost (10), while the proper [PasswordHasher](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Security/PasswordHasher.php) uses Argon2id or bcrypt with cost 12.

```php
// User.php — weak default
$this->password = password_hash($this->password ?? '', PASSWORD_BCRYPT);

// PasswordHasher.php — proper implementation
password_hash($plainPassword, PASSWORD_ARGON2ID, [
    'memory_cost' => 65536, 'time_cost' => 4, 'threads' => 3,
]);
```

If anyone instantiates `User::create()` directly, passwords will be hashed with weaker settings.

### Root Cause

Duplicate authentication logic in the legacy model that wasn't removed during the modularization.

### Impact

- Potential for weaker password hashes if the model is used directly
- `password_hash('' ...)` on line 30 — if `$this->password` is null, it hashes an empty string

### How to Reproduce

1. Call `User::create()` with a null password
2. Observe it creates a user with a bcrypt hash of an empty string — effectively no password

### Recommended Fix

Delete the `User` model entirely (it's superseded by `UserRepository` + `PasswordHasher`) or strip the `create()` method.

### Prevention

- Mark legacy code as `@deprecated` with PHPStan `@phpstan-ignore-next-line`
- Run static analysis to detect duplicate business logic

---

## 8. Docker Default Credentials in `docker-compose.yml`

**Severity: High**

### Problem

[docker-compose.yml:46-48](file:///home/kushal/Desktop/omnesMarketplace/docker-compose.yml#L46-L48) contains default fallback credentials:

```yaml
MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-root_password}
MYSQL_USER: ${DB_USERNAME:-omnes_user}
MYSQL_PASSWORD: ${DB_PASSWORD:-omnes_password}
```

If the `.env` file is missing or misconfigured, the database starts with these weak defaults.

### Root Cause

Docker Compose uses shell-style defaults (`:-`) which activate when variables are unset.

### Impact

- If `.env` is not loaded, database starts with `root_password` as root password
- Attackers on the same network can access MySQL on port 3307

### How to Reproduce

1. Remove/rename `backend/.env`
2. Run `docker-compose up`
3. Connect to MySQL: `mysql -h localhost -P 3307 -u root -proot_password`

### Recommended Fix

Remove defaults for sensitive variables and fail fast:
```yaml
MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:?DB_ROOT_PASSWORD is required}
MYSQL_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}
```

### Prevention

- Use Docker secrets for production
- Add a startup healthcheck script that validates env vars

---

## 9. CORS Allows Methods/Headers for Non-Allowed Origins

**Severity: High**

### Problem

In [CorsMiddleware.php:34-37](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Middleware/CorsMiddleware.php#L34-L37), the `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` are set for **all responses**, even when the origin is not in the allowed list:

```php
// This runs regardless of whether $isAllowed is true
$response = $response
    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
```

### Root Cause

Headers should be set only within the `if ($isAllowed)` block.

### Impact

- Information leakage about supported HTTP methods and headers to unauthorized origins
- Could assist attackers in crafting targeted requests

### How to Reproduce

1. Send a request with `Origin: https://malicious-site.com`
2. Observe the response includes `Access-Control-Allow-Methods` even though origin is rejected

### Recommended Fix

Move the method/header declarations inside the `if ($isAllowed)` block.

### Prevention

- Use a well-tested CORS library like `tuupola/cors-middleware`

---

# 🟡 MEDIUM Issues

---

## 10. Browse Page Filters Products by Non-Existent `type` Field

**Severity: Medium**

### Problem

[Browse.tsx:29-34](file:///home/kushal/Desktop/omnesMarketplace/frontend/src/pages/Browse.tsx#L29-L34) filters products by `product.type` (`'Buy Now'`, `'Negotiation'`, `'Best Offer'`), but the API response from `ProductController::getAll()` never returns a `type` field. The product schema doesn't have a `type` column either.

### Root Cause

Frontend was designed against a different data model than what the backend provides.

### Impact

- All three tabs ("Buy It Now", "Negotiable Prices", "Auctioned Products") show **empty results**
- The filter dropdowns (Category, Sale Type, Sort By) are also non-functional — they don't trigger API calls

### How to Reproduce

1. Navigate to `/browse`
2. Switch tabs — all tabs show 0 products despite products existing in the database

### Recommended Fix

Either add a `type` field to the product schema/API or filter based on existing fields like `status`.

---

## 11. `ProtectedRoute` Doesn't Check for `super_admin` Role

**Severity: Medium**

### Problem

The [ProtectedRoute](file:///home/kushal/Desktop/omnesMarketplace/frontend/src/components/ProtectedRoute.tsx#L15) only checks for `'admin'` role:
```typescript
const isAdmin = user?.roles?.includes('admin');
```

But the backend's [AdminMiddleware](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Middleware/AdminMiddleware.php#L20) accepts both `'admin'` and `'super_admin'`:
```php
private const ALLOWED_ROLES = ['admin', 'super_admin'];
```

### Root Cause

Frontend and backend role checks are not synchronized.

### Impact

- Users with `super_admin` role can access admin API endpoints but are **blocked from the admin UI**
- They get redirected to `/` when navigating to `/admin`

### Recommended Fix

```typescript
const isAdmin = user?.roles?.some(r => ['admin', 'super_admin'].includes(r));
```

---

## 12. Notification & Negotiation Routes Missing CSRF on Non-GET Endpoints

**Severity: Medium**

### Problem

[Notifications mark-as-read](file:///home/kushal/Desktop/omnesMarketplace/backend/routes/api.php#L129-L133) and [mark-all-as-read](file:///home/kushal/Desktop/omnesMarketplace/backend/routes/api.php#L132-L133) POST routes are missing `CsrfMiddleware`:

```php
$notificationGroup->post('/{id}/read', NotificationController::class . ':markAsRead')
    ->add(AuthMiddleware::class);   // ← No CsrfMiddleware!

$notificationGroup->post('/read-all', NotificationController::class . ':markAllAsRead')
    ->add(AuthMiddleware::class);   // ← No CsrfMiddleware!
```

### Root Cause

CSRF protection was inconsistently applied — some POST routes have it, others don't.

### Impact

- CSRF attacks could mark all notifications as read, obscuring legitimate notifications
- While impact is limited (read-only state change), it violates the security model's consistency

### Recommended Fix

Add `->add(CsrfMiddleware::class)` to all POST/PUT/DELETE routes.

---

## 13. `ExceptionMiddleware` Uses `getCode()` for HTTP Status on `HttpException`

**Severity: Medium**

### Problem

[ExceptionMiddleware.php:34](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Middleware/ExceptionMiddleware.php#L34):
```php
$statusCode = $exception->getCode();
```

Slim's `HttpException` provides `getCode()` from PHP's base `Exception` class, which returns an `int` that may be 0 for some exceptions. The correct Slim method is `$exception->getResponse()->getStatusCode()` or accessing the specific HTTP exception's status.

### Root Cause

Using the wrong method on the exception class.

### Impact

- Some HTTP exceptions may return status code `0`, which gets sent as `200` by most web servers
- Error responses could have incorrect status codes

### Recommended Fix

```php
if ($exception instanceof HttpException) {
    $statusCode = $exception->getCode() ?: 500;
    // Or better: Slim HttpExceptions store status in getCode() correctly,
    // but always validate it's a valid HTTP status
}
```

---

## 14. `ProductController::create()` Uses `json_decode()` Instead of `getParsedBody()`

**Severity: Medium**

### Problem

[ProductController.php:102](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Controllers/V1/ProductController.php#L102):
```php
$data = json_decode((string) $request->getBody(), true);
```

But `$app->addBodyParsingMiddleware()` is registered in `index.php`, which already parses the body. Using `json_decode` on the raw body means:
1. The body stream position is at the end after middleware reads it
2. Double-parsing wastes resources

All other controllers correctly use `$request->getParsedBody()`.

### Root Cause

Inconsistent coding pattern in this controller.

### Impact

- Could return null/empty data if the body stream was already consumed
- Inconsistency makes the codebase harder to maintain

### Recommended Fix

```php
$data = (array) $request->getParsedBody();
```

---

# 🟢 LOW Issues

---

## 15. `User` Model `emailExists()` Leaks User Data Into Model Properties

**Severity: Low**

### Problem

[User.php:42-58](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Models/User.php#L42-L58): The `emailExists()` method loads user data (id, username, password hash) into public properties as a side effect:

```php
$this->id = (int)$row['id'];
$this->username = $row['username'];
$this->password = $row['password'];  // Password hash on public property!
```

### Impact

- Password hash accessible via `$user->password` if anyone accesses the model after `emailExists()`
- Violates single-responsibility — an existence check should not load data

### Recommended Fix

This model should be deleted entirely (superseded by `UserRepository`). If kept, `emailExists()` should only return a boolean.

---

## 16. Hardcoded Test Credentials are Weak

**Severity: Low**

### Problem

`credentials.txt` contains `buyer123`, `seller123`, `admin123` — these are in the `.gitignore` and not tracked (confirmed), but the `seed_users.php` script likely uses these same passwords to seed the database.

### Impact

- If seed data leaks into staging/production, these accounts are trivially compromised
- The passwords don't meet the backend's own 8-character minimum (they're exactly 8, but have no complexity)

### Recommended Fix

- Use stronger seed passwords: `buyer_test_2026!`, `seller_test_2026!`
- Add a startup check that rejects known seed passwords in non-dev environments

---

## 17. Missing `seller_name` in `Product::readOne()` Response

**Severity: Low**

### Problem

`ProductController::getOne()` at [line 77](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Controllers/V1/ProductController.php#L77) reads `$product->name`, but the `Product::readOne()` query aliases `u.username as seller_name`, which is **loaded into the model** but **never exposed as a property** — it's silently discarded during fetch.

### Impact

- Product detail responses don't include `seller_name` even though the query fetches it
- The `getAll` response includes `seller_name`, creating an inconsistency

---

## 18. Duplicate UUID Generator Functions

**Severity: Low**

### Problem

UUID generation is duplicated in:
- [AuthService.php:339-346](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Services/AuthService.php#L339-L346)
- [NegotiationService.php:311-317](file:///home/kushal/Desktop/omnesMarketplace/backend/src/Services/NegotiationService.php#L311-L317)

Both have identical implementations.

### Impact

- DRY violation — bugs in UUID generation need to be fixed in multiple places
- No centralized UUID standard

### Recommended Fix

Create `App\Support\Uuid::v4(): string` and use it everywhere.

---

## Optimization Suggestions

| Area | Suggestion |
|---|---|
| **Database** | Add a `products.image_url` and `thumbnail_url` column, OR refactor to use the existing `product_images` table |
| **Caching** | Add Redis for session/token storage, rate limiting, and product catalog caching |
| **Testing** | Add PHPUnit for backend and Vitest for frontend — currently zero test coverage |
| **API Docs** | Generate OpenAPI/Swagger docs from route definitions |
| **Error Handling** | Standardize error response format (currently mix of `JsonResponse::error()` and inline `json_encode`) |
| **Frontend State** | Implement proper cart state management with Zustand (like auth) |
| **Monitoring** | Add structured logging (JSON) and health check for external monitoring |
| **Build** | Add `npm run lint` and `composer phpstan` to CI pipeline |

---

## Production Readiness Score: 4.5 / 10

| Category | Score | Notes |
|---|---|---|
| **Security** | 5/10 | Good foundations (CSRF, security headers, password hashing) but rate limiting is broken and CORS leaks info |
| **Functionality** | 3/10 | Core e-commerce flows (cart, checkout, product creation) are non-functional |
| **Architecture** | 5/10 | Good separation with services/repositories, but legacy models create dangerous conflicts |
| **Frontend** | 4/10 | Clean UI scaffolding, but most pages are static mockups |
| **Infrastructure** | 5/10 | Docker setup works, but has weak defaults and missing production hardening |
| **Testing** | 1/10 | No automated tests detected |
| **Documentation** | 6/10 | Good README and summary docs, but no API documentation |
