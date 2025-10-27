# Firebase Setup Instructions

## 1. Create a Test User in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `consultancy-services-48b5d`
3. Navigate to **Authentication** → **Users**
4. Click **Add User**
5. Enter the following details:
   - **Email**: `admin@example.com`
   - **Password**: `admin123` (or any password you prefer)
6. Click **Add User**

## 2. Test Login Credentials

Use these credentials to test the login:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## 3. Firebase Security Rules

Make sure your Firestore rules allow authenticated users to read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own admin user data
    match /adminUsers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 4. Testing the Application

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3001`
3. You should see the login page
4. Enter the test credentials
5. You should be redirected to the admin dashboard

## 5. Troubleshooting

If you encounter issues:

1. **Check Firebase Console**: Ensure the user was created successfully
2. **Check Browser Console**: Look for any error messages
3. **Check Network Tab**: Verify Firebase requests are being made
4. **Check Firestore**: Ensure the `adminUsers` collection is created with the user data

## 6. Default Admin User Creation

The application will automatically create an admin user in Firestore if:
- The user exists in Firebase Authentication
- But doesn't exist in the `adminUsers` Firestore collection

This ensures seamless onboarding for new users.
