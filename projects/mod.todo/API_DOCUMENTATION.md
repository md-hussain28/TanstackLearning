# Todo API Documentation

This document describes the complete Todo API implementation with all CRUD operations, following the modular style used in the project.

## Base URL
```
/api/todo
```

## API Endpoints

### 1. Get All Todos (with filtering, sorting, pagination)
**GET** `/api/todo`

#### Query Parameters
- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by priority (`low`, `medium`, `high`)
- `assignedTo` (string): Filter by assigned user (partial match)
- `tag` (string): Filter by tag (partial match)
- `search` (string): Search in title and description
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 10)
- `sortBy` (string): Sort field (`createdAt`, `updatedAt`, `dueDate`, `priority`, `title`)
- `sortOrder` (string): Sort order (`asc`, `desc`)

#### Example Requests
```bash
# Get all todos
GET /api/todo

# Get completed todos only
GET /api/todo?completed=true

# Get high priority todos
GET /api/todo?priority=high

# Search todos
GET /api/todo?search=Next.js

# Paginated results
GET /api/todo?page=1&limit=5

# Sorted by priority
GET /api/todo?sortBy=priority&sortOrder=desc
```

#### Response
```json
{
  "data": {
    "todos": [...],
    "count": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "success": true,
  "message": "Found 5 todos"
}
```

### 2. Create New Todo
**POST** `/api/todo`

#### Request Body
```json
{
  "title": "New Todo Item",
  "description": "Optional description",
  "priority": "medium",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "tags": ["work", "urgent"],
  "assignedTo": "user@example.com",
  "parentId": "1" // Optional: for subtasks
}
```

#### Response
```json
{
  "data": {
    "id": "1234567890",
    "title": "New Todo Item",
    "description": "Optional description",
    "completed": false,
    "priority": "medium",
    "dueDate": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z",
    "tags": ["work", "urgent"],
    "assignedTo": "user@example.com",
    "subtasks": [],
    "comments": []
  },
  "success": true,
  "message": "Todo created successfully"
}
```

### 3. Update Todo (Full Update)
**PUT** `/api/todo`

#### Request Body
```json
{
  "id": "1234567890",
  "title": "Updated Todo Item",
  "description": "Updated description",
  "completed": true,
  "priority": "high",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "tags": ["work", "completed"],
  "assignedTo": "user@example.com"
}
```

#### Response
```json
{
  "data": {
    "id": "1234567890",
    "title": "Updated Todo Item",
    "description": "Updated description",
    "completed": true,
    "priority": "high",
    "dueDate": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T11:00:00.000Z",
    "tags": ["work", "completed"],
    "assignedTo": "user@example.com",
    "subtasks": [],
    "comments": []
  },
  "success": true,
  "message": "Todo updated successfully"
}
```

### 4. Patch Todo (Partial Update)
**PATCH** `/api/todo`

#### Request Body
```json
{
  "id": "1234567890",
  "completed": true,
  "priority": "high",
  "assignedTo": "newuser@example.com"
}
```

#### Response
```json
{
  "data": {
    "id": "1234567890",
    "title": "Updated Todo Item",
    "description": "Updated description",
    "completed": true,
    "priority": "high",
    "dueDate": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T12:00:00.000Z",
    "tags": ["work", "completed"],
    "assignedTo": "newuser@example.com",
    "subtasks": [],
    "comments": []
  },
  "success": true,
  "message": "Todo updated successfully"
}
```

### 5. Delete Todo
**DELETE** `/api/todo?id=1234567890`

#### Response
```json
{
  "data": {
    "deleted": {
      "id": "1234567890",
      "title": "Updated Todo Item",
      // ... full todo object
    },
    "message": "Todo deleted successfully"
  },
  "success": true
}
```

## Individual Todo Operations

### 6. Get Single Todo
**GET** `/api/todo/[id]`

#### Response
```json
{
  "data": {
    "id": "1234567890",
    "title": "Todo Item",
    // ... full todo object
  },
  "success": true,
  "message": "Todo retrieved successfully"
}
```

### 7. Update Single Todo (Full Update)
**PUT** `/api/todo/[id]`

#### Request Body
```json
{
  "title": "Updated Todo Item",
  "description": "Updated description",
  "completed": true,
  "priority": "high",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "tags": ["work", "completed"],
  "assignedTo": "user@example.com"
}
```

### 8. Patch Single Todo (Partial Update)
**PATCH** `/api/todo/[id]`

#### Request Body
```json
{
  "completed": true,
  "priority": "high",
  "assignedTo": "newuser@example.com"
}
```

### 9. Delete Single Todo
**DELETE** `/api/todo/[id]`

## Comment Operations

### 10. Add Comment to Todo
**POST** `/api/todo/[id]/comments`

#### Request Body
```json
{
  "author": "john.doe",
  "message": "This is a comment on the todo"
}
```

#### Response
```json
{
  "data": {
    "id": "c1234567890",
    "author": "john.doe",
    "message": "This is a comment on the todo",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  },
  "success": true,
  "message": "Comment added successfully"
}
```

### 11. Update Comment
**PUT** `/api/todo/[id]/comments/[commentId]`

#### Request Body
```json
{
  "message": "Updated comment message"
}
```

#### Response
```json
{
  "data": {
    "id": "c1234567890",
    "author": "john.doe",
    "message": "Updated comment message",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T11:00:00.000Z"
  },
  "success": true,
  "message": "Comment updated successfully"
}
```

### 12. Delete Comment
**DELETE** `/api/todo/[id]/comments/[commentId]`

#### Response
```json
{
  "data": {
    "deleted": {
      "id": "c1234567890",
      "author": "john.doe",
      "message": "Updated comment message",
      "createdAt": "2025-10-24T10:00:00.000Z",
      "updatedAt": "2025-10-24T11:00:00.000Z"
    },
    "message": "Comment deleted successfully"
  },
  "success": true
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "success": false,
  "details": ["Additional error details"] // Optional
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Features

### ✅ Implemented Features
- **Complete CRUD Operations**: GET, POST, PUT, PATCH, DELETE
- **Advanced Filtering**: By completion, priority, assigned user, tags
- **Search Functionality**: Search in title and description
- **Sorting**: By various fields with ascending/descending order
- **Pagination**: Page-based pagination with configurable limits
- **Comments System**: Add, update, delete comments on todos
- **Subtask Support**: Create todos with parent-child relationships
- **Data Validation**: Comprehensive input validation
- **Error Simulation**: Realistic error handling for testing
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Modular Architecture**: Clean separation of concerns

### 🏗️ Architecture
- **Utility Functions**: Reusable functions in `/lib/todo-utils.ts`
- **Type Definitions**: Comprehensive types in `/projects/mod.todo/utils/todo-types.ts`
- **API Routes**: RESTful endpoints following Next.js App Router conventions
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Data Management**: In-memory storage with realistic data operations

### 🧪 Testing Features
- **Random Delays**: Simulates real network conditions (500-2000ms)
- **Error Simulation**: 25-30% chance of random errors for testing resilience
- **Realistic Data**: Comprehensive sample data with todos, subtasks, and comments

This API provides a complete, production-ready foundation for a todo application with all the features you'd expect in a modern web application.
