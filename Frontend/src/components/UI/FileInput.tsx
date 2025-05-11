import { useField } from "formik";

const FileInput = ({ name }: { name: string }) => {
  const [field, meta, helpers] = useField(name);
  const { error, touched } = meta;
  const { setValue } = helpers;

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setValue(e.currentTarget.files?.[0] || null);
        }}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary-50 file:text-primary-700
          hover:file:bg-primary-100"
      />
      {touched && error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
};
export default FileInput;
