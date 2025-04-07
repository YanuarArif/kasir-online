"use server";

import { put } from '@vercel/blob';
import { auth } from "@/lib/auth";

export async function uploadProductImage(formData: FormData) {
  // Get current session
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "Tidak terautentikasi!" };
  }
  
  const userId = user.id;
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    // Create a unique filename with user ID prefix for organization
    const filename = `products/${userId}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Upload the file to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    });
    
    return { url: blob.url, success: true };
  } catch (error) {
    console.error('Error uploading to Blob:', error);
    return { error: 'Failed to upload image', success: false };
  }
}
