import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdCheckCircle, MdDelete } from "react-icons/md";
import dragicon from "../assets/drag_icon.png";
import { BsThreeDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

interface TaskListComponentProps {
  title: string;
  status: Task["status"];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  menuOpenTaskId: string | null;
  setMenuOpenTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  handleStatusChange: any;
  deleteTask: (id: string) => void;
  handleEdit: (id: string) => void;
  editTask: (task: Partial<Task>) => Promise<void>;
}

const TaskListComponent: React.FC<TaskListComponentProps> = ({
  title,
  status,
  tasks,
  setTasks,
  updateTaskStatus,
  menuOpenTaskId,
  setMenuOpenTaskId,
  handleStatusChange,
  deleteTask,
  handleEdit,
  editTask,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [statusDropdownTaskId, setStatusDropdownTaskId] = useState<string | null>(null);
  const filteredTasks = tasks.filter((task) => task.status === status);

  const toggleStatusDropdown = (taskId: string) => {
    setStatusDropdownTaskId(statusDropdownTaskId === taskId ? null : taskId);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(filteredTasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        reorderedTasks.find((t) => t.id === task.id) || task
      );
      return updatedTasks;
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-[#A3DAFF] p-3 rounded-t-2xl">
        <h6 className="font-xs font-semibold">
          {title} ({filteredTasks.length})
        </h6>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </button>
      </div>
      {isOpen && (
        <div className="bg-gray-100 min-h-35 rounded-b-2xl shadow-md">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="taskList">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-1 w-5/12">
                            <button>
                              <img src={dragicon} alt="Drag Icon" />
                            </button>
                            <span className="mr-2">
                              <MdCheckCircle />
                            </span>
                            <p className="flex-1">{task.title}</p>
                          </div>
                          <div className="w-3/12 hidden md:flex text-gray-500">
                            {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}
                          </div>
                          <div className="w-2/12 hidden md:flex items-center relative">
                            <button
                              onClick={() => toggleStatusDropdown(task.id)}
                              className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs mr-2"
                            >
                              {task.status}
                            </button>
                            {statusDropdownTaskId === task.id && (
                              <div className="absolute left-0 top-8 bg-white border border-gray-300 rounded shadow-md z-10">
                                {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((statusOption) => (
                                  <button
                                    key={statusOption}
                                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    onClick={() => handleStatusChange(task.id, statusOption as Task["status"])}
                                  >
                                    {statusOption}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="w-2/12 flex items-center">
                            <span className="px-2 py-1 hidden md:flex rounded text-xs">
                              {task.category}
                            </span>
                          </div>
                          <div className="relative">
                            <button onClick={() => setMenuOpenTaskId(task.id === menuOpenTaskId ? null : task.id)}>
                              <BsThreeDots />
                            </button>
                            {menuOpenTaskId === task.id && (
                              <div className="absolute right-0 bg-white shadow-md text-sm rounded-md p-2 w-40">
                                <button className="block w-full text-left hover:text-indigo-500 mb-1" onClick={() => handleEdit(task.id)}>
                                  <div className="flex items-center gap-1">
                                    <CiEdit />
                                    <span>Edit</span>
                                  </div>
                                </button>
                                <button className="block w-full text-left hover:text-black" onClick={() => deleteTask(task.id)}>
                                  <div className="flex items-center gap-1">
                                    <MdDelete className="text-red-500" />
                                    <span className="text-red-500">Delete</span>
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default TaskListComponent;
