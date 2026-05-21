# Buyer-Seller Negotiation & Notification System

This document summarizes the implementation of the buyer-seller negotiation system, notification system, and real-time-ready architecture.

## Database Schema

**Location**: `database/schema/negotiations_notifications.sql`

### Tables Created

1. **negotiations** - Stores negotiation offers between buyers and sellers
   - Fields: id, uuid, product_id, buyer_id, seller_id, status, initial_offer, current_offer, buyer_message, seller_message, expires_at, timestamps
   - Statuses: pending, accepted, rejected, countered, expired
   - Indexes on product_id, buyer_id, seller_id, status, uuid

2. **negotiation_messages** - Stores message history for negotiations
   - Fields: id, uuid, negotiation_id, sender_id, message, offer_amount, created_at
   - Supports chat-style negotiation history

3. **notifications** - Stores user notifications
   - Fields: id, uuid, user_id, type, title, message, data (JSON), is_read, read_at, created_at, expires_at
   - Types: negotiation_offer, negotiation_accepted, negotiation_rejected, negotiation_countered, product_sold, message, system
   - Indexes on user_id, type, is_read, created_at

4. **notification_preferences** - Stores user notification preferences
   - Fields: user_id, email_notifications, push_notifications, and type-specific preferences
   - Allows users to customize which notifications they receive

## Backend Architecture

### WebSocket-Ready Event System

**Location**: `backend/src/Events/`

The event system is designed to easily integrate with WebSockets later:

- **EventDispatcher** - Central event emitter with on/off/once methods
- **Event** - Serializable event class with toArray()/fromArray() for WebSocket transmission
- **EventTypes** - Constants for all event types (negotiation, notification, product, user events)
- **EventSubscriberInterface** - Interface for modular event subscribers
- **NotificationSubscriber** - Automatically creates notifications for negotiation events

**Event Flow**:
1. Business logic emits events via EventDispatcher
2. Subscribers handle events (e.g., create notifications)
3. Events are serializable for WebSocket transmission
4. WebSocket integration point: add a subscriber that broadcasts events to connected clients

### Models & Repositories

**Negotiation** (`backend/src/Models/Negotiation.php`)
- CRUD operations
- Ownership validation (isParticipant, isSeller, isBuyer)

**NegotiationRepository** (`backend/src/Repositories/NegotiationRepository.php`)
- findById, findByUuid
- create, updateStatus
- findByBuyer, findBySeller, findByProduct
- hasActiveNegotiation, markExpired

**Notification** (`backend/src/Models/Notification.php`)
- CRUD operations
- markAsRead, markAllAsRead
- belongsToUser validation

**NotificationRepository** (`backend/src/Repositories/NotificationRepository.php`)
- findById, findByUuid
- create, markAsRead, markAllAsRead
- findByUser (with pagination and unread filter)
- getUnreadCount, deleteExpired, delete

**ProductRepository** (`backend/src/Repositories/ProductRepository.php`)
- findById, findByUuid
- findBySeller
- updateStatus

### Services

**NegotiationService** (`backend/src/Services/NegotiationService.php`)
- createOffer - Creates new negotiation with validation
- acceptOffer - Accepts a negotiation offer
- rejectOffer - Rejects a negotiation offer with optional message
- counterOffer - Counters an offer with new amount
- getBuyerNegotiations - Get negotiations for buyer
- getSellerNegotiations - Get negotiations for seller
- getNegotiation - Get single negotiation with authorization check
- markExpiredNegotiations - Mark expired negotiations
- Emits events for all operations

**NotificationService** (`backend/src/Services/NotificationService.php`)
- create - Create notification for user
- getUserNotifications - Get notifications with pagination
- getUnreadCount - Get unread notification count
- markAsRead - Mark single notification as read
- markAllAsRead - Mark all notifications as read
- delete - Delete notification
- cleanupExpired - Delete expired notifications
- Emits events for all operations

### Controllers

**NegotiationController** (`backend/src/Controllers/V1/NegotiationController.php`)
- POST /api/v1/negotiations/offers - Create negotiation offer
- GET /api/v1/negotiations/offers/buyer - Get buyer's negotiations
- GET /api/v1/negotiations/offers/seller - Get seller's negotiations
- GET /api/v1/negotiations/offers/{id} - Get single negotiation
- POST /api/v1/negotiations/offers/{id}/accept - Accept offer
- POST /api/v1/negotiations/offers/{id}/reject - Reject offer
- POST /api/v1/negotiations/offers/{id}/counter - Counter offer

**NotificationController** (`backend/src/Controllers/V1/NotificationController.php`)
- GET /api/v1/notifications - Get user notifications
- GET /api/v1/notifications/unread-count - Get unread count
- POST /api/v1/notifications/{id}/read - Mark as read
- POST /api/v1/notifications/read-all - Mark all as read
- DELETE /api/v1/notifications/{id} - Delete notification

## API Endpoints

### Negotiation Endpoints

**Create Offer**
```
POST /api/v1/negotiations/offers
Headers: X-CSRF-Token, Cookie: auth_token
Body: {
  "product_id": 1,
  "offer": 150.00,
  "message": "I'm interested in this product"
}
Response: {
  "message": "Negotiation offer created successfully.",
  "negotiation": { ... }
}
```

