# Supabase Storage Setup

This guide explains how to set up the required storage bucket for payment images.

## Required Storage Bucket

You need to create a public storage bucket named `payment-images` in your Supabase project.

## Setup Steps

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Create a new bucket with the following settings:
   - **Name**: `payment-images`
   - **Public**: Yes (enable public access)
5. Click **Create bucket**

## Bucket Structure

The application will automatically organize files in the following structure:

```
payment-images/
├── payment-qr/          # Admin-uploaded QR codes
│   └── qr-code-*.jpg/png
└── payment-screenshots/ # User-uploaded payment proofs
    └── payment-*.jpg/png
```

## Security Policies

The bucket should allow:
- **Authenticated users (admin)**: Full access (insert, select, update, delete)
- **Anonymous users**: Read access for QR codes, Upload access for payment screenshots

## Automatic Setup

The application will automatically create the folder structure when files are uploaded.

## Important Notes

- Maximum file size: 10MB for payment screenshots, 5MB for QR codes
- Supported formats: PNG, JPG, JPEG
- Only one QR code can be active at a time
- Payment screenshots are linked to orders for verification
