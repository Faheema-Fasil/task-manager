import React, { useState } from 'react';
import list from '../assets/list.png';
import board from '../assets/view-board.png';
import searchicon from '../assets/search_icon.svg';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import TaskList from './TaskList';
import TaskBoard from './TaskBoard';
import CreateTask from './CreateTask';

interface ListBoardFilterProps {
  filterTasks: (status: string) => any[];
  toggleSection: (section: string) => void;
  openSections: { [key: string]: boolean };
}

const CategoryOptions = [
  { value: "WORK", label: "Work" },
  { value: "PERSONAL", label: "Personal" }
];

const dueDateOptions = [
  { value: "Today", label: "Today" },
  { value: "Tomorrow", label: "Tomorrow" },
  { value: "This Week", label: "This Week" },
  { value: "This Month", label: "This Month" },
  { value: "This Year", label: "This Year" },
];

const ListBoardFilter: React.FC<ListBoardFilterProps> = ({
  filterTasks,
  toggleSection,
  openSections,
}) => {
  const navigate = useNavigate();
  const [openList, setOpenList] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");

  // Function to add a task to Firestore
  const addTask = async (taskData: { title: string; description: string; due: Date; category: string; status: string }) => {
    if (taskData.title.trim()) {
      try {
        // Add the task to Firestore
        await addDoc(collection(db, "tasks"), {
          title: taskData.title,
          description: taskData.description,
          dueDate: Timestamp.fromDate(taskData.due),
          category: taskData.category,
          status: taskData.status,
          createdAt: Timestamp.now(),
        });
        console.log("Task added successfully!");
        setTask(""); // Clear the task input
        setDescription(""); // Clear the description input
        setModalShow(false); // Close the modal
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

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
            className="mr-2 text-gray-600 flex items-center border-b-2 hover:border-b-2"
            onClick={() => setOpenList(true)}
            style={{ borderBottom: openList ? '2px solid #000' : '2px solid transparent' }}
          >
            <img src={list} alt="" /> <span>List</span>
          </button>
          <button
            className="text-gray-600 flex items-center hover:border-b-2"
            onClick={handleBoardClick}
            style={{ borderBottom: !openList ? '2px solid #000' : '2px solid transparent' }}
          >
            <img src={board} alt="" /> <span>Board</span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 text-gray-500">Filter by: </div>
          <select className="border bg-white border-gray-300 text-sm text-gray-500 rounded-full px-2 py-1 mr-2">
            <option className='text-gray-500' selected disabled>Category</option>
            {CategoryOptions.map((option) => (
              <option key={option.value} style={{ color: 'black', backgroundColor: 'white', fontWeight: 'bold' }} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select className="border border-gray-300 text-sm text-gray-500 rounded-full px-2 py-1 mr-2">
            <option selected disabled>Due Date</option>
            {dueDateOptions.map((option) => (
              <option key={option.value} style={{ color: 'black', backgroundColor: 'white', fontWeight: 'bold' }} value={option.value}>
                {option.label}
              </option>
            ))}
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

          {/* Modal for creating a task */}
          <CreateTask
            show={modalShow}
            onHide={() => setModalShow(false)}
            description={description}
            onChange={handleDescriptionChange}
            onAddTask={addTask}
            task={task}
            setTask={setTask}
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