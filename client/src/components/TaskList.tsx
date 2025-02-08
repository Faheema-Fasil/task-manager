import React, { useState } from "react";
import TaskTableHeader from "./TableHeader";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import calenderimg from "../assets/calender_icon.svg";
import { FiPlus } from "react-icons/fi";
import union from "../assets/Union.png";
import dragicon from "../assets/drag_icon.png";
import { MdCheckCircle, MdDelete } from "react-icons/md";

import { BsThreeDots } from "react-icons/bs";

import UpdateTask from "./UpdateTask";
import { Timestamp } from "firebase/firestore";
import TaskListComponent from "./TaskComponent";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CiEdit } from "react-icons/ci";

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
  attachment?: File | null;
}

const TaskList = ({
  tasks,
  setTasks,
  filteredTasks,
  editTask,
  deleteTask,
}: {
  tasks: Task[];
  filteredTasks: any;
  setTasks: any;
  editTask: any;
  deleteTask: any;
}) => {
  const [openToDo, setOpenToDo] = useState(true);
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<string | null>(null);
  const [showUpdateTask, setShowUpdateTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [bulkStatusDropdown, setBulkStatusDropdown] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusDropdownTaskId, setStatusDropdownTaskId] = useState<
    string | null
  >(null);



  const toggleStatusDropdown = (taskId: string) => {
    setStatusDropdownTaskId(statusDropdownTaskId === taskId ? null : taskId);
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: "TO-DO" | "IN-PROGRESS" | "COMPLETED"
  ) => {
    const task = tasks.find((task) => task.id === taskId);
    console.log("taskStatus", task)
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

  const handleEdit = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setSelectedTask(task);
      setShowUpdateTask(true);
    }
  };

  const updateTaskStatus = (
    id: string,
    status: "TO-DO" | "IN-PROGRESS" | "COMPLETED"
  ) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setShowUpdateTask(false);
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

  const bulkDelete = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) => deleteTask(taskId))
      );
      console.log("Tasks deleted successfully!");
    } catch (error) {
      console.error("Error deleting tasks: ", error);
    } finally {
      setSelectedTasks([]);
      setShowBulkActions(false);
    }
  };

  const bulkChangeStatus = async (newStatus: Task["status"]) => {
    try {
      await Promise.all(
        tasks.map(async (task) => {
          if (selectedTasks.includes(task.id)) {
            await handleStatusChange(task.id, newStatus);
          }
        })
      );
      console.log("All statuses updated successfully!");
    } catch (error) {
      console.error("Error updating statuses: ", error);
    } finally {
      setSelectedTasks([]);
      setShowBulkActions(false);
    }
  };
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    let updatedTasks = [...tasks];

    const draggedTaskIndex = updatedTasks.findIndex((task) => task.id === draggableId);
    if (draggedTaskIndex === -1) return; // Exit if task not found

    const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);

    if (source.droppableId !== destination.droppableId) {
      draggedTask.status = destination.droppableId as "TO-DO" | "IN-PROGRESS" | "COMPLETED";
    }

    const destinationTasks = updatedTasks.filter((task) => task.status === destination.droppableId);

    destinationTasks.splice(destination.index, 0, draggedTask);

    updatedTasks = [
      ...updatedTasks.filter((task) => task.status !== destination.droppableId),
      ...destinationTasks,
    ];

    setTasks(updatedTasks);
  };

  const todoTasks: any = filteredTasks.filter((task: any) => task.status === "TO-DO");

  return (
    <div className="w-full">
      <hr className="mt-8 border-gray-200" />
      <TaskTableHeader />

      <div className="flex justify-between items-center bg-[#FAC3FF] p-3 rounded-t-2xl">
        <h6 className="font-xs font-semibold">Todo ({todoTasks.length})</h6>
        <button onClick={() => setOpenToDo(!openToDo)}>
          {openToDo ? <IoIosArrowDown /> : <IoIosArrowUp />}
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
            <div className="absolute bg-white border shadow-md mt-5 ml-28 p-2 rounded">
              {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((status) => (
                <button key={status} onClick={() => bulkChangeStatus(status as Task["status"])} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {/* <div className="flex items-center bg-gray-100 border-b border-gray-300 p-3">
        <button onClick={() => setIsAddingTask(true)} className="flex items-center hover:border-gray-400" type="button">
        <span className="text-purple-600 text-3xl mr-2">+</span> 
        <span className="text-black text-xl">Add Task</span>

        </button>
        </div> */}
      <div className=" ">

        {openToDo && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="TO-DO">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-100 min-h-35 rounded-b-2xl shadow-md">
                  {todoTasks.map((task: any, index: any) => (

                    <Draggable key={task.id} draggableId={task.id} index={index}>

                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task-item flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-1 w-5/12">
                            <input type="checkbox" checked={selectedTasks.includes(task.id)}
                              onChange={() => toggleTaskSelection(task.id)}
                              className="mr-2" />
                            <div className="w-100 flex items-center">
                              <button>
                                <img src={dragicon} alt="Drag Icon" />
                              </button>
                              <span className="mr-2">
                                <MdCheckCircle />
                              </span>
                              <p className="flex-1">{task.title}</p>
                            </div>
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
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                <button onClick={() => editTask(task.id)} className="block flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                                  <CiEdit /> <span>Edit</span>
                                </button>
                                <button onClick={() => deleteTask(task.id)} className="block flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                                  <MdDelete className="text-red-500" /> <span className="text-red-500">Delete</span>
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
        )}
      </div>

      <div className="mt-4">
        <TaskListComponent
          title="In Progress"
          status="IN-PROGRESS"
          tasks={tasks}
          updateTaskStatus={updateTaskStatus}
          menuOpenTaskId={menuOpenTaskId}
          setMenuOpenTaskId={setMenuOpenTaskId}
          handleStatusChange={handleStatusChange}
          deleteTask={deleteTask}
          handleEdit={handleEdit}
          setTasks={setTasks}
          editTask={editTask}

        />
      </div>
      <div className="mt-4">
        <TaskListComponent
          title="Completed"
          status="COMPLETED"
          tasks={tasks}
          updateTaskStatus={updateTaskStatus}
          menuOpenTaskId={menuOpenTaskId}
          setMenuOpenTaskId={setMenuOpenTaskId}
          handleStatusChange={handleStatusChange}
          deleteTask={deleteTask}
          handleEdit={handleEdit}
          setTasks={setTasks}
          editTask={editTask}

        />
      </div>

      {showUpdateTask && selectedTask && (
        <UpdateTask
          show={showUpdateTask}
          onHide={() => setShowUpdateTask(false)}
          task={selectedTask}
          onSave={handleSaveTask}
          editTask={editTask}
        />
      )}
    </div>
  );
};

export default TaskList;
