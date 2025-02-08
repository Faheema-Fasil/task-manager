import React, { useState } from "react";
import TaskTableHeader from "./TableHeader";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import calenderimg from "../assets/calender_icon.svg";
import { FiPlus } from "react-icons/fi";
import union from "../assets/Union.png";
import dragicon from "../assets/drag_icon.png";
import { MdCheckCircle } from "react-icons/md";
import Inprogress from "../components/Inprogress";
import { BsThreeDots } from "react-icons/bs";
import Completed from "./Completed";
import UpdateTask from "./UpdateTask";
import { Timestamp } from "firebase/firestore";
import TaskListComponent from "./TaskComponent";

const TaskList = ({
  tasks,
  setTasks,
  filteredTasks,
  editTask,
}: {
  tasks: Task[];
  filteredTasks: any;
  setTasks: any;
  editTask:any;
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [openToDo, setOpenToDo] = useState(true);
  const [newTask, setNewTask] = useState<Omit<Task, "status" | "category">>({
    title: "",
    due: Timestamp.now(),
  });
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<string | null>(null);
  const [showUpdateTask, setShowUpdateTask] = useState(false);
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

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (!newTask.title || !newTask.due) return;
    setTasks([
      ...tasks,
      {
        ...newTask,
        status: "TO-DO",
        category: "WORK",
        id: (tasks.length + 1).toString(),
      },
    ]);
    setNewTask({ title: "", due: Timestamp.now() });
    setIsAddingTask(false);
  };

  const updateTaskStatus = (
    id: string,
    status: "TO-DO" | "IN-PROGRESS" | "COMPLETED"
  ) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateClick = () => {
    const datePicker = document.createElement("input");
    datePicker.type = "date";
    datePicker.value = newTask.dueDate
      ? newTask.dueDate.toDate().toISOString().split("T")[0]
      : "";
    datePicker.className = "absolute opacity-0 pointer-events-none";
    datePicker.addEventListener("change", () => {
      setNewTask((prev) => ({
        ...prev,
        due: Timestamp.fromDate(new Date(datePicker.value)),
      }));
      datePicker.remove();
    });
    document.body.appendChild(datePicker);
    datePicker.click();
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setShowUpdateTask(false);
  };

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, removed);

    setTasks(newTasks);
  };

  const todoTasks = filteredTasks.filter((task) => task.status === "TO-DO");

  return (
    <div className="w-full">
      <hr className="mt-8 border-gray-200" />
      <TaskTableHeader />

      <div className="flex justify-between items-center bg-[#FAC3FF] p-3 rounded-t-2xl">
        <h6 className="font-xs font-semibold">Todo ({tasks.length})</h6>
        <button onClick={() => setOpenToDo(!openToDo)}>
          {openToDo ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </button>
      </div>

      <div className=" ">
        {openToDo && (
          <div className="bg-gray-100 rounded-b-2xl shadow-md">
            <div className="md:flex hidden justify-between items-center p-2 border-b border-gray-300">
              <button
                onClick={() => setIsAddingTask(true)}
                className="rounded px-4 py-2 text-sm"
              >
                <span className="text-purple">+</span> ADD TASK
              </button>
            </div>

            {isAddingTask && (
              <div className="mb-4 p-4 bg-gray-50 rounded relative md:flex hidden">
                <div className="flex items-center px-8 mr-50 justify-between mx-5">
                  <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="border-none text-sm rounded mb-2"
                  />
                  <button
                    type="button"
                    className="border border-gray-300 rounded-full p-2 flex items-center gap-1 hover:bg-gray-100 transition"
                    onClick={handleDateClick}
                    aria-label="Add Due Date"
                  >
                    <img
                      src={calenderimg}
                      alt="Calendar Icon"
                      className="w-5 h-5"
                    />
                    <span className="text-xs">Add Date</span>
                  </button>
                  <div>
                    <button className="border border-gray-300 rounded-full text-sm p-1">
                      <FiPlus />
                    </button>
                    <div className="flex bg-white absolute border border-gray-300 rounded-2xl p-2 text-sm items-start justify-items-start flex-col">
                      <button className="w-full text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300">
                        TO-DO
                      </button>
                      <button className="w-full text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300">
                        IN-PROGRESS
                      </button>
                      <button className="w-full text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300">
                        COMPLETED
                      </button>
                    </div>
                  </div>
                  <div>
                    <button className="border border-gray-300 rounded-full text-sm p-1">
                      <FiPlus />
                    </button>
                    <div className="flex bg-white absolute border border-gray-300 rounded-2xl p-2 text-sm items-start justify-items-start flex-col">
                      <button className="w-text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300">
                        WORK
                      </button>
                      <button className="w-text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300">
                        PERSONAL
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex mt-2 mx-13">
                  <button
                    onClick={addTask}
                    className="bg-[#7B1984] flex items-center gap-2 text-white px-3 rounded-full"
                    disabled={!newTask.title || !newTask.due}
                  >
                    <span className="text-xs">ADD </span>{" "}
                    <img src={union} alt="" />
                  </button>
                  <button
                    onClick={() => setIsAddingTask(false)}
                    className="rounded px-4 py-2"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {todoTasks &&
              todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-1 w-5/12">
                    <input type="checkbox" className="" />
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
                  <div className="w-3/12  hidden md:flex text-gray-500">
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
                      <div className="absolute left-0 top-8 bg-white border  border-gray-300 rounded shadow-md z-10">
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
                    <span className="px-2 py-1  hidden md:flex rounded text-xs">
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
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                        <button
                          onClick={() => handleEdit(task.id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
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
          handleDelete={handleDelete}
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
          handleDelete={handleDelete}
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
