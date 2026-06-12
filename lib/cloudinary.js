import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer to Cloudinary.
 * Returns the secure URL and public_id.
 *
 * @param {Buffer} fileBuffer  - The raw file buffer from multer
 * @param {string} folder      - Cloudinary folder name
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImage(fileBuffer, folder = 'punjab-times') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 675, crop: 'limit', quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url:      result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

/**
 * Deletes an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId) {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;