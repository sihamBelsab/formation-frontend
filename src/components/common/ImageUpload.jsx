import { useState } from 'react';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';

const ImageUpload = ({ userId, setImageUrl }) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const [publicId, setPublicId] = useState(null);
  // Cloudinary upload widget config
  const uwConfig = {
    cloudName,
    uploadPreset,
    sources: ['local'],
    multiple: false, // Only upload one image at a time
    folder: 'user_images', // Save in user_images folder (optional)
    clientAllowedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'image/avif'],
    maxImageFileSize: 4000000, // Max image size 2MB
  };
  return (
    <div>
      <CloudinaryUploadWidget
        uwConfig={uwConfig}
        setPublicId={setPublicId}
        userId={userId}
        setImageUrl={setImageUrl}
      />
    </div>
  );
};

export default ImageUpload;
