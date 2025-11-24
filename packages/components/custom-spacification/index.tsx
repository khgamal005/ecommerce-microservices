'use client';

import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { PlusIcon, TrashIcon } from 'lucide-react';
import Input from '../input';

interface Spec {
  key: string;
  value: string;
}

interface CustomSpecificationsProps {
  control: any; // react-hook-form control
  name: string; // field name in form (e.g., "specifications")
  error?: string;
}

const CustomSpecifications: React.FC<CustomSpecificationsProps> = ({
  control,
  name,
  error,
}) => {
  const [specs, setSpecs] = useState<Spec[]>([{ key: '', value: '' }]);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    const updated = specs.filter((_, i) => i !== index);
    setSpecs(updated.length ? updated : [{ key: '', value: '' }]); // ensure at least one
  };

  const handleChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => {
        // Sync specs to react-hook-form when specs change
        useEffect(() => {
          field.onChange(specs);
        }, [specs]);

        return (
          <div className="w-full mt-4">
            <label className="block font-semibold text-gray-300 mb-2">
              Custom Specifications
            </label>

            <div className="flex flex-col gap-2">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Specification"
                    value={spec.key}
                    onChange={(e) => handleChange(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    aria-label="Remove specification"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSpec}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-700 mt-2"
                aria-label="Add specification"
              >
                <PlusIcon size={16} />
                Add Specification
              </button>
            </div>

            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
          </div>
        );
      }}
    />
  );
};

export default CustomSpecifications;
