import React, { useState } from 'react';
import list from '../assets/list.png';
import board from '../assets/view-board.png';
import searchicon from '../assets/search_icon.svg';
import { useNavigate } from 'react-router-dom';

import TaskList from './TaskList';
import TaskBoard from './TaskBoard';
import CreateTask from './CreateTask';

interface ListBoardFilterProps {
  filterTasks: (status: string) => any[];
  toggleSection: (section: string) => void;
  openSections: { [key: string]: boolean };
}

const ListBoardFilter: React.FC<ListBoardFilterProps> = ({
  filterTasks,
  toggleSection,
  openSections,
}) => {
  const navigate = useNavigate();
  const [openList, setOpenList] = useState(true);
  const [modalShow, setModalShow] = useState(false);

  const [description, setDescription] = useState("");

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleBoardClick = () => {
    setOpenList(false);
  };



  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex">
          <button
            className="mr-2 text-gray-600 flex items-center hover:border-b-2"
            onClick={() => setOpenList(true)}
          >
            <img src={list} alt="" /> <span>List</span>
          </button>
          <button
            className="text-gray-600 flex items-center hover:border-b-2"
            onClick={handleBoardClick}
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
              onClick={handleSearchClick}
            />
          </div>
          <button
        onClick={() => setModalShow(true)}
        className="px-6 py-3 bg-[#7B1984] text-white rounded-3xl shadow-md hover:bg-purple-700 z-50 transition duration-300"
      >
        ADD TASK
      </button>

      {/* Tailwind Modal */}
      <CreateTask
        show={modalShow}
        onHide={() => setModalShow(false)}
        description={description}
        onChange={handleDescriptionChange}
      />
        </div>
      </div>



      {openList ? (
        <TaskList
          title="In Progress"
          tasks={filterTasks('IN-PROGRESS')}
          isOpen={openSections['IN-PROGRESS']}
          onToggle={() => toggleSection('IN-PROGRESS')}
        />
      ) : (
        <TaskBoard />
      )}
    </div>
  );
};

export default ListBoardFilter;