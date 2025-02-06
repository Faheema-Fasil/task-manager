import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdCheckCircle } from "react-icons/md";
import { BsThreeDots } from 'react-icons/bs';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import dragicon from '../assets/drag_icon.png';


interface Task {
  id: string;
  name: string;
  dueDate: string;
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  category: 'WORK' | 'PERSONAL';
}

interface CompletedProps {
  tasks: Task[];
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  updateTaskStatus: (id: string, status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED') => void;
  menuOpenTaskId: string | null;
  setMenuOpenTaskId: string | null;
}


const Completed: React.FC<CompletedProps> = ({ tasks, handleDelete, handleEdit, updateTaskStatus, menuOpenTaskId, setMenuOpenTaskId }) => {
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');
  const [openCompleted, setOpenCompleted] = useState(true);

  return (
    <div className="w-full">
      <div className='flex justify-between items-center bg-[#E6FFD8] p-3 rounded-t-2xl'>
        <h6 className="font-xs font-semibold">Completed ({completedTasks.length})</h6>
        <button onClick={() => setOpenCompleted(!openCompleted)}>
          {openCompleted ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </button>
      </div>

      <div className='w-full '>
        {openCompleted && (
          <div className="bg-gray-100 min-h-35 rounded-b-2xl shadow-md">
            {completedTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-50 transition">
                <div className='flex items-center gap-1 w-5/12'>
                  <input type="checkbox" defaultChecked className="" /> {/* Checked by default */}
                  <div className="w-100 flex items-center">
                    <button>
                      <img src={dragicon} alt="" />
                    </button>
                    <span className='mr-2'><MdCheckCircle /></span>
                    <p className='flex-1 line-through'>{task.name}</p> {/* Added line-through */}
                  </div>
                </div>
                <div className="w-3/12 text-gray-500">{task.dueDate}</div>
                <div className="w-2/12 flex items-center">
                  <button onClick={() => updateTaskStatus(task.id, task.status === 'TO-DO' ? 'IN-PROGRESS' : task.status === 'IN-PROGRESS' ? 'COMPLETED' : 'TO-DO')} className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs mr-2">{task.status}</button>
                </div>
                <div className="w-2/12 flex items-center">
                  <span className="px-2 py-1 rounded text-xs">{task.category}</span>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpenTaskId(task.id === menuOpenTaskId ? null : task.id)}>
                    <BsThreeDots />
                  </button>
                  {menuOpenTaskId === task.id && (
                    <div className="absolute right-0 bg-white shadow-md text-sm rounded-md p-2 w-40">
                      <button
                        className="block w-full text-left hover:text-indigo-500 mb-1"
                        onClick={() => handleEdit(task.id)}
                      >
                        <div className='flex items-center gap-1'>
                          <CiEdit />
                          <span>Edit</span>
                        </div>
                      </button>
                      <button
                        className="block w-full text-left hover:text-black"
                        onClick={() => handleDelete(task.id)}
                      >
                        <div className='flex items-center gap-1'>
                          <MdDelete className='text-red-500' />
                          <span className='text-red-500'>Delete</span>
                        </div>

                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;