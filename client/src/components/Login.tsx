import React, { useState } from 'react';
import { MdContentPaste } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { CiViewBoard } from "react-icons/ci";


interface Task {
  name: string;
  dueDate: string;
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
}

const TaskBuddy: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { name: 'Interview with Design Team', dueDate: 'Today', status: 'TO-DO' },
    { name: 'Team Meeting', dueDate: '30 Dec, 2024', status: 'TO-DO' },
    { name: 'Design a Dashboard page along with wireframes', dueDate: '31 Dec, 2024', status: 'TO-DO' },
    { name: 'Morning Workout', dueDate: 'Today', status: 'IN-PROGRESS' },
    { name: 'Code Review', dueDate: 'Today', status: 'IN-PROGRESS' },
    { name: 'Update Task Tracker', dueDate: '25 Dec, 2024', status: 'COMPLETED' },
  ]);

  const [newTask, setNewTask] = useState({ name: '', dueDate: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);

  const addTask = () => {
    setTasks([
      ...tasks,
      { ...newTask, status: 'TO-DO' },
    ]);
    setNewTask({ name: '', dueDate: '' });
    setIsAddingTask(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const filterTasks = (status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED') => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl   mb-4">
          <span className="mr-2 flex items-center" ><MdContentPaste /><span> TaskBuddy</span></span> 
        </h1>

        <div className=" mb-4">
          <div className="flex items-center">
            <button className="mr-2 text-gray-600 font-semibold underline flex items-center"><FaListUl /><span> &nbsp; List</span>
            </button>
            <button className="text-gray-600 flex items-center"><CiViewBoard />
            <span>Board</span> </button>
          </div>
          <div className="flex items-center mt-2">
            <p className="text-gray-600 rounded px-4 py-2 mr-2">Filter by:</p>
            <select className="border rounded px-2 py-1 mr-2">
              <option>Category</option>
            </select>
            <select className="border rounded px-2 py-1">
              <option>Due Date</option>
            </select>
          </div>
        </div>
        <hr className='mb-4 mt-5 text-gray-300'/>

        {/* Add Task Section */}
        {isAddingTask ? (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <input
              type="text"
              name="name"
              placeholder="Task Title"
              value={newTask.name}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 mr-2 w-full mb-2"
            />
            <input
              type="text"
              name="dueDate"
              placeholder="Add date"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 mr-2 w-full mb-2"
            />
            <div className="flex justify-end">
              <button onClick={addTask} className="bg-indigo-500 text-white rounded px-4 py-2 mr-2">
                ADD
              </button>
              <button onClick={() => setIsAddingTask(false)} className="text-gray-600 rounded px-4 py-2">
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAddingTask(true)} className="bg-indigo-500 text-white rounded px-4 py-2 mb-4">
            + ADD TASK
          </button>
        )}


        {/* Task Lists */}
        <TaskList title="Todo" tasks={filterTasks('TO-DO')} />
        <TaskList title="In-Progress" tasks={filterTasks('IN-PROGRESS')} />
        <TaskList title="Completed" tasks={filterTasks('COMPLETED')} />

      </div>
    </div>
  );
};

const TaskList: React.FC<{ title: string; tasks: Task[] }> = ({ title, tasks }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold mb-2">{title} ({tasks.length})</h2>
    {tasks.map((task, index) => (
      <div key={index} className="bg-white rounded shadow p-2 mb-2 flex items-center">
        <input type="checkbox" className="mr-2" /> {/* Add checkbox here */}
        <div>
          <p className="font-medium">{task.name}</p>
          <p className="text-gray-500 text-sm">{task.dueDate}</p>
        </div>
        <div className="ml-auto"> {/* Added ml-auto for right alignment */}
          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
            {task.status}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default TaskBuddy;