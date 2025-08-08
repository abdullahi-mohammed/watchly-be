# Watchly Backend Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd watchly-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb watchly_db
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE watchly_db;
   ```

5. **Start development server**
   ```bash
   npm run start:dev
   ```

## 🛠️ Development Workflow

### Adding New Features

#### 1. Create a New Model
```bash
# Create model file
touch models/NewModel.js
```

Example model structure:
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const NewModel = sequelize.define('NewModel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Add more fields as needed
}, {
    timestamps: true
});

export default NewModel;
```

#### 2. Create Controller
```bash
# Create controller file
touch controllers/newModel.js
```

Example controller structure:
```javascript
import NewModel from '../models/NewModel.js';

// Get all items
export const getAllItems = async (req, res) => {
    try {
        const items = await NewModel.findAll();
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Create new item
export const createItem = async (req, res) => {
    try {
        const newItem = await NewModel.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get item by ID
export const getItemById = async (req, res) => {
    try {
        const item = await NewModel.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update item
export const updateItem = async (req, res) => {
    try {
        const item = await NewModel.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        await item.update(req.body);
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete item
export const deleteItem = async (req, res) => {
    try {
        const item = await NewModel.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        await item.destroy();
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
```

#### 3. Create Routes
```bash
# Create route file
touch routes/newModel.js
```

Example route structure:
```javascript
import express from 'express';
import {
    getAllItems,
    createItem,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/newModel.js';

const router = express.Router();

router.get('/', getAllItems);
router.post('/', createItem);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
```

#### 4. Register Routes in app.js
```javascript
// Add this to app.js
import newModelRoutes from './routes/newModel.js';

// Add this line with other route registrations
app.use('/api/newmodel', newModelRoutes);
```

### Database Operations

#### Running Migrations
```bash
# For development (auto-sync)
# This is handled automatically in app.js with sequelize.sync({ alter: true })

# For production, use proper migrations
npx sequelize-cli db:migrate
```

#### Seeding Data
```bash
# Create seed file
npx sequelize-cli seed:generate --name demo-data

# Run seeds
npx sequelize-cli db:seed:all
```

### File Upload Implementation

#### Adding File Upload to Controller
```javascript
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// File upload controller
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'watchly' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        const result = await uploadPromise;
        
        res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
};
```

## 🧪 Testing

### Manual API Testing
```bash
# Test GET endpoint
curl http://localhost:5000/api/movies

# Test POST endpoint
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Movie","description":"Test Description","releaseYear":2024,"genre":"Action"}'

# Test file upload
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/image.jpg"
```

### Using Postman
1. Import the API collection
2. Set up environment variables
3. Test all endpoints
4. Verify response formats

## 🔧 Common Tasks

### Adding Environment Variables
1. Add to `.env` file:
   ```env
   NEW_VARIABLE=value
   ```

2. Access in code:
   ```javascript
   import dotenv from 'dotenv';
   dotenv.config();
   
   const value = process.env.NEW_VARIABLE;
   ```

### Database Schema Changes
1. Update the model file
2. Restart the server (auto-sync will apply changes)
3. Test the new schema

### Adding New Dependencies
```bash
# Install new package
npm install package-name

# Install dev dependency
npm install --save-dev package-name
```

### Debugging

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U postgres -d watchly_db

# Check environment variables
echo $DATABASE_URL
```

#### Server Issues
```bash
# Check if port is in use
lsof -i :5000

# Kill process using port
kill -9 <PID>

# Check logs
npm run start:dev
```

#### File Upload Issues
```bash
# Check Cloudinary credentials
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY

# Test Cloudinary connection
node -e "const cloudinary = require('cloudinary').v2; console.log(cloudinary.config())"
```

## 📝 Code Quality

### Linting
```bash
# Install ESLint
npm install --save-dev eslint

# Run linting
npx eslint .

# Fix auto-fixable issues
npx eslint . --fix
```

### Code Formatting
```bash
# Install Prettier
npm install --save-dev prettier

# Format code
npx prettier --write .

# Check formatting
npx prettier --check .
```

## 🚀 Deployment

### Production Setup
1. Set production environment variables
2. Use production database
3. Configure proper CORS origins
4. Set up monitoring and logging
5. Use PM2 or similar process manager

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🐛 Troubleshooting

### Common Issues

#### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database connection errors
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists
- Check user permissions

#### CORS errors
- Verify CORS configuration in app.js
- Check if frontend URL is in allowed origins
- Test with Postman to isolate frontend issues

#### File upload errors
- Check Cloudinary credentials
- Verify file size limits
- Ensure proper file format
- Check network connectivity

### Performance Issues
- Monitor database query performance
- Check for N+1 query problems
- Implement caching where appropriate
- Use database indexing

### Security Issues
- Validate all input data
- Sanitize user inputs
- Use HTTPS in production
- Implement rate limiting
- Regular security audits

## 📚 Additional Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL GUI
- [Cloudinary Console](https://cloudinary.com/console) - File management

### Best Practices
- Always use async/await for database operations
- Implement proper error handling
- Validate input data
- Use environment variables for configuration
- Follow RESTful API conventions
- Write meaningful commit messages
- Test thoroughly before deployment
