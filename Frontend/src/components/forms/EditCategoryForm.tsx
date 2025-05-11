import { Formik, Form, Field } from "formik";
import { CategoryValidationSchema } from "../../utils/validation";
import type { Category } from "../../types";
import FileInput from "../UI/FileInput";
import Button from "../UI/Button";
import Input from "../UI/Input";

interface EditCategoryFormProps {
  category: Category;
  onSave: (category: FormData) => Promise<void>;
  onCancel: () => void;
}

const EditCategoryForm = ({
  category,
  onSave,
  onCancel,
}: EditCategoryFormProps) => {
  const initialValues = {
    name: category.name,
    image: null as File | null,
    existingImage: category.image || null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CategoryValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append("name", values.name);

        // Include image only if new one is provided
        if (values.image) {
          formData.append("image", values.image);
        } else if (values.existingImage) {
          // Include existing image path if no new image
          formData.append("existingImage", values.existingImage);
        }
        formData.append("_method", "PUT");

        await onSave(formData);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched, values }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <Field as={Input} name="name" error={touched.name && errors.name} />
            {touched.name && errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Category Image
            </label>
            <FileInput name="image" />

            {/* Show current image if exists and no new image selected */}
            {values.existingImage && !values.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                <img
                  src={`http://127.0.0.1:8000/storage/${category.image}`}
                  alt="Current category"
                  className="h-20 w-20 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditCategoryForm;
