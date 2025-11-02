#!/usr/bin/env node

/**
 * Firebase Storage CORS Setup Script
 * 
 * This script configures CORS for Firebase Storage to allow uploads from localhost
 * Run this script after installing Google Cloud SDK
 * 
 * Prerequisites:
 * 1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
 * 2. Authenticate: gcloud auth login
 * 3. Set project: gcloud config set project consultancy-services-48b5d
 * 4. Run: node setup-firebase-cors.js
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Try both bucket formats - check which one exists in your project
const BUCKET_NAMES = [
  'consultancy-services-48b5d.appspot.com',  // Default bucket format
  'consultancy-services-48b5d.firebasestorage.app'  // New bucket format
];
const CORS_CONFIG = {
  cors: [
    {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:3002',
        'https://consultancy-services-48b5d.firebaseapp.com',
        'https://consultancy-services-48b5d.web.app'
      ],
      method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      maxAgeSeconds: 3600,
      responseHeader: [
        'Content-Type',
        'Authorization', 
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers'
      ]
    }
  ]
};

async function setupCORS() {
  try {
    console.log('🚀 Setting up Firebase Storage CORS configuration...');
    
    // Write CORS config to temporary file
    const configFile = 'temp-cors-config.json';
    fs.writeFileSync(configFile, JSON.stringify(CORS_CONFIG, null, 2));
    
    console.log('📝 CORS configuration:');
    console.log(JSON.stringify(CORS_CONFIG, null, 2));
    
    // Apply CORS configuration to all possible bucket names
    console.log(`\n🔧 Applying CORS configuration to buckets...`);
    let successCount = 0;
    
    for (const bucketName of BUCKET_NAMES) {
      try {
        console.log(`\n  Attempting: gs://${bucketName}`);
        execSync(`gsutil cors set ${configFile} gs://${bucketName}`, { 
          stdio: 'pipe',
          encoding: 'utf8'
        });
        console.log(`  ✅ CORS configured for: ${bucketName}`);
        successCount++;
      } catch (error) {
        console.log(`  ⚠️  Skipped ${bucketName} (may not exist or no access)`);
      }
    }
    
    if (successCount === 0) {
      console.error('\n❌ Could not configure CORS automatically.');
      console.log('\n📋 MANUAL SETUP REQUIRED:');
      console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
      console.log('2. Select project: consultancy-services-48b5d');
      console.log('3. Go to Cloud Storage → Browser');
      console.log('4. Find and click on your bucket (likely: consultancy-services-48b5d.appspot.com)');
      console.log('5. Click "Configuration" tab');
      console.log('6. Scroll to "CORS configuration" section');
      console.log('7. Click "Edit CORS configuration"');
      console.log('8. Paste the JSON from cors-config.json file');
      console.log('9. Click "Save"');
      console.log('\n📄 CORS Configuration JSON:');
      console.log(JSON.stringify(CORS_CONFIG, null, 2));
      return;
    }
    
    console.log(`\n✅ CORS configuration applied to ${successCount} bucket(s)!`);
    
    // Verify CORS configuration
    console.log('\n🔍 Verifying CORS configuration...');
    for (const bucketName of BUCKET_NAMES) {
      try {
        execSync(`gsutil cors get gs://${bucketName}`, { 
          stdio: 'pipe',
          encoding: 'utf8'
        });
        console.log(`  ✅ Verified: ${bucketName}`);
      } catch (error) {
        // Silent fail for verification
      }
    }
    
    // Clean up
    fs.unlinkSync(configFile);
    
    console.log('\n🎉 Setup complete!');
    console.log('📝 Next steps:');
    console.log('1. Clear your browser cache');
    console.log('2. Restart your development server');
    console.log('3. Try uploading an image');
    console.log('4. Check browser console for success messages');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📋 Alternative manual setup:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project: consultancy-services-48b5d');
    console.log('3. Go to Storage → Rules');
    console.log('4. Update rules with the content from firebase-storage-rules.txt');
    console.log('5. Go to Google Cloud Console for CORS configuration');
  }
}

// Check if gsutil is available
try {
  execSync('gsutil version', { stdio: 'pipe' });
  setupCORS();
} catch (error) {
  console.log('❌ Google Cloud SDK (gsutil) not found');
  console.log('📥 Please install Google Cloud SDK first:');
  console.log('   https://cloud.google.com/sdk/docs/install');
  console.log('\n📋 Then run these commands:');
  console.log('   gcloud auth login');
  console.log('   gcloud config set project consultancy-services-48b5d');
  console.log('   node setup-firebase-cors.js');
}
