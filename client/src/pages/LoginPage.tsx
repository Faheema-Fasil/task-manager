import React from "react";

import { FcGoogle } from "react-icons/fc";

import "tailwindcss";

const LoginPage: React.FC = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Left Side: Login */}
      <div className="w-1/2 flex items-center justify-center bg-[#f8f5fa]">
      <div className="text-center max-w-md">
      {/* Logo & Branding */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-purple-600 text-2xl font-bold">TaskBuddy</span>
      </div>
      <p className="text-gray-600 mb-6">
        Streamline your workflow and track progress effortlessly with our all-in-one task management app.
      </p>

      {/* Google Login Button */}
      <button className="flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition duration-300">
        <FcGoogle className="mr-3 text-xl" />
        Continue with Google
      </button>
    </div>
      </div>

      {/* Right Side: Task Preview */}
      <div className="w-1/2 flex flex-col items-center justify-center  relative" style={{backgroundImage: "url('../src/assets/circles_bg.png')", backgroundSize: "cover", backgroundPosition: "center"}}>

        <img className="w-full ms-100 border border-gray-200 absolute mt-8 rounded-xl shadow-lg  bg-white" src="https://s3-alpha-sig.figma.com/img/494f/1405/d39d91697e2b4152019135fa206392a5?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=iNplzJC6HqBINmphLBWH4spW8G3-~bqS81YUiNP9-ZJn58WGViZqpqY1q1olJPnG0zJzctH0qeZ~HAPyFD23ZjUqJH46jhteT3lLvPQLuzPFv1MuYSFBDN9ougpUMTVvQhh8c3FRgxc79VQ~r4YJtraHVEN4zL44kDPP9DFDdSRMTG65DOBtPwH8tST3caiCaNjkcOx5-EQmfIRZWx9aLtDRYRbCaDDJe5UPr8EwA5Jyzl8HQFAG4-9-apyLac~LGqBrVRCA~goDp6SXqi7TfEEih9eYlKg8bjZ0cFJ85MXg3AA4yRlHVGKUAVKOu-3tqhXbckdYOMABk9CBWpiBJw__" alt="" />
      </div>
    </div>
  );
};

export default LoginPage;
