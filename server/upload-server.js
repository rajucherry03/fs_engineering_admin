const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'consultancy-services-48b5d.firebasestorage.app'
});

const bucket = getStorage().bucket();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload endpoint for base64 images
app.post('/api/upload-image', async (req, res) => {
  try {
    const { imageData, path, filename } = req.body;
    
    if (!imageData || !path || !filename) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Extract content type from base64 data URL if present
    let contentType = 'image/jpeg'; // default
    let base64Data = imageData;
    
    if (imageData.startsWith('data:')) {
      const match = imageData.match(/data:([^;]+);/);
      if (match) {
        contentType = match[1] || 'image/jpeg';
      }
      // Remove data URL prefix
      base64Data = imageData.replace(/^data:[^;]+;base64,/, '');
    }
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create file reference
    const file = bucket.file(`${path}${filename}`);
    
    // Upload file with proper content type
    await file.save(buffer, {
      metadata: {
        contentType: contentType,
        metadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'admin'
        }
      }
    });
    
    // Make file public and get download URL
    await file.makePublic();
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    
    console.log('Image uploaded successfully:', downloadURL);
    
    res.json({ 
      success: true, 
      downloadURL,
      filename: file.name
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message 
    });
  }
});

// Upload endpoint for multipart files
app.post('/api/upload-file', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { path, filename } = req.body;
    const file = bucket.file(`${path}${filename}`);
    
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'admin'
        }
      }
    });
    
    await file.makePublic();
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    
    res.json({ 
      success: true, 
      downloadURL,
      filename: file.name
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Upload server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📤 Upload endpoint: http://localhost:${PORT}/api/upload-image`);
});
