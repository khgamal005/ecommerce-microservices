import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import Input from '../input';

const defaultColors = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FFA500', // Orange
  '#800080', // Purple
  '#000000', // Black
  '#FFFFFF', // White
  '#808080', // Gray
  '#A52A2A', // Brown
];

const ColorSelector = ({ control, error }: { control: any, error?: string }) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState<string>('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-1">Colors</label>

      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2 mb-3">
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ['#ffffff', '#f1f5f9', '#ffff00'].includes(
                color
              );

              return (
                <button
                  key={color}
                  type="button"
                  className={`w-7 h-7 rounded-md flex items-center justify-center border-2 transition
                    ${
                      isSelected
                        ? 'scale-110 border-white'
                        : 'border-transparent'
                    }
                    `}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color]
                    );
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        color: isLightColor ? 'black' : 'white',
                        fontSize: '18px',
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Add new color toggle */}
      <button
        type="button"
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="flex items-center gap-2 border border-gray-500 rounded-lg bg-gray-800
         hover:bg-gray-700 px-2 py-1 text-white"
      >
        <PlusIcon className="w-4 h-4" />
        Add Custom Color
      </button>

      {showColorPicker && (
        <div className="relative flex items-center gap-2 mt-2">
          <Input
            type="color"
            value={newColor}
            onChange={(e: any) => setNewColor(e.target.value)}
            className="w-10 h-10 p-0 border-none cursor-pointer"
          />

          <button
            type="button"
            onClick={() => {
              // prevent duplicates
              if (!customColors.includes(newColor)) {
                setCustomColors([...customColors, newColor]);
              }
              setShowColorPicker(false);
            }}
            className="bg-gray-700 px-3 py-1 text-white rounded-md text-sm hover:bg-gray-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
