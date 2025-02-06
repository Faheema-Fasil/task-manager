import React from 'react';
import { useAuth } from '../firebase.tsx';
import { useNavigate } from 'react-router-dom';
import logoutIcon from '../assets/logout_icon.png';
import todo from '../assets/Vector.png';

const Header: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between items-center row mb-4">
      <h1 className="text-3xl flex items-center">
        <img src={todo} alt="" />
        <span className="mr-2">TaskBuddy</span>
      </h1>
      <div className="flex flex-col">
        <div className="flex items-center">
          <img className="rounded-full bg-gray-100 w-8 h-8 mr-2" src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/18fafc59-b8f8-4cfd-adb0-ebda9da48e03/4721eea8-03cf-4935-aa3d-0e74bdd2d034.png" alt="" />
          <p className="font-medium text-gray-500">{currentUser?.displayName || 'User'}</p>
        </div>
        <button onClick={handleLogout} className="border bg-purple-100 mt-2 border-purple-300 rounded-lg p-1 flex items-center justify-center hover:bg-purple-200 transition duration-200">
          <img src={logoutIcon} alt="" />
          <span className="ml-2 text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
