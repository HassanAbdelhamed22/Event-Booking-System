import { Formik, Form, Field } from "formik";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { CategoryValidationSchema } from "../../utils/validation";
import FileInput from "../UI/FileInput";

interface CategoryFormProps {
  onSave: (category: FormData) => Promise<void>;
  onCancel: () => void;
}

const CategoryForm = ({ onSave, onCancel }: CategoryFormProps) => {
  const initialValues = {
    name: "",
    image: null as File | null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CategoryValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values.image) {
          formData.append("image", values.image);
        }

        await onSave(formData);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
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
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
