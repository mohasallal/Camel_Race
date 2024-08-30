import { LoginForm } from "@/components/auth/login-form";

const page = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-200 bg-transparent bg-[url('/petra.jpeg')] bg-no-repeat bg-cover bg-center">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-transparent"></div>

      {/* Login form container */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
