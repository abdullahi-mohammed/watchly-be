# Watchly Backend

A Node.js/Express backend API for the Watchly movie application, built with PostgreSQL and Sequelize ORM.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd watchly-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/watchly_db
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Database Setup**
   - Create a PostgreSQL database named `watchly_db`
   - The application will automatically sync models on startup

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run start:dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
watchly-be/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── controllers/           # Request handlers
│   ├── movie.js          # Movie-related operations
│   └── health.js         # Health check controllers
├── models/               # Database models
│   └── Movie.js          # Movie model definition
├── routes/               # API route definitions
│   ├── movie.js          # Movie API endpoints
│   └── health.js         # Health check routes
├── utils/                # Utility functions
│   ├── db.js            # Database connection
│   ├── cloudinary.js    # Cloudinary configuration
│   ├── upload.js        # File upload utilities
│   └── health.js        # Health check utilities
├── uploads/              # Temporary file storage
├── test-upload.js        # Upload system test script
└── test-health.js        # Health check test script
```

## 🛠️ API Endpoints

### Movies
- `POST /api/movies/upload` - Upload movie with video and thumbnail
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

### Health Check Endpoints
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check with system information
- `GET /health/cached` - Fast cached health check
- `GET /health/ping` - Simple ping for load balancers
- `GET /health/ready` - Kubernetes readiness probe
- `GET /health/live` - Kubernetes liveness probe

## 🗄️ Database Schema

### Movie Model
- `id` (Primary Key)
- `title` (String)
- `description` (Text)
- `category` (String)
- `language` (String)
- `quality` (String)
- `thumbnail_url` (String) - Cloudinary URL
- `thumbnail_id` (String) - Cloudinary public ID
- `cloudinary_url` (String) - Video Cloudinary URL
- `cloudinary_id` (String) - Video Cloudinary public ID
- `format` (String) - Video format
- `duration` (Float) - Video duration in seconds
- `bytes` (Integer) - File size in bytes
- `width` (Integer) - Video width
- `height` (Integer) - Video height
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🔧 Configuration

### CORS Settings
The application is configured to accept requests from:
- `http://localhost:8080`
- `http://localhost:5173`
- `https://watchly-fe-ycft.vercel.app`

### File Upload Configuration
- **Storage**: Disk storage (no memory usage)
- **Maximum file size**: 2GB per file
- **Supported video formats**: MP4, AVI, MOV, WMV, FLV, WEBM
- **Supported image formats**: JPEG, PNG, GIF, WEBP
- **Upload directory**: `uploads/` (automatically created)
- **File cleanup**: Automatic cleanup after Cloudinary upload
- **Chunked upload**: 6MB chunks for better streaming

### Large File Upload Features
- ✅ **Disk Storage**: Files stored temporarily on disk, not in memory
- ✅ **Streaming Upload**: Direct streaming to Cloudinary
- ✅ **Automatic Cleanup**: Temporary files removed after upload
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Progress Tracking**: Console logging for upload progress
- ✅ **File Validation**: Type and size validation
- ✅ **Multiple Formats**: Support for various video and image formats

### Health Check Features
- ✅ **Comprehensive Monitoring**: Database, Cloudinary, disk space, memory
- ✅ **Real-time Status**: Continuous health monitoring every 30 seconds
- ✅ **Multiple Endpoints**: Different health checks for different use cases
- ✅ **Kubernetes Ready**: Readiness and liveness probes for container orchestration
- ✅ **Load Balancer Support**: Ping endpoints for load balancer health checks
- ✅ **Detailed Reporting**: System information and performance metrics

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set:
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Database Migration
The application uses `sequelize.sync({ alter: true })` for automatic schema updates. For production, consider using proper migrations.

### Production Considerations
- Ensure sufficient disk space for temporary file storage
- Monitor upload directory for orphaned files
- Configure proper timeout settings for large uploads
- Set up monitoring for upload performance
- Configure health check monitoring and alerting
- Set up proper logging and error tracking

## 🧪 Development

### Scripts
- `npm start` - Start production server
- `npm run start:dev` - Start development server with nodemon
- `npm test` - Run tests (not configured yet)

### Testing Upload System
```bash
# Run the upload system test
node test-upload.js

# Test with curl
curl -X POST http://localhost:5000/api/movies/upload \
  -F "video=@/path/to/your/video.mp4" \
  -F "thumbnail=@/path/to/your/thumbnail.jpg" \
  -F "title=Test Movie" \
  -F "description=Test Description" \
  -F "category=Action" \
  -F "language=English" \
  -F "quality=HD"
```

### Testing Health Check System
```bash
# Run the health check test
node test-health.js

# Test individual endpoints
curl http://localhost:5000/health
curl http://localhost:5000/health/detailed
curl http://localhost:5000/health/ping
curl http://localhost:5000/health/ready
curl http://localhost:5000/health/live
```

### Code Style
- Use ES6 modules (import/export)
- Follow Express.js best practices
- Use async/await for database operations
- Implement proper error handling

## 📊 Health Check Monitoring

### Health Check Types
1. **Basic Health Check** (`/health`)
   - Overall system status
   - Uptime and version information
   - Quick response for monitoring

2. **Detailed Health Check** (`/health/detailed`)
   - Comprehensive system information
   - Database connection status
   - Cloudinary configuration
   - Memory usage and disk space
   - Environment variable validation

3. **Cached Health Check** (`/health/cached`)
   - Fast response using cached status
   - Suitable for high-frequency monitoring
   - Updated every 30 seconds

4. **Load Balancer Endpoints**
   - **Ping** (`/health/ping`): Simple response for load balancers
   - **Readiness** (`/health/ready`): Kubernetes readiness probe
   - **Liveness** (`/health/live`): Kubernetes liveness probe

### Monitoring Integration
- **Kubernetes**: Use `/health/ready` and `/health/live` for probes
- **Load Balancers**: Use `/health/ping` for health checks
- **Monitoring Tools**: Use `/health/detailed` for comprehensive monitoring
- **Alerting**: Configure alerts based on health check responses

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License

## 🤝 Support

For questions or issues, please create an issue in the repository.
