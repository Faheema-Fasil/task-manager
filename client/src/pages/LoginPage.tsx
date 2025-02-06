import React from "react";
import { FcGoogle } from "react-icons/fc";
import { googleSignIn } from "../firebase"; // Import googleSignIn function
import taskimg from '../assets/task.png';
import "tailwindcss";

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    googleSignIn(); // Call googleSignIn function from firebase.ts
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
                <img className="mr-2" src={taskimg} alt="" />TaskBuddy</span>
            </div>
            <span className="text-gray-600 text-sm  ">
              Streamline your workflow and track progress effortlessly </span> <span  className="text-gray-600 text-sm  ">with our all-in-one task management app.


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
      <div className="w-7/12 flex flex-col  left-side  items-center justify-center relative  " >
      <img className="absolute  top-0 left-10 mt-6 mb-[-2rem]  " src="../src/assets/circles_bg.png" alt="" />
        <img  className=" absolute  left-12/12 h-170 w-210 top-0 transform -translate-x-3/4 border border-gray-200  mt-8 rounded-xl shadow-lg " src="https://s3-alpha-sig.figma.com/img/494f/1405/d39d91697e2b4152019135fa206392a5?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=iNplzJC6HqBINmphLBWH4spW8G3-~bqS81YUiNP9-ZJn58WGViZqpqY1q1olJPnG0zJzctH0qeZ~HAPyFD23ZjUqJH46jhteT3lLvPQLuzPFv1MuYSFBDN9ougpUMTVvQhh8c3FRgxc79VQ~r4YJtraHVEN4zL44kDPP9DFDdSRMTG65DOBtPwH8tST3caiCaNjkcOx5-EQmfIRZWx9aLtDRYRbCaDDJe5UPr8EwA5Jyzl8HQFAG4-9-apyLac~LGqBrVRCA~goDp6SXqi7TfEEih9eYlKg8bjZ0cFJ85MXg3AA4yRlHVGKUAVKOu-3tqhXbckdYOMABk9CBWpiBJw__" alt="" />
      </div>
    </div>
  );
};

export default LoginPage;
