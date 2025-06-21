import { useEffect, useRef } from 'react';
import { userApi } from '../../api'; // Updated to use new centralized API

const CloudinaryUploadWidget = ({ uwConfig, setPublicId, userId, setImageUrl }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  const updateAvatar = async image => {
    try {
      const res = await userApi.updateAvatar(userId, image);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create Cloudinary Upload Widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === 'success') {
              updateAvatar(result.info.public_id);
              setPublicId(result.info.public_id); // Set the public ID after upload
              // Optionally, you can also update the image URL in your state or perform other actions
              const imageUrl = `https://res.cloudinary.com/${uwConfig.cloudName}/image/upload/${result.info.public_id}`;
              setImageUrl(imageUrl);
            } else {
              console.error('Error uploading image:', error);
            }
          }
        );

        // Open the upload widget when the button is clicked
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener('click', handleUploadClick);

        // Cleanup the event listener when the component unmounts
        return () => {
          buttonElement.removeEventListener('click', handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setPublicId]);

  return (
    <button ref={uploadButtonRef} id='upload_widget' className='cloudinary-button'>
      Upload
    </button>
  );
};

export default CloudinaryUploadWidget;
