import { Controller } from "react-hook-form";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const SizeSelector = ({ control, error }: any) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Controller
        name="sizes"
        control={control}
        render={({ field }) => (
          <>
            {sizes.map((size) => {
              const isSelected = (field.value || []).includes(size);

              return (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((s: string) => s !== size)
                        : [...(field.value || []), size]
                    )
                  }
                  className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-800 text-gray-200 border-gray-700"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </>
        )}
      />
      {error?.sizes && (
        <p className="text-red-500 text-sm mt-1">{error.sizes.message}</p>
      )}
    </div>
  );
};

export default SizeSelector;
