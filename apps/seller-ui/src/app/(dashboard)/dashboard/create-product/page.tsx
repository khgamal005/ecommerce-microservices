'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ImagePlaceholder from 'apps/seller-ui/src/shared/components/image-placeholder';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  tags: string;
  images: (File | null)[];
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [openImageModel, setOpenImageModel] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const [images, setImages] = useState<(File | null)[]>([null]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      tags: '',
      images: [null],
    },
  });

  // ------------------------------
  // HANDLE IMAGE CHANGE
  // ------------------------------
  const handleImageChange = (file: File, index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = file;

      // Add new empty slot if last one is filled
      if (index === prev.length - 1 && prev.length < 8) {
        updated.push(null);
      }

      setValue('images', updated);
      return updated;
    });
  };

  // ------------------------------
  // REMOVE IMAGE
  // ------------------------------
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      let updated = [...prev];

      if (index === 0) {
        updated[0] = null;
      } else {
        updated.splice(index, 1);
      }

      if (!updated.includes(null) && updated.length < 8) {
        updated.push(null);
      }

      setValue('images', updated);
      return updated;
    });
  };

  // ------------------------------
  // SUBMIT FORM
  // ------------------------------
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitMessage('Product created successfully!');
      reset();
      setImages([null]); // reset images
    } catch (error) {
      setSubmitMessage('Error creating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
    'Other',
  ];

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto rounded-lg text-white"
      >
        <h2 className="text-2xl py-2 font-bold text-white font-poppins">
          Create New Product
        </h2>

        <div className="flex items-center">
          <span className="text-sm font-medium text-[#80deea] cursor-pointer">
            dashboard
          </span>
          <ChevronRight size={20} className="opacity-[.8]" />
          <span>Create Product</span>
        </div>

        <div className="py-4 w-full gap-6 flex">
          {/* LEFT — IMAGE UPLOAD */}
          <div className="md:w-[65%] w-[35%]">
            {images.length > 0 && (
              <ImagePlaceholder
                setOpenImageModel={setOpenImageModel}
                size="275 * 850"
                small={false}
                index={0}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
                defaultImage={null}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {images.slice(1).map((_, index) => (
              <ImagePlaceholder
                key={index}
                setOpenImageModel={setOpenImageModel}
                size="275 * 850"
                small={false}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
                defaultImage={null}
              />
            ))}
          </div>
        </div>

                {/* right side */}
        <div className="w-[65%] ">
          <div className='w-full flex gap-6'>
            <div className="2/4">
              {/* <Input
                type="text"
                label="Product Name"
                {...register('name', { required: true })}
                error={errors.name?.message}
              /> */}
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
