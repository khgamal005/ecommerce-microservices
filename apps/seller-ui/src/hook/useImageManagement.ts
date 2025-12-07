import { useState } from 'react';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { convertFileToBase64 } from 'apps/seller-ui/src/utils/imageUtils';

export interface UploadImage {
  fileId: string;
  file_Url: string;
}

export const useImageManagement = (
  initialImages: (UploadImage | null)[] = [],
  onImagesChange?: (images: (UploadImage | null)[]) => void
) => {
  const [images, setImages] = useState<(UploadImage | null)[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState('');
  const [openImageModel, setOpenImageModel] = useState(false);
  const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);
  const MAX_IMAGES = 8;

  const isUploading = (index: number) => uploadingIndexes.includes(index);

  const updateImages = (updated: (UploadImage | null)[]) => {
    setImages(updated);
    if (onImagesChange) onImagesChange(updated);
  };

  const handleImageChange = async (file: File, index: number) => {
    if (!file) return;

    setUploadingIndexes((prev) => [...prev, index]);
    try {
      const fileName = await convertFileToBase64(file);
      const response = await axiosInstance.post('/product/api/upload-image', {
        fileName,
      });

      const newImage: UploadImage = {
        fileId: response.data.fileId,
        file_Url: response.data.file_url,
      };

      const updated = [...images];
      updated[index] = newImage;

      if (index === updated.length - 1 && updated.length < MAX_IMAGES) {
        updated.push(null);
      }

      updateImages(updated);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingIndexes((prev) => prev.filter((i) => i !== index));
    }
  };
  const handleRemoveImage = async (index: number) => {
    const removedImage = images[index];

    if (removedImage?.fileId) {
      try {
        await axiosInstance.post('/product/api/delete-image', {
          fileId: removedImage.fileId,
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getValidImages = () => images.filter(Boolean) as UploadImage[];

  return {
    images,
    selectedImage,
    setSelectedImage,
    openImageModel,
    setOpenImageModel,
    handleImageChange,
    handleRemoveImage,
    isUploading,
    getValidImages,
    MAX_IMAGES,
    setImages,
  };
};

// export const useImageManagement = (initialImages: UploadImage[] = []) => {
//   const [images, setImages] = useState<(UploadImage | null)[]>(initialImages);
//   const [selectedImage, setSelectedImage] = useState('');
//   const [openImageModel, setOpenImageModel] = useState(false);
//   const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);
//   const MAX_IMAGES = 8;

//   const isUploading = (index: number) => uploadingIndexes.includes(index);
//   const handleImageChange = async (file: File, index: number) => {
//     if (!file) return;

//     try {
//       // Start spinner for this image
//       setUploadingIndexes((prev) => [...prev, index]);

//       // Convert file to base64
//       const fileName = await convertFileToBase64(file);

//       // Upload to server
//       const response = await axiosInstance.post('/product/api/upload-image', {
//         fileName,
//       });

//       // Create new image object
//       const newImage: UploadImage = {
//         fileId: response.data.fileId,
//         file_Url: response.data.file_url,
//       };

//       // Update images array
//       setImages((prev) => {
//         const updated = [...prev];
//         updated[index] = newImage;

//         if (index === updated.length - 1 && updated.length < MAX_IMAGES) {
//           updated.push(null as any);
//         }

//         return updated;
//       });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     } finally {
//       // Stop spinner for this image
//       setUploadingIndexes((prev) => prev.filter((i) => i !== index));
//     }
//   };

//   const handleRemoveImage = async (index: number) => {
//     const removedImage = images[index];

//     if (removedImage?.fileId) {
//       try {
//         await axiosInstance.post('/product/api/delete-image', {
//           fileId: removedImage.fileId,
//         });
//       } catch (error) {
//         console.error('Error deleting image:', error);
//       }
//     }

//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // const handleEditImage = (index: number) => {
//   //   const image = images[index];
//   //   if (!image?.file_Url) return;

//   //   setSelectedImage(image.file_Url);
//   //   setOpenImageModel(true);}

//   const getValidImages = () => images.filter(Boolean) as UploadImage[];

//   return {
//     images,
//     selectedImage,
//     setSelectedImage,
//     openImageModel,
//     setOpenImageModel,
//     handleImageChange,
//     handleRemoveImage,
//     getValidImages,
//     isUploading,
//     MAX_IMAGES,
//   };
// };
