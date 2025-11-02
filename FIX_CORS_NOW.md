# 🔧 FIX CORS ERROR - Step by Step Guide

## The Problem
Firebase Storage is blocking uploads from `http://localhost:5173` due to missing CORS configuration.

## Solution: Set Up CORS in Google Cloud Console

### Step 1: Access Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Make sure you're signed in with the account that owns the Firebase project
3. Select project: **consultancy-services-48b5d**

### Step 2: Navigate to Cloud Storage
1. In the left sidebar, click **"Cloud Storage"** → **"Buckets"**
2. You should see your bucket(s). Look for one of these:
   - `consultancy-services-48b5d.appspot.com` (likely this one)
   - `consultancy-services-48b5d.firebasestorage.app`

### Step 3: Configure CORS
1. Click on your bucket name
2. Click the **"Configuration"** or **"Settings"** tab
3. Scroll down to **"CORS configuration"** section
4. Click **"Edit CORS configuration"**
5. Replace any existing content with:

```json
[
  {
    "origin": [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ],
    "maxAgeSeconds": 3600
  }
]
```

6. Click **"Save"**

### Step 4: Verify Firebase Storage Rules
1. Go to: https://console.firebase.google.com/
2. Select project: **consultancy-services-48b5d**
3. Go to **Storage** → **Rules**
4. Make sure these rules are active:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. Click **"Publish"**

### Step 5: Restart Your Dev Server
1. Stop your current dev server (Ctrl+C)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart: `npm run dev`
4. Try uploading an image again

---

## Alternative: Using Command Line (If you have Google Cloud SDK)

```bash
# 1. Install Google Cloud SDK (if not installed)
# Download from: https://cloud.google.com/sdk/docs/install

# 2. Authenticate
gcloud auth login

# 3. Set project
gcloud config set project consultancy-services-48b5d

# 4. Apply CORS config
gsutil cors set cors-config.json gs://consultancy-services-48b5d.appspot.com

# OR if the bucket is different:
gsutil cors set cors-config.json gs://consultancy-services-48b5d.firebasestorage.app
```

---

## Still Not Working?

If CORS is still blocking after the above steps:

1. **Check your bucket name** - Look in the error message URL, it shows the actual bucket name
2. **Wait 1-2 minutes** - CORS changes can take a moment to propagate
3. **Hard refresh browser** - Ctrl+Shift+R or Cmd+Shift+R
4. **Try incognito mode** - This bypasses cache
5. **Check console** - Make sure you're logged in (authentication is required)

---

## Quick Test

After setting up CORS, you can test if it's working:
1. Open browser console
2. Try uploading an image
3. Check for errors - CORS errors should be gone
4. You should see successful upload messages in console

