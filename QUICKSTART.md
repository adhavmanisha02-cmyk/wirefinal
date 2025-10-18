# Quick Start Guide - Firebase Migration

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

### Step 2: Firebase Console Setup (3 minutes)

1. **Go to Firebase Console**: https://console.firebase.google.com/project/wirewala-dcccd

2. **Enable Authentication**:
   - Click "Authentication" → "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password" ✅
   - Enable "Phone" ✅
   - In Phone, scroll to "Phone numbers for testing"
   - Add: `+919999999999` with code: `123456`

3. **Create Firestore Database**:
   - Click "Firestore Database" → "Create database"
   - Select "Start in production mode"
   - Choose location: `asia-south1` (India) or nearest
   - Click "Enable"

4. **Set Firestore Rules**:
   - In Firestore, go to "Rules" tab
   - Replace everything with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    match /inquiries/{inquiryId} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /payment_settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
   - Click "Publish"

5. **Enable Storage**:
   - Click "Storage" → "Get started"
   - Select "Start in production mode"
   - Use same location as Firestore
   - Click "Done"

6. **Set Storage Rules**:
   - In Storage, go to "Rules" tab
   - Replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
   - Click "Publish"

### Step 3: Start the App (30 seconds)
```bash
npm run dev
```

### Step 4: Test Everything (1 minute)

1. **Test Owner Login**:
   - Go to: http://localhost:5173/owner/login
   - Email: `owner@cablehq.com`
   - Password: `SecurePass123!`
   - Should redirect to Owner Dashboard

2. **Test Product Management**:
   - In Owner Dashboard, click "Add Product"
   - Fill in details and optionally upload an image
   - Click "Add Product"
   - Product should appear in the list immediately

3. **Test Real-Time Sync** (Optional):
   - Open app in another browser/tab
   - Add a product in one tab
   - Watch it appear in the other tab instantly!

4. **Test User Login**:
   - Go to main page
   - Click "Login" button
   - Enter: `+919999999999`
   - Enter code: `123456`
   - Should log in successfully

## ✅ You're Done!

The core features are now working:
- ✅ Firebase authentication
- ✅ Product management with real-time sync
- ✅ Image uploads
- ✅ Owner and user login
- ✅ Global data synchronization

## 📋 What's Working

- Owner Dashboard with product management
- Real-time product synchronization across devices
- Image upload for products
- Phone authentication for users
- Email authentication for owner
- Owner account auto-creation

## 🔄 What Still Needs Work

See `REMAINING_WORK.md` for the list of pages that still need Firebase integration:
- Orders Management (admin side)
- Payment Settings (QR upload)
- Checkout (order creation and payment proof)
- User Orders page
- User Profile page
- Product listing and detail pages
- Inquiry form

## 🆘 Troubleshooting

**Firebase not initialized error?**
- Check that all Firebase services are enabled in console
- Verify rules are published

**Phone authentication not working?**
- Ensure test phone number is added in Firebase Console
- Check reCAPTCHA isn't blocked by browser

**Images not uploading?**
- Verify Storage is enabled
- Check storage rules are set correctly

**Products not syncing?**
- Open browser console and check for errors
- Verify Firestore rules are set correctly
- Check that authentication is working

## 📚 More Information

- **Full Setup Guide**: See `FIREBASE_SETUP.md`
- **Migration Summary**: See `MIGRATION_SUMMARY.md`
- **Remaining Work**: See `REMAINING_WORK.md`

## 🎉 Success!

Your app is now using Firebase for:
- Global real-time data synchronization
- Secure authentication
- Image storage
- Cross-device functionality

Enjoy your Firebase-powered application!
