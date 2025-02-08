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
  handleStatusChange: (taskId: string, newStatus: Task["status"]) => void;
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
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [statusDropdownTaskId, setStatusDropdownTaskId] = useState<string | null>(null);
  const [bulkStatusDropdown, setBulkStatusDropdown] = useState(false);
  const filteredTasks = tasks.filter((task) => task.status === status);

  const toggleStatusDropdown = (taskId: string) => {
    setStatusDropdownTaskId(statusDropdownTaskId === taskId ? null : taskId);
  };

  const toggleTaskSelection = (taskId: string) => {
    let updatedSelection = [...selectedTasks];
    if (updatedSelection.includes(taskId)) {
      updatedSelection = updatedSelection.filter((id) => id !== taskId);
    } else {
      updatedSelection.push(taskId);
    }
    setSelectedTasks(updatedSelection);
    setShowBulkActions(updatedSelection.length >= 2);
  };

  const bulkDelete = () => {
    const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.id));
    setTasks(updatedTasks);
    setSelectedTasks([]);
    setShowBulkActions(false);
  };

  const bulkChangeStatus = (newStatus: Task["status"]) => {
    const updatedTasks = tasks.map((task) =>
      selectedTasks.includes(task.id) ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    setSelectedTasks([]);
    setShowBulkActions(false);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
  
    const { source, destination, draggableId } = result;
  
    // Clone the tasks array
    let updatedTasks = [...tasks];
  
    // Find the dragged task index
    const draggedTaskIndex = updatedTasks.findIndex((task) => task.id === draggableId);
    if (draggedTaskIndex === -1) return; // Exit if task not found
  
    // Extract the dragged task
    const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);
  
    // Update status if moved across lists
    if (source.droppableId !== destination.droppableId) {
      draggedTask.status = destination.droppableId as "TO-DO" | "IN-PROGRESS" | "COMPLETED";
    }
  
    // Filter tasks for the destination list
    const destinationTasks = updatedTasks.filter((task) => task.status === destination.droppableId);
  
    // Insert task at correct position in the filtered list
    destinationTasks.splice(destination.index, 0, draggedTask);
  
    // Rebuild the final task list with updated ordering
    updatedTasks = [
      ...updatedTasks.filter((task) => task.status !== destination.droppableId),
      ...destinationTasks,
    ];
  
    setTasks(updatedTasks);
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

      {showBulkActions && (
        <div className="flex justify-between p-2 bg-gray-200 text-sm">
          <button onClick={() => setBulkStatusDropdown(!bulkStatusDropdown)} className="px-2 py-1 bg-blue-500 text-white rounded">
            Change Status
          </button>
          <button onClick={bulkDelete} className="px-2 py-1 bg-red-500 text-white rounded">
            Delete Selected
          </button>
          {bulkStatusDropdown && (
            <div className="absolute bg-white mt-5 ml-28 border shadow-md z-10 p-2 rounded">
              {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((status) => (
                <button key={status} onClick={() => bulkChangeStatus(status as Task["status"])} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="bg-gray-100 min-h-35 rounded-b-2xl shadow-md">
          <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={status}>
            
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
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => toggleTaskSelection(task.id)}
                            className="mr-2"
                          />
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
                            <button onClick={() => toggleStatusDropdown(task.id)} className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs mr-2">
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
                            <span className="px-2 py-1 hidden md:flex rounded text-xs">{task.category}</span>
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
