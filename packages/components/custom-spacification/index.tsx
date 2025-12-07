'use client';

import { Controller, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from 'lucide-react';
import Input from '../input';

const CustomSpecifications = ({ control, error }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_specifications',
  });

  return (
    <div>
      <label className="block font-semibold text-gray-300 mb-2">
        Custom Specifications
      </label>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-center">
            {/* KEY FIELD */}
            <Controller
              name={`custom_specifications.${index}.key`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label={`Key ${index + 1}`}
                  type="text"
                  placeholder="eg., battery life ,wight ,material"
                  {...field}
                />
              )}
            />

            {/* VALUE FIELD */}
            <Controller
              name={`custom_specifications.${index}.value`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label={`Value ${index + 1}`}
                  placeholder="eg., 6kg, 4000mAh ,plastic"
                  type="text"
                  {...field}
                />
              )}
            />

            {/* REMOVE BUTTON */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 bg-red-500 text-white rounded"
            >
              <TrashIcon size={18} />
            </button>
          </div>
        ))}

        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={() => append({ key: '', value: '' })}
          className="flex items-center gap-2 text-blue-400"
        >
          <PlusIcon size={18} />
          Add Specification
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CustomSpecifications;
