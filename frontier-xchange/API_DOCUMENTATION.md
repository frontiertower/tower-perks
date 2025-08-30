# 📚 Frontier Xchange API Documentation

## Overview
This document provides comprehensive API documentation for the Frontier Xchange marketplace platform. The API supports both Supabase (primary) and FastAPI (fallback) backends.

## Table of Contents
1. [Authentication](#authentication)
2. [Jobs API](#jobs-api)
3. [Offers API](#offers-api)
4. [Profiles API](#profiles-api)
5. [Real-time Subscriptions](#real-time-subscriptions)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

## Authentication

### Google OAuth
```javascript
// Initialize authentication
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`
  }
});
```

### Get Current User
```javascript
const { data: { user } } = await supabase.auth.getUser();
```

### Sign Out
```javascript
await supabase.auth.signOut();
```

## Jobs API

### List All Jobs
**GET** `/rest/v1/jobs`

Query Parameters:
- `status` - Filter by job status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
- `category` - Filter by category (3D_PRINTING, LASER_CUTTING, etc.)
- `payment_type` - Filter by payment type (MONETARY, IN_KIND, HYBRID)
- `order` - Sort order (e.g., `created_at.desc`)
- `limit` - Maximum number of results
- `offset` - Pagination offset

Example:
```bash
curl -X GET "http://localhost:8000/rest/v1/jobs?status=OPEN&category=3D_PRINTING&limit=10"
```

Response:
```json
[
  {
    "id": "job_123",
    "title": "3D Print Custom Part",
    "category": "3D_PRINTING",
    "description": "Need a custom bracket printed",
    "budget_usd": 25.00,
    "currency": "USD",
    "payment_type": "MONETARY",
    "status": "OPEN",
    "posted_by_id": "user_456",
    "created_at": "2025-08-27T10:00:00Z",
    "updated_at": "2025-08-27T10:00:00Z"
  }
]
```

### Get Single Job
**GET** `/rest/v1/jobs?id=eq.{job_id}`

Example:
```bash
curl -X GET "http://localhost:8000/rest/v1/jobs?id=eq.job_123"
```

### Create Job
**POST** `/rest/v1/jobs`

Request Body:
```json
{
  "title": "Laser Cut Acrylic Sign",
  "category": "LASER_CUTTING",
  "description": "Custom 12x12 inch acrylic sign with logo",
  "budget_usd": 50.00,
  "payment_type": "HYBRID",
  "in_kind_description": "Will provide materials",
  "deadline_iso": "2025-09-01T00:00:00Z",
  "posted_by_id": "user_123",
  "posted_by_email": "user@example.com",
  "service_type": "LASER",
  "is_standard_rate": true
}
```

Response:
```json
{
  "id": "job_789",
  "title": "Laser Cut Acrylic Sign",
  "status": "OPEN",
  "created_at": "2025-08-27T12:00:00Z"
}
```

### Update Job
**PATCH** `/rest/v1/jobs?id=eq.{job_id}`

Request Body (partial update):
```json
{
  "status": "IN_PROGRESS",
  "claimed_by_id": "user_789",
  "claimed_at_iso": "2025-08-27T14:00:00Z"
}
```

### Delete Job
**DELETE** `/rest/v1/jobs?id=eq.{job_id}`

## Offers API

### List Offers for a Job
**GET** `/rest/v1/job_offers?job_id=eq.{job_id}`

Example:
```bash
curl -X GET "http://localhost:8000/rest/v1/job_offers?job_id=eq.job_123"
```

Response:
```json
[
  {
    "id": "offer_456",
    "job_id": "job_123",
    "offered_by_id": "user_789",
    "offer_amount_usd": 20.00,
    "offer_payment_type": "MONETARY",
    "message": "I can complete this today",
    "status": "PENDING",
    "created_at": "2025-08-27T13:00:00Z"
  }
]
```

### Create Offer
**POST** `/rest/v1/job_offers`

Request Body:
```json
{
  "job_id": "job_123",
  "offered_by_id": "user_456",
  "offered_by_email": "maker@example.com",
  "offer_amount_usd": 30.00,
  "offer_payment_type": "HYBRID",
  "offer_in_kind_description": "Plus design consultation",
  "message": "I have experience with similar projects"
}
```

### Update Offer Status
**PATCH** `/rest/v1/job_offers?id=eq.{offer_id}`

Request Body:
```json
{
  "status": "ACCEPTED"
}
```

Status values:
- `PENDING` - Initial state
- `ACCEPTED` - Offer accepted by job poster
- `REJECTED` - Offer rejected
- `WITHDRAWN` - Offer withdrawn by bidder

### Counter Offer
Create a new offer with reference to the original:
```json
{
  "job_id": "job_123",
  "offered_by_id": "original_poster",
  "offer_amount_usd": 35.00,
  "message": "Counter-offer: How about $35?"
}
```

## Profiles API

### Get User Profile
**GET** `/rest/v1/profiles?user_id=eq.{user_id}`

Response:
```json
{
  "id": "profile_123",
  "user_id": "user_123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "role": "member",
  "bio": "Maker and designer",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Update Profile
**PATCH** `/rest/v1/profiles?user_id=eq.{user_id}`

Request Body:
```json
{
  "full_name": "Jane Doe",
  "bio": "3D printing specialist",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

## Real-time Subscriptions

### Subscribe to Job Changes
```javascript
const channel = supabase
  .channel('jobs-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'jobs'
    },
    (payload) => {
      console.log('Job changed:', payload);
      // Handle job update
    }
  )
  .subscribe();
```

### Subscribe to Offers for Your Jobs
```javascript
const channel = supabase
  .channel('offers-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'job_offers',
      filter: `job_id=in.(${yourJobIds.join(',')})`
    },
    (payload) => {
      console.log('New offer received:', payload);
      // Show notification
    }
  )
  .subscribe();
```

### Unsubscribe
```javascript
await channel.unsubscribe();
```

## Standard Rates API

### Get Service Rates
**GET** `/api/standard-rates`

Response:
```json
{
  "BAMBU_X1C": {
    "name": "Bambu Lab X1 Carbon",
    "base_rate": 5
  },
  "H2D": {
    "name": "Bambu Lab H2D",
    "base_rate": 7
  },
  "LASER": {
    "name": "Laser Cutting",
    "base_rate": 20
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

### Error Handling Example
```javascript
try {
  const { data, error } = await supabase
    .from('jobs')
    .insert({ /* job data */ });
    
  if (error) throw error;
  
  // Handle success
} catch (error) {
  if (error.code === 'PGRST116') {
    console.error('Job not found');
  } else if (error.code === '23505') {
    console.error('Duplicate entry');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Rate Limiting

### Demo Backend
- 100 requests per minute per IP
- 1000 requests per hour per IP

### Supabase
- Follows Supabase project limits
- Real-time subscriptions: 100 concurrent connections
- Database queries: Based on plan

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693584000
```

## Data Types

### Job Categories
```typescript
type JobCategory = 
  | '3D_PRINTING'
  | 'LASER_CUTTING'
  | 'DESIGN_HELP'
  | 'CONSULTATION'
  | 'OTHER';
```

### Job Status
```typescript
type JobStatus = 
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';
```

### Payment Types
```typescript
type PaymentType = 
  | 'MONETARY'
  | 'IN_KIND'
  | 'HYBRID';
```

### Offer Status
```typescript
type OfferStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';
```

## Testing

### Health Check
**GET** `/health`

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-27T12:00:00Z"
}
```

### Test Endpoints (Demo Backend Only)
```bash
# Create test job
curl -X POST http://localhost:8000/test/create-job

# Create test offer
curl -X POST http://localhost:8000/test/create-offer

# Reset database
curl -X POST http://localhost:8000/test/reset
```

## Webhooks (Future Enhancement)

### Job Completed Webhook
```json
{
  "event": "job.completed",
  "data": {
    "job_id": "job_123",
    "completed_at": "2025-08-27T15:00:00Z",
    "deliverable_url": "https://example.com/delivery.zip"
  }
}
```

### Offer Accepted Webhook
```json
{
  "event": "offer.accepted",
  "data": {
    "offer_id": "offer_456",
    "job_id": "job_123",
    "accepted_at": "2025-08-27T14:00:00Z"
  }
}
```

---

For more information or support, please refer to the main README or open an issue on GitHub.