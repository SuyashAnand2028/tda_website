import multer from 'multer';
import pkg from 'cloudinary';
const { v2: cloudinaryV2 } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage configuration for different types
const createStorage = (folder, transformation = null) => {
  return new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
      folder: folder,
      format: async (req, file) => 'jpg', // Force jpg format
      public_id: (req, file) => {
        const timestamp = Date.now();
        const filename = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
        return `${folder}_${timestamp}_${filename}`;
      },
      transformation: transformation || [
        {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto'
        }
      ]
    },
  });
};

// Configure different storages
const teamStorage = createStorage('tda_team_members', [
  {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto'
  }
]);

const eventStorage = createStorage('tda_events', [
  {
    width: 1200,
    height: 600,
    crop: 'fill',
    quality: 'auto'
  }
]);

const newsStorage = createStorage('tda_news', [
  {
    width: 1200,
    height: 600,
    crop: 'fill',
    quality: 'auto'
  }
]);

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload middleware for different types
const createUpload = (storage) => {
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });
};

// Export different upload configurations
const teamUpload = createUpload(teamStorage);
const eventUpload = createUpload(eventStorage);
const newsUpload = createUpload(newsStorage);

export {
  teamUpload,
  eventUpload,
  newsUpload,
  cloudinaryV2 as cloudinary,
};
