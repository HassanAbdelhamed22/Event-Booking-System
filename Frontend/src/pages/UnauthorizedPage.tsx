import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="unauthorized-page flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-red-500">403 - Unauthorized</h1>
        <p className="text-lg text-gray-700 mt-4">
          You do not have permission to access this page.
        </p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Go Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
