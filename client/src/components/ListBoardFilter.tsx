import React, { useEffect, useState } from "react";
import list from "../assets/list.png";
import board from "../assets/view-board.png";
import searchicon from "../assets/search_icon.svg";
import { useNavigate } from "react-router-dom";
import { db, useAuth } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import TaskList from "./TaskList";
import TaskBoard from "./TaskBoard";
import CreateTask from "./CreateTask";

interface ListBoardFilterProps {
  toggleSection: any;
  openSections: any;
}

interface Task {
  id: string;
  title: string;
  dueDate: Timestamp;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: "WORK" | "PERSONAL";
  description: string;
  createdAt: Timestamp;
  email: string;
}

const dueDateOptions = [
  { value: "All", label: "All" },
  { value: "Today", label: "Today" },
  { value: "Tomorrow", label: "Tomorrow" },
  { value: "This Week", label: "This Week" },
  { value: "This Month", label: "This Month" },
  { value: "This Year", label: "This Year" },
];

const ListBoardFilter: React.FC<ListBoardFilterProps> = ({
  toggleSection,
  openSections,
}) => {
  const navigate = useNavigate();
  const [openList, setOpenList] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedDueDate, setSelectedDueDate] = useState<string | undefined>(
    undefined
  );

  const { currentUser } = useAuth();

  const fetchTasks = async () => {
    try {
      const taskData: Task[] = [];
      const querySnapshot = await getDocs(collection(db, "tasks"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === currentUser.email) {
          taskData.push({
            id: doc.id,
            title: data.title,
            dueDate: data.dueDate,
            status: data.status,
            category: data.category,
            description: data.description,
            createdAt: data.createdAt,
            email: data.email,
            // activity: data.activity ? data.activity : []
          });
        }
      });
      setTasks(taskData);
      console.log("Tasks fetched:", taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const categorySet = new Set<string>();
      const taskSnapshot = await getDocs(collection(db, "tasks"));
      taskSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) categorySet.add(data.category);
      });
      setCategories(["All", ...Array.from(categorySet)]);
      setCategories(Array.from(categorySet));
    };

    fetchCategories();
  }, []);

  const addTask = async (taskData: {
    title: string;
    description: string;
    dueDate: Date;
    category: string;
    status: string;
  }) => {
    if (taskData.title.trim()) {
      try {
        await addDoc(collection(db, "tasks"), {
          title: taskData.title,
          description: taskData.description,
          dueDate: Timestamp.fromDate(taskData.dueDate),
          category: taskData.category,
          status: taskData.status,
          createdAt: Timestamp.now(),
          email: currentUser.email,
          // activity: []
        });

        console.log("Task added successfully!");
        setTask("");
        setDescription("");
        setModalShow(false);
        fetchTasks();
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

  const editTask = async (taskData: {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    category: string;
    status: string;
  }) => {
    console.log("taskData", taskData);
    try {
      await updateDoc(doc(db, "tasks", taskData.id), {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        category: taskData.category,
        status: taskData.status,
        // updatedAt: Timestamp.now(),
      });

      console.log("Task edited successfully!");
      setTask("");
      setDescription("");
      setModalShow(false);
      fetchTasks();
    } catch (error) {
      console.error("Error editing task: ", error);
    }
  };
  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      console.log("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  useEffect(() => {
    const filteredTasks = tasks.filter((task) =>
      selectedCategory ? task.category === selectedCategory : true
    );

    if (selectedDueDate) {
      switch (selectedDueDate) {
        case "All":
          setFilteredTasks(
            filteredTasks.filter((task) =>
              selectedCategory ? task.category === selectedCategory : true
            )
          );
          break;
        case "Today":
          setFilteredTasks(
            filteredTasks.filter((task) => {
              const today = new Date();
              const taskDueDate = task.dueDate.toDate();
              return (
                taskDueDate.getFullYear() === today.getFullYear() &&
                taskDueDate.getMonth() === today.getMonth() &&
                taskDueDate.getDate() === today.getDate()
              );
            })
          );
          break;
        case "Tomorrow":
          setFilteredTasks(
            filteredTasks.filter((task) => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const taskDueDate = task.dueDate.toDate();
              return (
                taskDueDate.getFullYear() === tomorrow.getFullYear() &&
                taskDueDate.getMonth() === tomorrow.getMonth() &&
                taskDueDate.getDate() === tomorrow.getDate()
              );
            })
          );
          break;
        case "This Week":
          setFilteredTasks(
            filteredTasks.filter((task) => {
              const today = new Date();
              const currentDay = today.getDay();
              const firstDayOfWeek = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - currentDay
              );
              const lastDayOfWeek = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + (6 - currentDay)
              );
              const taskDueDate = task.dueDate.toDate();
              return (
                taskDueDate >= firstDayOfWeek && taskDueDate <= lastDayOfWeek
              );
            })
          );
          break;
        case "This Month":
          setFilteredTasks(
            filteredTasks.filter((task) => {
              const today = new Date();
              const taskDueDate = task.dueDate.toDate();
              return (
                taskDueDate.getFullYear() === today.getFullYear() &&
                taskDueDate.getMonth() === today.getMonth()
              );
            })
          );
          break;
        case "This Year":
          setFilteredTasks(
            filteredTasks.filter((task) => {
              const today = new Date();
              const taskDueDate = task.dueDate.toDate();
              return taskDueDate.getFullYear() === today.getFullYear();
            })
          );
          break;
        default:
          setFilteredTasks(filteredTasks);
      }
    } else {
      setFilteredTasks(filteredTasks);
    }
  }, [selectedCategory, selectedDueDate, tasks]);

  console.log("tasks", tasks);

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSearchClick = (e: any) => {
    console.log("eeeeeee", e.target.value);
  };

  const handleBoardClick = () => {
    setOpenList(false);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  const handleDueDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDueDate(event.target.value);
  };
  const handleSearchEvent = (event: any) => {
    const searchValue = event.target.value;
    const filteredTasks = tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.description.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    setFilteredTasks(filteredTasks);
  };

  const checkAndSetMobileView = () => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    if (mediaQuery.matches) {
      setOpenList(true);
    }
  };

  useEffect(() => {
    checkAndSetMobileView();
    window.addEventListener("resize", checkAndSetMobileView);

    return () => {
      window.removeEventListener("resize", checkAndSetMobileView);
    };
  }, []);

  return (
    <div>
      <div className="flex justify-end items-end md:hidden">
        <button
          onClick={() => setModalShow(true)}
          className=" py-1  bg-[#7B1984] text-white rounded-3xl shadow-md hover:bg-purple-700 z-50 transition duration-300"
        >
          ADD TASK
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="hidden flex flex-col items-center">
          <button
            className="w-full text-gray-600 flex items-center justify-center border-b-2 hover:border-b-2 py-2"
            onClick={() => setOpenList(true)}
            style={{
              borderBottom: openList
                ? "2px solid #000"
                : "2px solid transparent",
            }}
          >
            <img src={list} alt="" className="mr-2" />
            <span>List</span>
          </button>
          <button
            className="w-full text-gray-600 flex items-center justify-center hover:border-b-2 py-2"
            onClick={handleBoardClick}
            style={{
              borderBottom: !openList
                ? "2px solid #000"
                : "2px solid transparent",
            }}
          >
            <img src={board} alt="" className="mr-2" />
            <span>Board</span>
          </button>
        </div>
        <div className="md:flex hidden">
          <button
            className="mr-2 text-gray-600 flex items-center border-b-2 hover:border-b-2"
            onClick={() => setOpenList(true)}
            style={{
              borderBottom: openList
                ? "2px solid #000"
                : "2px solid transparent",
            }}
          >
            <img src={list} alt="" /> <span>List</span>
          </button>
          <button
            className="text-gray-600 flex items-center hover:border-b-2"
            onClick={handleBoardClick}
            style={{
              borderBottom: !openList
                ? "2px solid #000"
                : "2px solid transparent",
            }}
          >
            <img src={board} alt="" /> <span>Board</span>
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-col  justify-between w-full md:flex-row md:items-center gap-2 ">
          <div className="flex items-center gap-2 ">

            <div className="hidden md:flex text-xs  text-gray-500">Filter by: </div>
            <div className="flex">
              <select
                className="border bg-white border-gray-300 text-sm text-gray-500 rounded-full px-2 py-1 mr-2"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option className="text-gray-500" selected disabled>
                  Category
                </option>
                <option value="">All</option>
                {categories.map((category) => (
                  <option
                    key={category}
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      fontWeight: "bold",
                    }}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 text-sm text-gray-500 rounded-full px-2 py-1 mr-2"
                value={selectedDueDate}
                onChange={handleDueDateChange}
              >
                <option selected disabled>
                  Due Date
                </option>
                {dueDateOptions.map((option) => (
                  <option
                    key={option.value}
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      fontWeight: "bold",
                    }}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6 justify-end md:gap-2 md:flex-row flex-col md:items-start md:w-auto w-full" >
            <div className="relative flex mt-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search"
                onChange={handleSearchEvent}
                className="pl-8 border border-gray-300 rounded-full px-2 py-1 bg-[#F8F5FA] w-full md:w-auto"
              />
              <img
                src={searchicon}
                alt=""
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 "
                onClick={handleSearchClick}
              />
            </div>
            <button
              onClick={() => setModalShow(true)}
              className="px-6 py-3 bg-[#7B1984] text-white hidden md:flex rounded-3xl shadow-md hover:bg-purple-700 z-50 transition duration-300"
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
      </div>

      {openList ? (
        <TaskList
          editTask={editTask}
          deleteTask={deleteTask}
          setTasks={setTasks}
          filteredTasks={filteredTasks ? filteredTasks : tasks}
          tasks={filteredTasks ? filteredTasks : tasks}
          fetchTask={fetchTasks}
        />
      ) : (
        <TaskBoard
          tasks={filteredTasks ? filteredTasks : tasks}
          setTasks={setTasks}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      )}
    </div>
  );
};

export default ListBoardFilter;
