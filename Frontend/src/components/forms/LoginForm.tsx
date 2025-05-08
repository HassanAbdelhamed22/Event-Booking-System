import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import { loginValidationSchema } from "../../utils/validation";
import toast from "react-hot-toast";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { LogIn } from "lucide-react";

const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await signIn(values.email, values.password);
        toast.success("Login successful!");
        navigate("/");
      } catch (error: any) {
        setStatus("Invalid email or password. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, getFieldProps } = formik;

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">
          Sign in to your account to continue
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

        <Button
          type="submit"
          className="w-full mt-4"
          isLoading={formik.isSubmitting}
          icon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
