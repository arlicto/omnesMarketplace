# Production Admin Dashboard

This document summarizes the implementation of the production admin dashboard for the Omnes Marketplace.

## Database Schema

**Location**: `database/schema/admin_dashboard.sql`

### Tables Created

1. **orders** - Stores completed negotiations/purchases
   - Fields: id, uuid, negotiation_id, product_id, buyer_id, seller_id, final_price, status, shipping_address, tracking_number, notes, timestamps
   - Statuses: pending, processing, shipped, delivered, cancelled, refunded
   - Indexes on buyer_id, seller_id, product_id, status, created_at

2. **audit_logs** - Stores admin action logs for compliance
   - Fields: id, uuid, admin_id, action, entity_type, entity_id, old_values (JSON), new_values (JSON), ip_address, user_agent, created_at
   - Tracks all admin operations with before/after state
   - Indexes on admin_id, action, entity, created_at

3. **analytics_events** - Stores user behavior tracking
   - Fields: id, uuid, user_id, event_type, event_data (JSON), page_url, referrer, ip_address, user_agent, created_at
   - For tracking user interactions and analytics
   - Indexes on user_id, event_type, created_at

4. **reports** - Stores scheduled/admin-generated reports
   - Fields: id, uuid, admin_id, report_type, title, parameters (JSON), file_path, status, error_message, generated_at, expires_at, created_at
   - Statuses: pending, generating, completed, failed
   - Indexes on admin_id, type, status

5. **moderation_actions** - Stores moderation actions
   - Fields: id, uuid, admin_id, target_type, target_id, action_type, reason, duration_days, notes, created_at, expires_at
   - Target types: user, product, negotiation, review, comment
   - Action types: warning, suspend, ban, delete, hide, flag
   - Indexes on admin_id, target, action

6. **users table update** - Added role column
   - Added `role` ENUM column to users table (buyer, seller, admin, super_admin)

## Backend Architecture

### Security Components

**AdminMiddleware** (`backend/src/Middleware/AdminMiddleware.php`)
- Enforces admin/super_admin role requirement
- Logs unauthorized access attempts via SecurityMonitor
- Adds admin_role to request attributes for downstream use

**AuditLogger** (`backend/src/Config/Security/AuditLogger.php`)
- Logs all admin actions with before/after state
- Specialized methods for different entity types (user, product, order, negotiation, moderation)
- Captures IP address and user agent for compliance
- Generates UUIDs for each audit entry

### Helper Classes

**Pagination** (`backend/src/Support/Pagination.php`)
- Handles pagination logic and metadata
- Methods: getPage, getPerPage, getTotal, getTotalPages, getOffset
- Navigation helpers: hasNextPage, hasPreviousPage, getNextPage, getPreviousPage
- toArray() returns pagination metadata for API responses
- fromQuery() creates pagination from query parameters

**SearchFilter** (`backend/src/Support/SearchFilter.php`)
- Handles search, filtering, and sorting logic
- getSearchClause() generates SQL WHERE clause for search
- getFilterClause() generates SQL WHERE clause for filters
- getOrderByClause() generates SQL ORDER BY clause
- fromQuery() creates filter from query parameters
- Supports multiple search fields and filter mappings

### Models & Repositories

**Order** (`backend/src/Models/Order.php`)
- CRUD operations for orders
- create() - Creates new order from negotiation
- update() - Updates order status, tracking, notes

**OrderRepository** (`backend/src/Repositories/OrderRepository.php`)
- findById, findByUuid
- create, updateStatus
- findAll with pagination and filters
- count with filters

**AuditLogRepository** (`backend/src/Repositories/AuditLogRepository.php`)
- create - Creates audit log entry
- findAll with pagination and filters (action, entity_type)
- findById, count
- Decodes JSON old_values and new_values

**UserRepository** (updated)
- Added findAll() with search, role, status filters
- Added count() with filters
- Added updateRole() - Updates user role
- Added banUser() - Bans user with optional duration
- Added unbanUser() - Unbans user
- Added delete() - Soft deletes user

**ProductRepository** (updated)
- Added findAll() with search, status, category filters
- Added count() with filters
- Added delete() - Soft deletes product

**NegotiationRepository** (updated)
- Added findAll() with status filter
- Added count() with status filter

### Admin Controllers

