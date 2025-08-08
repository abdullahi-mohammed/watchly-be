# Watchly Backend Architecture

## 🏗️ System Overview

Watchly Backend is a RESTful API built with Node.js and Express.js, designed to serve a movie management application. The system follows a layered architecture pattern with clear separation of concerns.

## 📐 Architecture Patterns

### 1. MVC (Model-View-Controller) Pattern
- **Models**: Database schema definitions using Sequelize ORM
- **Controllers**: Business logic and request handling
- **Routes**: API endpoint definitions and request routing

### 2. Layered Architecture
```
┌─────────────────────────────────────┐
│           API Layer                │
│        (Routes + Controllers)      │
├─────────────────────────────────────┤
│         Business Logic             │
│        (Controllers)               │
├─────────────────────────────────────┤
│         Data Access Layer          │
│        (Models + Utils)            │
├─────────────────────────────────────┤
│         Infrastructure             │
│    (Database + External Services)  │
└─────────────────────────────────────┘
```

## 🗄️ Database Architecture

### Technology Stack
- **Database**: PostgreSQL
- **ORM**: Sequelize.js
- **Connection**: Connection pooling via Sequelize

### Database Design
```sql
-- Movies Table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INTEGER,
    genre VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Flow
1. **Request** → Route Handler
2. **Route** → Controller Method
3. **Controller** → Model Operations
4. **Model** → Database Query
5. **Response** → Client

## 🔧 Technical Components

### 1. Express.js Application
```javascript
// app.js - Main application setup
- Middleware configuration (CORS, body parsing, cookie parsing)
- Route registration
- Database connection management
- Server startup with error handling
```

### 2. Database Connection
```javascript
// utils/db.js - Sequelize configuration
- Connection pooling
- Environment-based configuration
- Error handling and logging
```

### 3. File Upload System
```javascript
// utils/cloudinary.js - Cloudinary integration
- Image upload to cloud storage
- URL generation for frontend access
- Error handling for upload failures
```

## 🔄 Request Flow

### Typical API Request
```
Client Request
    ↓
CORS Middleware
    ↓
Body Parser Middleware
    ↓
Route Handler
    ↓
Controller Method
    ↓
Model Operations
    ↓
Database Query
    ↓
Response to Client
```

### Error Handling Flow
```
Request
    ↓
Try-Catch in Controller
    ↓
Database Error Handling
    ↓
HTTP Error Response
    ↓
Client Error Handling
```

## 🛡️ Security Considerations

### 1. CORS Configuration
- Whitelisted origins for cross-origin requests
- Configurable for different environments

### 2. File Upload Security
- File size limits (500MB)
- Cloudinary integration for secure file storage
- No local file storage for production

### 3. Database Security
- Connection pooling
- Parameterized queries (via Sequelize)
- Environment-based configuration

## 📊 Performance Considerations

### 1. Database Optimization
- Connection pooling via Sequelize
- Indexed primary keys
- Efficient query patterns

### 2. File Handling
- Cloudinary CDN for image delivery
- Asynchronous file upload processing
- No local file storage overhead

### 3. API Response
- JSON response format
- Configurable response limits
- Error handling without exposing internals

## 🔄 State Management

### Stateless Design
- No server-side session storage
- JWT tokens for authentication (planned)
- Stateless API design for scalability

### Data Persistence
- PostgreSQL for persistent data storage
- Cloudinary for file storage
- Environment variables for configuration

## 🚀 Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- External file storage (Cloudinary)

### Vertical Scaling
- Configurable server resources
- Database query optimization
- Efficient middleware stack

## 🔧 Configuration Management

### Environment Variables
```env
PORT=5000                    # Server port
DATABASE_URL=postgresql://   # Database connection
CLOUDINARY_CLOUD_NAME=       # Cloudinary config
CLOUDINARY_API_KEY=          # Cloudinary config
CLOUDINARY_API_SECRET=       # Cloudinary config
```

### Development vs Production
- Environment-based configuration
- Different CORS origins
- Database connection pooling
- Error logging levels

## 📈 Monitoring and Logging

### Current Implementation
- Console logging for development
- Error handling with process exit on DB failure
- Request/response logging (planned)

### Planned Improvements
- Structured logging
- Performance monitoring
- Health check endpoints
- API metrics collection

## 🔮 Future Architecture Considerations

### Planned Features
1. **Authentication System**
   - JWT token-based authentication
   - User management
   - Role-based access control

2. **Caching Layer**
   - Redis for session storage
   - API response caching
   - Database query caching

3. **Microservices Architecture**
   - Service separation
   - API gateway
   - Service discovery

4. **Event-Driven Architecture**
   - Message queues
   - Event sourcing
   - CQRS pattern

## 🧪 Testing Strategy

### Current State
- No automated tests implemented
- Manual testing via API endpoints

### Planned Testing
- Unit tests for controllers
- Integration tests for database operations
- API endpoint testing
- File upload testing

## 📚 Code Organization

### Directory Structure
```
watchly-be/
├── app.js              # Application entry point
├── controllers/        # Business logic layer
├── models/            # Data models
├── routes/            # API route definitions
├── utils/             # Utility functions
└── uploads/           # Temporary file storage
```

### Code Patterns
- ES6 modules (import/export)
- Async/await for database operations
- Middleware pattern for cross-cutting concerns
- Error handling with try-catch blocks
