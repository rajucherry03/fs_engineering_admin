# ⚡ QUICK CORS FIX

## The Problem
Your app is trying to upload images from `http://localhost:5173` but Firebase Storage is blocking it with CORS errors.

## 🔴 URGENT: You MUST Configure CORS in Google Cloud Console

CORS cannot be fixed by code changes alone. You need to configure it in Google Cloud Console.

### Quick Steps (5 minutes):

1. **Go to Google Cloud Console**: https://console.cloud.google.com/storage/browser?project=consultancy-services-48b5d

2. **Find your bucket** (should be: `consultancy-services-48b5d.appspot.com`)

3. **Click on the bucket name**

4. **Click "Configuration" tab** (at the top)

5. **Scroll to "CORS configuration" section**

6. **Click "Edit CORS configuration"**

7. **Paste this JSON and Save**:

```json
[
  {
    "origin": ["http://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "X-Requested-With"
    ],
    "maxAgeSeconds": 3600
  }
]
```

8. **Wait 30 seconds**, then **hard refresh** your browser (Ctrl+Shift+R)

9. **Try uploading again**

---

## 🚀 OR Use Command Line (if you have gcloud CLI installed):

```bash
gsutil cors set cors-config.json gs://consultancy-services-48b5d.appspot.com
```

---

## ✅ After Setting Up CORS:

1. Clear browser cache
2. Restart dev server (`npm run dev`)
3. Try uploading an image
4. CORS errors should be gone!

**Note:** The code is already fixed. The only remaining step is configuring CORS in Google Cloud Console.

