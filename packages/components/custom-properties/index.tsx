'use client';

import { Controller } from 'react-hook-form';
import { PlusIcon, TrashIcon } from 'lucide-react';
import Input from '../input';
import { useEffect, useState } from 'react';

const CustomProperties = ({ control, error }: any) => {
  const [properties, setProperties] = useState<{ label: string; values: string[] }[]>([]);
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const addProperty = () => {
    if (!label.trim()) return;
    setProperties([...properties, { label, values: [] }]);
    setLabel('');
  };

  const removeProperty = (index: number) => {
    const updated = [...properties];
    updated.splice(index, 1);
    setProperties(updated);
  };

  const addValue = (index: number) => {
    if (!value.trim()) return;
    const updated = [...properties];
    updated[index].values.push(value);
    setProperties(updated);
    setValue('');
  };

  const removeValue = (propertyIndex: number, valueIndex: number) => {
    const updated = [...properties];
    updated[propertyIndex].values.splice(valueIndex, 1);
    setProperties(updated);
  };

  return (
    <div>
      <label className="block font-semibold text-gray-300 mb-2">
        Custom Properties
      </label>

      {/* Bind to RHF */}
      <Controller
        name="customProperties"
        control={control}
        render={({ field }) => {
          useEffect(() => {
            field.onChange(properties);
          }, [properties]);

          return null; // no UI needed
        }}
      />

      {/* UI manually controlled */}
      <div className='flex gap-3 mb-4'>
        <Input
          label='Property Name'
          type='text'
          value={label}
          placeholder='eg., Material'
          onChange={(e) => setLabel(e.target.value)}
        />

        <button
          type='button'
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={addProperty}
        >
          Add Property
        </button>
      </div>

      <div className='flex flex-col gap-3'>
        {properties.map((property, pIndex) => (
          <div
            key={pIndex}
            className='border border-gray-700 p-3 rounded-lg bg-gray-900'
          >
            <div className='flex items-center justify-between'>
              <span className='text-white font-medium'>{property.label}</span>
              <button onClick={() => removeProperty(pIndex)}>
                <TrashIcon className='w-5 h-5 text-red-500' />
              </button>
            </div>

            {/* VALUES LIST */}
            <div className='mt-2 ml-3 flex flex-wrap gap-2'>
              {property.values.map((v, vIndex) => (
                <span
                  key={vIndex}
                  className='bg-gray-700 text-white px-2 py-1 rounded-lg flex items-center gap-1'
                >
                  {v}

                  <button onClick={() => removeValue(pIndex, vIndex)}>
                    <TrashIcon className='w-4 h-4 text-red-400' />
                  </button>
                </span>
              ))}
            </div>

            {/* ADD VALUE */}
            <div className='flex gap-3 mt-3'>
              <Input
                label='Add Value'
                type='text'
                value={activeIndex === pIndex ? value : ''}
                onChange={(e) => {
                  setActiveIndex(pIndex);
                  setValue(e.target.value);
                }}
              />

              <button
                type='button'
                onClick={() => addValue(pIndex)}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
              >
                <PlusIcon className='w-5 h-5' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CustomProperties;
