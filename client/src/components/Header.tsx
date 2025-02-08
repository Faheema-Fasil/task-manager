import React from "react";
import { useAuth } from "../firebase";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../assets/logout_icon.png";
import todo from "../assets/task_icon.png";

const Header: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="hidden md:flex justify-between items-center row mb-4 py-3 px-15">
        <h1 className="text-3xl flex items-center ">
          <img src={todo} alt="" />
          <span className="mr-2">TaskBuddy</span>
        </h1>
        <div className="flex flex-col">
          <div className="flex items-center">
            <img
              className="rounded-full bg-gray-100 w-8 h-8 mr-2"
              src={currentUser?.photoURL}
              alt=""
            />
            <p className="font-medium text-gray-500">
              {currentUser?.displayName || "User"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="border bg-purple-100 mt-2 border-purple-300 rounded-lg p-1 flex items-center justify-center hover:bg-purple-200 transition duration-200"
          >
            <img src={logoutIcon} alt="" />
            <span className="ml-2 text-sm">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex md:hidden justify-between items-center bg-purple-100 p-3 border-b border-gray-300">
        <div>TaskBuddy</div>
        <div>
          {" "}
          <img
            className="rounded-full bg-gray-100 w-8 h-8 mr-2"
            src={currentUser?.photoURL}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