**AdminUserController** (`backend/src/Controllers/V1/Admin/AdminUserController.php`)
- GET /api/v1/admin/users - Get all users with pagination and filters
- GET /api/v1/admin/users/{id} - Get single user
- POST /api/v1/admin/users/{id}/role - Update user role
- POST /api/v1/admin/users/{id}/ban - Ban user
- POST /api/v1/admin/users/{id}/unban - Unban user
- DELETE /api/v1/admin/users/{id} - Delete user
- All actions logged via AuditLogger

**AdminProductController** (`backend/src/Controllers/V1/Admin/AdminProductController.php`)
- GET /api/v1/admin/products - Get all products with pagination and filters
- GET /api/v1/admin/products/{id} - Get single product
- POST /api/v1/admin/products/{id}/status - Update product status
- DELETE /api/v1/admin/products/{id} - Delete product
- All actions logged via AuditLogger

**AdminOrderController** (`backend/src/Controllers/V1/Admin/AdminOrderController.php`)
- GET /api/v1/admin/orders - Get all orders with pagination and filters
- GET /api/v1/admin/orders/{id} - Get single order
- POST /api/v1/admin/orders/{id}/status - Update order status, tracking, notes
- All actions logged via AuditLogger

**AdminNegotiationController** (`backend/src/Controllers/V1/Admin/AdminNegotiationController.php`)
- GET /api/v1/admin/negotiations - Get all negotiations with pagination and filters
- GET /api/v1/admin/negotiations/{id} - Get single negotiation
- POST /api/v1/admin/negotiations/{id}/cancel - Cancel negotiation
- All actions logged via AuditLogger

**AdminLogController** (`backend/src/Controllers/V1/Admin/AdminLogController.php`)
- GET /api/v1/admin/logs - Get all audit logs with pagination and filters
- GET /api/v1/admin/logs/{id} - Get single audit log
- Filters by action and entity_type

**AdminAnalyticsController** (`backend/src/Controllers/V1/Admin/AdminAnalyticsController.php`)
- GET /api/v1/admin/analytics/overview - Get analytics overview
  - User stats (total, active, banned)
  - Product stats (total, active, inactive)
  - Order stats (total, by status)
  - Negotiation stats (total, by status)
  - Revenue stats (total, average, delivered)
  - Recent activity
- GET /api/v1/admin/analytics/users/trends - Get user registration trends
- GET /api/v1/admin/analytics/sales/trends - Get sales trends

## API Endpoints

### User Management

**Get All Users**
```
GET /api/v1/admin/users?page=1&per_page=20&search=&filter_role=&filter_status=
Headers: Cookie: auth_token
Response: {
  "users": [ ... ],
  "pagination": { ... }
}
```

**Update User Role**
```
POST /api/v1/admin/users/{id}/role
Headers: X-CSRF-Token, Cookie: auth_token
Body: { "role": "admin" }
Response: { "message": "User role updated successfully." }
```

**Ban User**
```
POST /api/v1/admin/users/{id}/ban
Headers: X-CSRF-Token, Cookie: auth_token
Body: { "reason": "Violation of terms", "duration_days": 30 }
Response: { "message": "User banned successfully." }
```

**Unban User**
```
POST /api/v1/admin/users/{id}/unban
Headers: X-CSRF-Token, Cookie: auth_token
Response: { "message": "User unbanned successfully." }
```

**Delete User**
```
DELETE /api/v1/admin/users/{id}
Headers: X-CSRF-Token, Cookie: auth_token
Response: { "message": "User deleted successfully." }
```

### Product Management

**Get All Products**
```
GET /api/v1/admin/products?page=1&per_page=20&search=&filter_status=&filter_category_id=
Headers: Cookie: auth_token
Response: {
  "products": [ ... ],
  "pagination": { ... }
}
```

**Update Product Status**
```
POST /api/v1/admin/products/{id}/status
Headers: X-CSRF-Token, Cookie: auth_token
Body: { "status": "suspended" }
Response: { "message": "Product status updated successfully." }
```

**Delete Product**
```
DELETE /api/v1/admin/products/{id}
Headers: X-CSRF-Token, Cookie: auth_token
Response: { "message": "Product deleted successfully." }
```

### Order Management

**Get All Orders**
```
GET /api/v1/admin/orders?page=1&per_page=20&filter_status=
Headers: Cookie: auth_token
Response: {
  "orders": [ ... ],
  "pagination": { ... }
}
```

