import LoginForm from "../components/forms/LoginForm";
import Header from "../layouts/Header";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
