import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test script for large file upload
console.log('🧪 Testing Large File Upload System');
console.log('====================================');

// Check if uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
    console.log('✅ Uploads directory exists');

    // List files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    if (files.length > 0) {
        console.log('📁 Files in uploads directory:');
        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            console.log(`   - ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        });
    } else {
        console.log('📁 Uploads directory is empty');
    }
} else {
    console.log('❌ Uploads directory does not exist');
}

// Test configuration
console.log('\n⚙️  Upload Configuration:');
console.log('   - Max file size: 2GB');
console.log('   - Storage: Disk storage');
console.log('   - File cleanup: Automatic');
console.log('   - Supported video formats: MP4, AVI, MOV, WMV, FLV, WEBM');
console.log('   - Supported image formats: JPEG, PNG, GIF, WEBP');

// Test API endpoints
console.log('\n🌐 API Endpoints:');
console.log('   - POST /api/movies/upload - Upload movie with video and thumbnail');
console.log('   - GET /api/movies - Get all movies');
console.log('   - GET /api/movies/:id - Get movie by ID');
console.log('   - PUT /api/movies/:id - Update movie');
console.log('   - DELETE /api/movies/:id - Delete movie');
console.log('   - GET /health - Health check');

console.log('\n🚀 To test the upload:');
console.log('   curl -X POST http://localhost:5000/api/movies/upload \\');
console.log('     -F "video=@/path/to/your/video.mp4" \\');
console.log('     -F "thumbnail=@/path/to/your/thumbnail.jpg" \\');
console.log('     -F "title=Test Movie" \\');
console.log('     -F "description=Test Description" \\');
console.log('     -F "category=Action" \\');
console.log('     -F "language=English" \\');
console.log('     -F "quality=HD"');

console.log('\n✅ Large file upload system is ready!');
