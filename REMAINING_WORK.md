# Remaining Work for Complete Firebase Migration

## Completed ✅

1. Firebase configuration and setup
2. Firebase Authentication (phone OTP + email/password)
3. Firebase Firestore database services
4. Firebase Storage for images
5. User authentication context (phone login)
6. Owner authentication context (email login)
7. Owner Dashboard - Products Management (with real-time sync and image upload)
8. Owner Login page
9. Phone auth components (SendOTP, VerifyOTP)

## Still Needs Migration 🔄

The following components still reference the old Supabase setup and need to be migrated to Firebase:

### High Priority

1. **Orders Management** (`src/components/dashboard/OrdersManagement.tsx`)
   - Update to use `ordersDB` from Firebase
   - Implement real-time order sync
   - Add order deletion that syncs globally

2. **Payment Settings** (`src/components/dashboard/PaymentSettings.tsx`)
   - Update to use `paymentSettingsDB` from Firebase
   - Fix QR code image upload using Firebase Storage
   - Use `uploadQRCode` from `firebase-storage.ts`

3. **Checkout Page** (`src/pages/Checkout.tsx`)
   - Update to use `ordersDB.create()` for order creation
   - Fix payment proof upload using Firebase Storage
   - Use `uploadPaymentProof` from `firebase-storage.ts`

4. **Orders Page** (`src/pages/Orders.tsx`)
   - Update to use `ordersDB.getByUserId()` to fetch user orders
   - Implement real-time order updates
   - Show only authenticated user's orders

5. **Profile Page** (`src/pages/Profile.tsx`)
   - Update to use `usersDB` from Firebase
   - Load user profile from Firestore
   - Allow profile editing and save to Firestore

6. **Products Page** (`src/pages/Products.tsx`)
   - Update to use `productsDB.onSnapshot()` for real-time product list
   - Replace localStorage with Firebase Firestore

7. **Product Detail Page** (`src/pages/ProductDetail.tsx`)
   - Update to use `productsDB.getById()` from Firebase

8. **Inquiry Page** (`src/pages/Inquiry.tsx`)
   - Update to use `inquiriesDB.create()` from Firebase
   - Save inquiries to Firestore instead of localStorage

### Medium Priority

9. **Cart Storage** (`src/lib/cart-storage.ts`)
   - Consider migrating to Firestore for cross-device cart sync
   - Or keep localStorage for cart (less critical)

10. **Order Confirmation Page** (`src/pages/OrderConfirmation.tsx`)
    - Update to fetch order from Firebase using `ordersDB.getById()`

11. **Payment Verification** (`src/components/dashboard/PaymentVerification.tsx`)
    - Update to use Firebase Storage URLs for payment proofs
    - Fetch orders from Firestore

### Low Priority

12. Remove old Supabase files (after migration is complete):
    - `src/lib/supabase.ts`
    - `src/lib/phone-auth.ts` (if not needed)
    - `src/lib/db-services.ts`
    - `src/lib/products-data.ts` (seed data - keep for reference)
    - `src/lib/cart-storage.ts` (if migrated)
    - `src/lib/order-storage.ts`
    - `src/lib/inquiry-storage.ts`
    - All Supabase migration files in `supabase/` folder

## Quick Migration Pattern

For each component, follow this pattern:

### Before (Supabase):
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId);
```

### After (Firebase):
```typescript
import { productsDB } from '@/lib/firebase-db';

const product = await productsDB.getById(productId);
```

### For Real-Time Sync:
```typescript
useEffect(() => {
  const unsubscribe = productsDB.onSnapshot((products) => {
    setProducts(products);
  });

  return () => unsubscribe();
}, []);
```

### For Image Uploads:
```typescript
import { uploadProductImage } from '@/lib/firebase-storage';

const imageUrl = await uploadProductImage(imageFile, productId);
```

## Testing Checklist

After migrating each component:

- [ ] Owner can add/edit/delete products (real-time sync works)
- [ ] Owner can manage orders (view, update status, delete)
- [ ] Owner can upload QR code for payments
- [ ] Users can sign up/login with phone number
- [ ] Users can browse products (real-time updates)
- [ ] Users can add products to cart
- [ ] Users can place orders
- [ ] Users can upload payment proof
- [ ] Users can view their order history
- [ ] Users can view and edit their profile
- [ ] All images upload correctly to Firebase Storage
- [ ] Orders deleted from admin are removed from database
- [ ] Real-time sync works across multiple devices/browsers

## Notes

- The Firebase structure is already set up and working
- All database services are ready to use in `firebase-db.ts`
- All storage functions are ready in `firebase-storage.ts`
- Authentication is fully functional
- The main work is updating components to use Firebase instead of Supabase

## Estimated Time

- High Priority items: 3-4 hours
- Medium Priority items: 1-2 hours
- Low Priority cleanup: 30 minutes

Total: ~5-7 hours of focused development work
