import { put, del } from '@vercel/blob';

// Upload a file to Vercel Blob
export async function uploadToBlob(file: File, userId: string) {
  try {
    // Create a unique filename with user ID prefix for organization
    const filename = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
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

// Delete a file from Vercel Blob
export async function deleteFromBlob(url: string) {
  try {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Blob:', error);
    return { error: 'Failed to delete image', success: false };
  }
}