**Update Order Status**
```
POST /api/v1/admin/orders/{id}/status
Headers: X-CSRF-Token, Cookie: auth_token
Body: { 
  "status": "shipped",
  "tracking_number": "TRACK123456",
  "notes": "Shipped via FedEx"
}
Response: { "message": "Order status updated successfully." }
```

### Negotiation Management

**Get All Negotiations**
```
GET /api/v1/admin/negotiations?page=1&per_page=20&filter_status=
Headers: Cookie: auth_token
Response: {
  "negotiations": [ ... ],
  "pagination": { ... }
}
```

**Cancel Negotiation**
```
POST /api/v1/admin/negotiations/{id}/cancel
Headers: X-CSRF-Token, Cookie: auth_token
Body: { "reason": "Policy violation" }
Response: { "message": "Negotiation cancelled successfully." }
```

### Audit Logs

**Get All Logs**
```
GET /api/v1/admin/logs?page=1&per_page=20&filter_action=&filter_entity_type=
Headers: Cookie: auth_token
Response: {
  "logs": [ ... ],
  "pagination": { ... }
}
```

### Analytics

**Get Overview**
```
GET /api/v1/admin/analytics/overview
Headers: Cookie: auth_token
Response: {
  "stats": {
    "users": { ... },
    "products": { ... },
    "orders": { ... },
    "negotiations": { ... },
    "revenue": { ... },
    "recent_activity": [ ... ]
  }
}
```

**Get User Trends**
```
GET /api/v1/admin/analytics/users/trends?days=30
Headers: Cookie: auth_token
Response: { "trends": [ ... ] }
```

**Get Sales Trends**
```
GET /api/v1/admin/analytics/sales/trends?days=30
Headers: Cookie: auth_token
Response: { "trends": [ ... ] }
```

## Security Features

- **Role Protection**: AdminMiddleware enforces admin/super_admin role requirement
- **Audit Logging**: All admin actions logged with before/after state, IP, user agent
- **Authentication**: All admin endpoints require authentication
- **CSRF Protection**: State-changing endpoints require CSRF token
- **Input Validation**: All inputs validated using InputValidator
- **Self-Protection**: Admins cannot ban/delete themselves
- **Security Monitoring**: Unauthorized access attempts logged via SecurityMonitor

## Pagination & Filtering

All list endpoints support:
- **Pagination**: `page`, `per_page` query parameters (max 100 per page)
- **Search**: `search` parameter for text search
- **Filters**: `filter_*` parameters for specific field filtering
- **Sorting**: `sort_by`, `sort_order` parameters for sorting

Pagination response includes:
- page, per_page, total, total_pages
- has_next, has_previous
- next_page, previous_page

## Database Setup

Run the schema file to create the admin tables:
```bash
mysql -u root -p omnes_db < database/schema/admin_dashboard.sql
```

This will:
- Create orders, audit_logs, analytics_events, reports, moderation_actions tables
- Add role column to users table

## Features Implemented

### User Management
✅ List users with pagination and filters
✅ View single user details
✅ Update user role (buyer, seller, admin, super_admin)
✅ Ban users with reason and optional duration
✅ Unban users
✅ Delete users (soft delete)
✅ Prevent self-ban/delete

### Product Management
✅ List products with pagination and filters
✅ View single product details
✅ Update product status (active, inactive, suspended, deleted)
✅ Delete products (soft delete)

### Order Management
✅ List orders with pagination and filters
✅ View single order details
✅ Update order status (pending, processing, shipped, delivered, cancelled, refunded)
✅ Add tracking numbers
✅ Add order notes

### Negotiation Management
✅ List negotiations with pagination and filters
✅ View single negotiation details
✅ Cancel negotiations with reason

### Audit Logs
✅ View all audit logs with pagination and filters
✅ Filter by action type and entity type
✅ View single audit log with full details
✅ Automatic logging of all admin actions

### Analytics Overview
✅ User statistics (total, active, banned)
✅ Product statistics (total, active, inactive)
✅ Order statistics (total, by status)
✅ Negotiation statistics (total, by status)
✅ Revenue statistics (total, average, delivered)
✅ Recent activity feed
✅ User registration trends
✅ Sales trends

## Next Steps

1. Create admin frontend dashboard UI
2. Implement report generation system
3. Add moderation tools UI
4. Implement scheduled reports
5. Add export functionality for analytics
6. Create admin permission matrix
7. Add two-factor authentication for admin accounts
8. Implement session timeout for admin accounts
9. Add admin activity alerts
10. Create admin user management interface
