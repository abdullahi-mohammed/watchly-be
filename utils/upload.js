import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Allow video files
    if (file.fieldname === 'video') {
        const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
        if (allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid video file type. Allowed types: MP4, AVI, MOV, WMV, FLV, WEBM'), false);
        }
    }
    // Allow image files for thumbnails
    else if (file.fieldname === 'thumbnail') {
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image file type. Allowed types: JPEG, PNG, GIF, WEBP'), false);
        }
    }
    else {
        cb(new Error('Unexpected field name'), false);
    }
};

// Configure multer with disk storage
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
        files: 2 // Maximum 2 files (video + thumbnail)
    }
});

// Function to upload file to Cloudinary using streams
export const uploadToCloudinary = (filePath, resourceType = 'auto', options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: 'watchly',
                ...options
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        // Create read stream and pipe to Cloudinary
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(uploadStream);

        // Handle stream errors
        readStream.on('error', (error) => {
            reject(error);
        });
    });
};

// Function to clean up uploaded files
export const cleanupFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error cleaning up file ${filePath}:`, error);
    }
};

// Function to clean up multiple files
export const cleanupFiles = (files) => {
    if (!files) return;

    Object.values(files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
            fileArray.forEach(file => {
                if (file.path) {
                    cleanupFile(file.path);
                }
            });
        }
    });
};

// Middleware to handle upload errors
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 2GB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 2 files allowed.'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + error.message
        });
    }

    if (error.message.includes('Invalid')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next(error);
};
