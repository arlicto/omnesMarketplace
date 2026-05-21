# Secure Product Image Upload Implementation

This document summarizes the secure image upload implementation for product images.

## Implemented Features

### 1. Image Processing Service (`ImageProcessor.php`)

**Location**: `backend/src/Services/ImageProcessor.php`

**Features**:
- **WebP Conversion**: Automatically converts all uploaded images to WebP format with 80% quality
- **Thumbnail Generation**: Creates 300x300 thumbnails maintaining aspect ratio
- **Image Compression**: Reduces file size through WebP compression
- **MIME Type Validation**: Uses `finfo` for accurate MIME type detection
- **Extension Validation**: Verifies extension matches MIME type
- **Executable Prevention**: Blocks PHP, EXE, JS, SH, and other dangerous extensions
- **File Size Limit**: Maximum 10MB per image
- **Secure Filenames**: Generates random 32-character hex filenames
- **Image Verification**: Validates files are actual images using GD library

**Allowed MIME Types**:
- image/jpeg
- image/jpg
- image/png
- image/webp

**Blocked Extensions**:
- php, exe, js, sh, phtml, php5, php7, phps

### 2. Image Upload Controller (`ImageUploadController.php`)

**Location**: `backend/src/Controllers/V1/ImageUploadController.php`

**Endpoints**:
- `POST /api/v1/images/upload` - Upload single image
- `POST /api/v1/images/upload-multiple` - Upload multiple images (max 10)
- `DELETE /api/v1/images/{filename}` - Delete uploaded image

**Features**:
- Authentication required for all endpoints
- CSRF protection on all endpoints
- Security monitoring for all upload operations
- Batch upload support with individual error handling
- Secure filename validation (prevents directory traversal)
- Returns relative URLs for images and thumbnails

### 3. Image Upload Rate Limiting (`ImageUploadRateLimitMiddleware.php`)

**Location**: `backend/src/Middleware/ImageUploadRateLimitMiddleware.php`

**Rate Limits**:
- 5 uploads per minute
- 20 uploads per hour
- 50 uploads per day

**Features**:
- Per-user and per-IP tracking
- Sliding window algorithm
- Rate limit headers in responses
- Security logging for exceeded limits
- Automatic cleanup of old entries

### 4. Product Integration

**Updated Files**:
- `backend/src/Models/Product.php` - Added `image_url` and `thumbnail_url` fields
- `backend/src/Controllers/V1/ProductController.php` - Added image upload support
- `backend/routes/api.php` - Added product image upload endpoint

**New Endpoint**:
- `POST /api/v1/products/{id}/image` - Upload image for specific product

**Features**:
- Ownership validation (IDOR prevention)
- Automatic image processing and URL assignment
- Image URLs included in product responses
- Optional image URLs in product creation

## Security Measures

### Validation
✅ MIME type validation using `finfo`
✅ Extension validation against allowed/blocked lists
✅ Extension-MIME type matching verification
✅ Image validity verification using GD library
✅ File size limits (10MB max)
✅ Filename format validation (prevents directory traversal)

### Processing
✅ Automatic WebP conversion (reduces file size)
✅ Thumbnail generation (300x300)
✅ Image compression (80% quality)
✅ Random filename generation (prevents enumeration)
✅ Secure file permissions (0640)

### Storage
✅ Separate directories for images and thumbnails
✅ Secure directory permissions (0750)
✅ No executable extensions allowed
✅ Relative path URLs (prevents absolute path exposure)

### Access Control
✅ Authentication required
✅ CSRF protection
✅ Rate limiting (5/min, 20/hour, 50/day)
✅ Ownership validation for product images
✅ Role-based access (seller role required)

### Monitoring
✅ Security logging for all upload operations
✅ Failed upload logging
✅ Rate limit exceeded logging
✅ Batch upload logging
✅ Image deletion logging

## API Endpoints

### Standalone Image Uploads

**Upload Single Image**
```
POST /api/v1/images/upload
Headers: 
  - X-CSRF-Token: <token>
  - Cookie: auth_token=<token>
Body: multipart/form-data
  - image: <file>
Response: {
  "message": "Image uploaded successfully.",
  "image_url": "/storage/uploads/images/<filename>.webp",
  "thumbnail_url": "/storage/uploads/thumbnails/<filename>_thumb.webp",
  "width": 1920,
  "height": 1080,
  "original_filename": "photo.jpg"
}
```

**Upload Multiple Images**
```
POST /api/v1/images/upload-multiple
Headers: 
  - X-CSRF-Token: <token>
  - Cookie: auth_token=<token>
Body: multipart/form-data
  - images[]: <file1>
  - images[]: <file2>
Response: {
  "message": "Batch upload completed.",
  "successful": 2,
  "failed": 0,
  "images": [...],
  "errors": []
}
```

**Delete Image**
```
DELETE /api/v1/images/{filename}
Headers: 
  - X-CSRF-Token: <token>
  - Cookie: auth_token=<token>
Response: {
  "message": "Image deleted successfully."
}
```

### Product Image Upload

**Upload Image to Product**
```
POST /api/v1/products/{id}/image
Headers: 
  - X-CSRF-Token: <token>
  - Cookie: auth_token=<token>
Body: multipart/form-data
  - image: <file>
Response: {
  "message": "Product image updated successfully.",
  "image_url": "/storage/uploads/images/<filename>.webp",
  "thumbnail_url": "/storage/uploads/thumbnails/<filename>_thumb.webp"
}
```

**Create Product with Image URLs**
```
POST /api/v1/products
Headers: 
  - X-CSRF-Token: <token>
  - Cookie: auth_token=<token>
Body: {
  "name": "Product Name",
  "price": 99.99,
  "description": "Product description",
  "image_url": "/storage/uploads/images/<filename>.webp",
  "thumbnail_url": "/storage/uploads/thumbnails/<filename>_thumb.webp"
}
```

## Storage Structure

```
backend/storage/
├── uploads/
│   ├── images/           # Full-size WebP images
│   │   └── <random>.webp
│   └── thumbnails/       # Thumbnail images
│       └── <random>_thumb.webp
└── logs/
    ├── app.log
    └── security.log      # Security event logs
```

## Rate Limiting Headers

All image upload responses include:
```
X-ImageUpload-Limit-Minute: 5
X-ImageUpload-Remaining-Minute: 4
X-ImageUpload-Limit-Hour: 20
X-ImageUpload-Remaining-Hour: 19
X-ImageUpload-Limit-Day: 50
X-ImageUpload-Remaining-Day: 49
```

## Security Monitoring

The following events are logged to `storage/logs/security.log`:
- Successful image uploads
- Failed image uploads
- Batch upload results
- Image deletions
- Rate limit exceeded events

## Database Schema Updates

The `products` table should include these columns:
```sql
ALTER TABLE products ADD COLUMN image_url VARCHAR(500) NULL;
ALTER TABLE products ADD COLUMN thumbnail_url VARCHAR(500) NULL;
```

## Requirements Met

✅ Validate MIME types
✅ Validate extensions
✅ Limit file size (10MB)
✅ Generate random filenames
✅ Convert images to WebP
✅ Generate thumbnails
✅ Compress images
✅ Prevent executable uploads
✅ Store uploads securely
✅ Add upload rate limiting

## Next Steps

1. Update database schema to add `image_url` and `thumbnail_url` columns
2. Configure web server to serve uploaded files from `storage/uploads/`
3. Set up log rotation for security logs
4. Configure CDN or image optimization service if needed
5. Add image optimization (lazy loading, responsive images) in frontend
6. Consider adding image watermarking for branding
7. Add image metadata stripping for privacy
