import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import taskimg from "../assets/task.png";
import image from "../assets/Screenshot.png";
import "tailwindcss";
import { useAuth } from "../firebase";

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const handleGoogleLogin = () => {
    signInWithGoogle(); // Call googleSignIn function from firebase.ts
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Side: Login */}
      <div className="w-6/12 flex flex-col items-center justify-center ">
        <div className="text-center  ">
          {/* Logo & Branding */}
          <div className="flex flex-col  items-start mb-8">
            <div className="flex items-center mb-4">
              <span className="text-[#7B1984] text-2xl flex text-3xl font-bold">
                <img className="mr-2" src={taskimg} alt="" />
                TaskBuddy
              </span>
            </div>
            <span className="text-gray-600 text-sm  ">
              Streamline your workflow and track progress effortlessly{" "}
            </span>{" "}
            <span className="text-gray-600 text-sm  ">
              with our all-in-one task management app.
            </span>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin} // Trigger login on button click
            className="flex items-center justify-center w-6/12 px-6 py-3 bg-black text-white rounded-2xl w-full  transition duration-300 transform hover:bg-gray-900 hover:scale-105"
          >
            <FcGoogle className="mr-3 text-xl" />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Right Side: Task Preview */}
      <div className="w-7/12 flex flex-col   items-center justify-center relative  ">
        <img
          className="absolute object-contain md:object-cover top-0 left-1/2 transform -translate-x-1/2 mt-6 mb-[-2rem]  "
          src="../src/assets/circles_bg.png"
          alt=""
        />
        <div className="flex items-center justify-center w-full">
          <img
            className=" absolute object-contain md:object-cover right-0 top-10 h-165 w-145 border border-gray-200   rounded-xl shadow-lg "
            src={image}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
