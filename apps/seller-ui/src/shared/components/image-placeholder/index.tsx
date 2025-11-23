import { X, WandSparkles, Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImagePlaceholderProps {
  size?: string;
  small?: boolean;
  onImageChange?: (file: File, index: number) => void;
  onRemoveImage?: (index: number) => void;
  defaultImage?: string | null;
  index?: number | null;
  setOpenImageModel?: (OpenImageModel: boolean) => void;
}

export default function ImagePlaceholder({
  size,
  small,
  onImageChange,
  onRemoveImage,
  defaultImage = null,
  index = null,
  setOpenImageModel,
}: ImagePlaceholderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    if (onImageChange && index !== null) {
      onImageChange(file, index);
    }
  };

  return (
    <div
      onClick={!imagePreview ? openFilePicker : undefined}
      className={`relative ${
        small ? "h-[180px]" : "h-[480px]"
      } w-full bg-black border border-gray-300 rounded-lg flex flex-col items-center justify-center`}
    >
      <input
        ref={inputRef}
        id={`image-upload-${index}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {imagePreview ? (
        <>
          <button
            type="button"
            onClick={() => onRemoveImage?.(index!)}
            className="absolute top-3 right-3 z-10 p-2 text-white bg-red-500 rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>

          <button
            type="button"
            onClick={() => setOpenImageModel?.(true)}
            className="absolute top-3 left-3 z-10 p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
          >
            <WandSparkles size={16} />
          </button>

          <Image
            src={imagePreview}
            alt="Image"
            fill
            className="object-cover rounded-lg"
          />
        </>
      ) : (
        <>
          <label
            onClick={openFilePicker}
            className="absolute top-3 right-3 p-2 rounded bg-slate-500 shadow-lg cursor-pointer"
          >
            <Pencil size={16} />
          </label>

          <p
            className={`text-gray-400 ${
              small ? "text-xl" : "text-4xl"
            } font-semibold`}
          >
            {size}
          </p>

          <p
            className={`text-gray-500 ${
              small ? "text-sm" : "text-lg"
            } text-center pt-2`}
          >
            please choose an image <br />
            according to the size
          </p>
        </>
      )}
    </div>
  );
}
