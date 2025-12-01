import { UploadImage } from "apps/seller-ui/src/hook/useImageManagement";
import { X, WandSparkles, Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface ImagePlaceholderProps {
  size?: string;
  small?: boolean;
  onImageChange?: (file: File, index: number) => void;
  onRemoveImage?: (index: number) => void;
  defaultImage?: string | null;
  index?: number;
  setOpenImageModel?: (open: boolean) => void;
  setSelectedImage?: (image: string) => void;
  images: (UploadImage | null)[];
  uploading?: boolean;
}

export default function ImagePlaceholder({
  size,
  small,
  onImageChange,
  onRemoveImage,
  setSelectedImage,
  defaultImage = null,
  index = 0,
  images,
  setOpenImageModel,
  uploading = false,
}: ImagePlaceholderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setImagePreview(defaultImage), [defaultImage]);

  const openFilePicker = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    onImageChange?.(file, index);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    onRemoveImage?.(index);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const image = images[index];
    if (image?.file_Url) {
      setSelectedImage?.(image.file_Url);
      setOpenImageModel?.(true);
    }
  };

  const hasImage = imagePreview && images[index];

  return (
    <div
      onClick={!hasImage ? openFilePicker : undefined}
      className={`relative ${small ? "h-20" : "h-64"} w-full bg-black border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Spinner */}
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {hasImage ? (
        <>
          <button onClick={handleRemove} className="absolute top-2 right-2 z-10 p-1.5 text-white bg-red-500 rounded-full hover:bg-red-600">
            <X size={14} />
          </button>
          <button onClick={handleEdit} className="absolute top-2 left-2 z-10 p-1.5 text-white bg-blue-500 rounded-full hover:bg-blue-600">
            <WandSparkles size={14} />
          </button>
          <div className="relative w-full h-full">
            <Image
              src={imagePreview}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              onError={() => setImagePreview(null)}
            />
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
            className="absolute top-2 right-2 p-1.5 rounded bg-slate-600 hover:bg-slate-500 shadow-lg"
          >
            <Pencil size={14} className="text-white" />
          </button>
          <div className="text-center p-4">
            <p className={`text-gray-400 ${small ? "text-sm" : "text-lg"} font-semibold mb-2`}>{size}</p>
            <p className={`text-gray-500 ${small ? "text-xs" : "text-sm"}`}>Click to upload image</p>
            {!small && <p className="text-gray-500 text-xs mt-1">Recommended size: {size}</p>}
          </div>
        </>
      )}
    </div>
  );
}
