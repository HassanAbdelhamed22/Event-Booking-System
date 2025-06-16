// components/UI/Select.tsx
import { forwardRef, type SelectHTMLAttributes } from "react";

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, IProps>(
  ({ options, className = "", ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={`border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

export default Select;
