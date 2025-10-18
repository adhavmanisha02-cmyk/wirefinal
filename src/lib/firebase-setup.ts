import { signUp } from './firebase-auth';

export const setupOwnerAccount = async () => {
  try {
    await signUp('owner@cablehq.com', 'SecurePass123!', 'Owner');
    console.log('Owner account created successfully');
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Owner account already exists');
    } else {
      console.error('Error creating owner account:', error);
    }
  }
};
