import RegisterForm from "../components/forms/RegisterForm";
import Header from "../layouts/Header";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