**Accept Offer**
```
POST /api/v1/negotiations/offers/{id}/accept
Headers: X-CSRF-Token, Cookie: auth_token
Response: {
  "message": "Offer accepted successfully.",
  "negotiation": { ... }
}
```

**Reject Offer**
```
POST /api/v1/negotiations/offers/{id}/reject
Headers: X-CSRF-Token, Cookie: auth_token
Body: {
  "message": "Price is too low"
}
Response: {
  "message": "Offer rejected successfully.",
  "negotiation": { ... }
}
```

**Counter Offer**
```
POST /api/v1/negotiations/offers/{id}/counter
Headers: X-CSRF-Token, Cookie: auth_token
Body: {
  "counter_offer": 175.00,
  "message": "How about this price?"
}
Response: {
  "message": "Counter offer sent successfully.",
  "negotiation": { ... }
}
```

**Get Buyer Negotiations**
```
GET /api/v1/negotiations/offers/buyer?status=pending
Headers: Cookie: auth_token
Response: {
  "negotiations": [ ... ],
  "count": 5
}
```

**Get Seller Negotiations**
```
GET /api/v1/negotiations/offers/seller?status=pending
Headers: Cookie: auth_token
Response: {
  "negotiations": [ ... ],
  "count": 3
}
```

### Notification Endpoints

**Get Notifications**
```
GET /api/v1/notifications?limit=20&offset=0&unread_only=true
Headers: Cookie: auth_token
Response: {
  "notifications": [ ... ],
  "unread_count": 5,
  "count": 20
}
```

**Get Unread Count**
```
GET /api/v1/notifications/unread-count
Headers: Cookie: auth_token
Response: {
  "unread_count": 5
}
```

**Mark as Read**
```
POST /api/v1/notifications/{id}/read
Headers: Cookie: auth_token
Response: {
  "message": "Notification marked as read.",
  "notification": { ... }
}
```

**Mark All as Read**
```
POST /api/v1/notifications/read-all
Headers: Cookie: auth_token
Response: {
  "message": "All notifications marked as read.",
  "count": 5
}
```

**Delete Notification**
```
DELETE /api/v1/notifications/{id}
Headers: X-CSRF-Token, Cookie: auth_token
Response: {
  "message": "Notification deleted successfully."
}
```

## Security Features

- **Authentication**: All endpoints require authentication
- **CSRF Protection**: State-changing endpoints require CSRF token
- **Authorization**: Users can only access their own negotiations and notifications
- **Input Validation**: All inputs validated using InputValidator
- **Ownership Validation**: Negotiation operations verify buyer/seller ownership
- **Rate Limiting**: General rate limiting applies to all endpoints

## Real-Time Architecture

The system is structured for easy WebSocket integration:

### Event System
- Decoupled event emission from handling
- Events are serializable (toArray/fromArray)
- Event subscribers handle business logic
- Easy to add WebSocket broadcaster as a subscriber

### WebSocket Integration Point
```php
// Example future WebSocket integration:
class WebSocketEventSubscriber implements EventSubscriberInterface
{
    public function subscribe(EventDispatcher $dispatcher): void
    {
        $dispatcher->on(EventTypes::NEGOTIATION_CREATED, [$this, 'broadcast']);
        $dispatcher->on(EventTypes::NOTIFICATION_CREATED, [$this, 'broadcast']);
        // ... other events
    }
    
    private function broadcast(Event $event, array $data): void
    {
        // Broadcast to connected WebSocket clients
        $this->websocketServer->broadcast($event->toArray());
    }
}
```

### Event Types for WebSocket
- negotiation.created - New offer created
- negotiation.accepted - Offer accepted
- negotiation.rejected - Offer rejected
- negotiation.countered - Counter offer sent
- negotiation.expired - Negotiation expired
- notification.created - New notification
- notification.read - Notification read
- notification.deleted - Notification deleted
- product.sold - Product sold

## Features Implemented

### Negotiation System
✅ Create negotiation offers
✅ Accept offers
✅ Reject offers with messages
✅ Counter offers
✅ View buyer's negotiations
✅ View seller's negotiations
✅ View single negotiation
✅ Automatic expiration (7 days)
✅ Prevent duplicate active negotiations
✅ Prevent self-negotiation
✅ Validate product availability

### Notification System
✅ Automatic notification creation for negotiation events
✅ Notification center with pagination
✅ Unread count tracking
✅ Mark as read (single/all)
✅ Delete notifications
✅ Notification expiration
✅ Notification preferences table
✅ Event-driven notification creation

### Real-Time Ready Architecture
✅ Event dispatcher pattern
✅ Serializable events
✅ Event subscriber interface
✅ Decoupled business logic
✅ WebSocket integration point
✅ Event types constants

## Database Setup

Run the schema file to create the tables:
```bash
mysql -u root -p omnes_db < database/schema/negotiations_notifications.sql
```

Or add to your existing schema.sql file.

## Next Steps for WebSocket Integration

1. Install WebSocket server (e.g., Ratchet, Swoole, or Pusher)
2. Create WebSocketEventSubscriber to broadcast events
3. Add WebSocket authentication middleware
4. Implement client-side WebSocket connection
5. Handle reconnection logic
6. Add presence tracking (online/offline status)

## Frontend Integration

The frontend should:
- Call negotiation endpoints for offer management
- Poll or use WebSocket for real-time updates
- Display notification center with unread count
- Allow marking notifications as read
- Show negotiation status updates in real-time
