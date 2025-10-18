# Firebase Setup Guide

This application has been migrated from Supabase to Firebase for global data synchronization.

## Firebase Configuration

The Firebase configuration is already set up in `src/lib/firebase.ts` with your project credentials.

## Firebase Services Enabled

### 1. Authentication
- **Email/Password Authentication** for owner login
- **Phone Authentication** for user login via OTP
- Owner credentials: `owner@cablehq.com` / `SecurePass123!`

### 2. Firestore Database
Collections structure:
- `products` - Product catalog (synced globally)
- `orders` - Customer orders
- `inquiries` - Customer inquiries
- `users` - User profiles
- `payment_settings` - Payment QR and UPI settings

### 3. Firebase Storage
Storage paths:
- `products/{productId}/` - Product images
- `payment-proofs/{orderId}/` - Payment proof uploads
- `payment-qr/` - QR code for payments

## Setup Instructions

### Step 1: Enable Firebase Services

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `wirewala-dcccd`

### Step 2: Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Phone** provider
   - Add your phone numbers for testing in the "Phone numbers for testing" section
   - Add test phone number: `+919999999999` with code: `123456` (for development)

### Step 3: Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your preferred location (e.g., `asia-south1` for India)

### Step 4: Set Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - read by all, write by authenticated owner only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'owner@cablehq.com';
    }

    // Orders collection - users can read their own, owner can read all
    match /orders/{orderId} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         request.auth.token.email == 'owner@cablehq.com');
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.token.email == 'owner@cablehq.com';
    }

    // Inquiries collection
    match /inquiries/{inquiryId} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         request.auth.token.email == 'owner@cablehq.com');
      allow create: if true;
      allow update, delete: if request.auth != null &&
        request.auth.token.email == 'owner@cablehq.com';
    }

    // Users collection - users can read/update own profile
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }

    // Payment settings - read by all, write by owner only
    match /payment_settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email == 'owner@cablehq.com';
    }
  }
}
```

### Step 5: Enable Firebase Storage

1. Navigate to **Storage**
2. Click **Get started**
3. Choose **Start in production mode**
4. Select the same location as Firestore

### Step 6: Set Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - read by all, write by authenticated owner only
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email == 'owner@cablehq.com';
    }

    // Payment proofs - read/write by authenticated users
    match /payment-proofs/{orderId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Payment QR - read by all, write by owner only
    match /payment-qr/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email == 'owner@cablehq.com';
    }
  }
}
```

## How to Use

### For Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The app will automatically create the owner account on first load

### Owner Dashboard Access

1. Navigate to `/owner/login`
2. Login with:
   - Email: `owner@cablehq.com`
   - Password: `SecurePass123!`

### User Login

1. Users can login using their phone number
2. An OTP will be sent via Firebase Authentication
3. Enter the OTP to complete login

## Key Features

### Real-Time Synchronization
- All product changes in the Owner Dashboard sync globally in real-time
- Orders and inquiries update automatically across all devices
- No manual refresh needed

### Image Uploads
- Product images upload directly to Firebase Storage
- Payment QR codes stored in Firebase Storage
- Payment proof images uploaded by customers

### Secure Access
- Owner-only access to dashboard and product management
- Users can only see their own orders and profile
- Phone authentication for secure user login

## Troubleshooting

### Phone Authentication Not Working
1. Ensure you've added test phone numbers in Firebase Console
2. Check that phone authentication is enabled
3. Verify reCAPTCHA is not being blocked

### Images Not Uploading
1. Check Firebase Storage is enabled
2. Verify storage security rules are set correctly
3. Ensure the file size is under Firebase limits

### Orders Not Syncing
1. Check Firestore security rules
2. Verify user is authenticated
3. Check browser console for errors

## Important Notes

- **Owner account** is automatically created on first app load
- **Data syncs globally** across all devices in real-time
- **Images are stored** in Firebase Storage, not as base64 strings
- **Phone authentication** requires Firebase project configuration
