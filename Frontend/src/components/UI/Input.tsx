import { forwardRef, type InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, IProps>(({ ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className="border-[1px] border-borderLight dark:border-borderDark shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent text-secondaryLightText dark:text-secondaryDarkText"
      {...rest}
    />
  );
});

export default Input;
