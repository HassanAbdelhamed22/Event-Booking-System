import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import { registerValidationSchema } from "../../utils/validation";
import toast from "react-hot-toast";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { LogIn } from "lucide-react";

const RegisterForm = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await signUp(
          values.email,
          values.password,
          values.name,
          values.password_confirmation
        );
        toast.success("Registration successful!");
        navigate("/login");
      } catch (error: any) {
        setStatus(error.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, getFieldProps } = formik;

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-2">
          Join Evently to discover and book amazing events
        </p>
      </div>

      {formik.status && (
        <div className="mb-4 p-3 bg-error-50 text-red-700 text-center rounded-md">
          {formik.status}
        </div>
      )}

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...getFieldProps("name")}
          />
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...getFieldProps("email")}
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            {...getFieldProps("password")}
          />
          {errors.password && touched.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <Input
            id="password_confirmation"
            type="password"
            placeholder="********"
            {...getFieldProps("password_confirmation")}
          />
          {errors.password_confirmation && touched.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-4"
          isLoading={formik.isSubmitting}
          icon={<LogIn className="h-4 w-4" />}
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
