import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdCheckCircle } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import dragicon from "../assets/drag_icon.png";

interface Task {
  id: string;
  title: string;
  dueDate: {
    seconds: number;
    nanoseconds: number;
  };
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: "WORK" | "PERSONAL";
  description: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface CompletedProps {
  tasks: Task[];
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  updateTaskStatus: (
    id: string,
    status: "TO-DO" | "IN-PROGRESS" | "COMPLETED"
  ) => void;
  menuOpenTaskId: string | null;
  setMenuOpenTaskId: (id: string | null) => void;
  setTasks: any;
  filteredTasks: any;
  editTask: any;
}

const Completed: React.FC<CompletedProps> = ({
  tasks,
  setTasks,
  handleDelete,
  handleEdit,
  updateTaskStatus,
  menuOpenTaskId,
  setMenuOpenTaskId,
  filteredTasks,
  editTask,
}) => {
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "COMPLETED"
  );
  const [openCompleted, setOpenCompleted] = useState(true);
  const [statusDropdownTaskId, setStatusDropdownTaskId] = useState<
    string | null
  >(null);

  const handleStatusChange = async (
    taskId: string,
    newStatus: "TO-DO" | "IN-PROGRESS" | "COMPLETED"
  ) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      try {
        await editTask({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate.seconds * 1000),
          category: task.category,
          status: newStatus,
        });
        console.log("Status updated successfully!");
      } catch (error) {
        console.error("Error updating status: ", error);
      }
    }
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    setStatusDropdownTaskId(null);
  };

  const toggleStatusDropdown = (taskId: string) => {
    setStatusDropdownTaskId(statusDropdownTaskId === taskId ? null : taskId);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-[#E6FFD8] p-3 rounded-t-2xl">
        <h6 className="font-xs font-semibold">
          Completed ({completedTasks.length})
        </h6>
        <button onClick={() => setOpenCompleted(!openCompleted)}>
          {openCompleted ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </button>
      </div>

      <div className="w-full ">
        {openCompleted && (
          <div className="bg-gray-100 min-h-35 rounded-b-2xl shadow-md">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-1 w-5/12">
                  <input type="checkbox" checked readOnly className="" />
                  <div className="w-100 flex items-center">
                    <button>
                      <img src={dragicon} alt="drag" />
                    </button>
                    <span className="mr-2">
                      <MdCheckCircle />
                    </span>
                    <p className="flex-1 line-through">{task.title}</p>
                  </div>
                </div>
                <div className="w-3/12 text-gray-500">
                  {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}
                </div>
                <div className="w-2/12 flex items-center relative">
                  <button
                    onClick={() => toggleStatusDropdown(task.id)}
                    className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs mr-2"
                  >
                    {task.status}
                  </button>

                  {statusDropdownTaskId === task.id && (
                    <div className="absolute left-0 top-8 bg-white border border-gray-300 rounded shadow-md z-10">
                      {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((status) => (
                        <button
                          key={status}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() =>
                            handleStatusChange(
                              task.id,
                              status as "TO-DO" | "IN-PROGRESS" | "COMPLETED"
                            )
                          }
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-2/12 flex items-center">
                  <span className="px-2 py-1 rounded text-xs">
                    {task.category}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenTaskId(
                        task.id === menuOpenTaskId ? null : task.id
                      )
                    }
                  >
                    <BsThreeDots />
                  </button>
                  {menuOpenTaskId === task.id && (
                    <div className="absolute right-0 bg-white shadow-md text-sm rounded-md p-2 w-40">
                      <button
                        className="block w-full text-left hover:text-indigo-500 mb-1"
                        onClick={() => handleEdit(task.id)}
                      >
                        <div className="flex items-center gap-1">
                          <CiEdit />
                          <span>Edit</span>
                        </div>
                      </button>
                      <button
                        className="block w-full text-left hover:text-black"
                        onClick={() => handleDelete(task.id)}
                      >
                        <div className="flex items-center gap-1">
                          <MdDelete className="text-red-500" />
                          <span className="text-red-500">Delete</span>
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
