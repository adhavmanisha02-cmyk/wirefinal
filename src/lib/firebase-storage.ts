import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);

  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }
};

export const uploadProductImage = async (
  file: File,
  productId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `products/${productId}/${Date.now()}_${file.name}`;
  return uploadImage(file, path, onProgress);
};

export const uploadPaymentProof = async (
  file: File,
  orderId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `payment-proofs/${orderId}/${Date.now()}_${file.name}`;
  return uploadImage(file, path, onProgress);
};

export const uploadQRCode = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `payment-qr/qr_${Date.now()}_${file.name}`;
  return uploadImage(file, path, onProgress);
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
