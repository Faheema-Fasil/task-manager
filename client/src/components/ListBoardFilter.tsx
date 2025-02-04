import React from 'react';
import list from '../assets/list.png';
import board from '../assets/view-board.png';
import searchicon from '../assets/search_icon.svg';
import { useNavigate } from 'react-router-dom';

const ListBoardFilter: React.FC = () => {
  const navigate = useNavigate();

  const handleBoardClick = () => {
    navigate('/taskboard'); // Navigate to /taskboard
  };

  const handleListClick = () => {
    navigate('/'); // Navigate to the default list view (usually '/')
  };

  const handleSearchClick = () => {
    navigate('/search'); // Navigate to /search
  };
  

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex">
          <button
            className="mr-2 text-gray-600 flex items-center  hover:border-b-2"
            onClick={handleListClick} // Add onClick handler
          >
            <img src={list} alt="" /> <span>List</span>
          </button>
          <button
            className="text-gray-600 flex items-center hover:border-b-2"
            onClick={handleBoardClick} // Add onClick handler
          >
            <img src={board} alt="" /> <span>Board</span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 text-gray-500">Filter by: </div>
          <select className="border border-gray-300 text-sm text-gray-500 rounded-full px-2 py-1 mr-2">
            <option>Category</option>
          </select>
          <select className="border border-gray-300 text-sm text-gray-500 rounded-full px-2 py-1 mr-2">
            <option>Due Date</option>
          </select>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-8 border border-gray-300 rounded-full px-2 py-1 bg-[#F8F5FA] w-full"
            />
            <img
              src={searchicon}
              alt=""
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5"
              onClick={handleSearchClick} // Make search icon clickable
            />
          </div>
          <button
            onClick={() => {}} // You'll likely want to add functionality here
            className="bg-[#7B1984] text-white rounded-full shadow-lg transition duration-300 hover:bg-[#5B145C] hover:shadow-lg hover:scale-105 flex items-center"
          >
            <span className="px-6 py-3 text-xs mr-2">ADD TASK</span>
          </button>
        </div>
      </div>
      <hr className="mt-8 border-gray-200" />
      
    </div>
  );
}
export default ListBoardFilter;