import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd/dist/react-beautiful-dnd.esm';
import TaskTableHeader from './TableHeader';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import calenderimg from '../assets/calender_icon.svg';
import { FiPlus } from "react-icons/fi";
import union from '../assets/Union.png';
import dragicon from '../assets/drag_icon.png';
import { MdCheckCircle, MdDelete } from "react-icons/md";
import Inprogress from '../components/Inprogress';
import { BsThreeDots } from 'react-icons/bs';
import { CiEdit } from "react-icons/ci";
import Completed from './Completed';
import UpdateTask from './UpdateTask';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Task {
  id: string;
  title: string;
  due: Timestamp;
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  category: 'WORK' | 'PERSONAL';
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [openToDo, setOpenToDo] = useState(true);
  const [newTask, setNewTask] = useState<Omit<Task, 'status' | 'category'>>({ title: '', due: Timestamp.now() });
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<string | null>(null);
  const [showUpdateTask, setShowUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "task"));
        const taskData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(taskData);
        console.log("Tasks fetched:", taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleEdit = (id: string) => {
    const task = tasks.find(task => task.id === id);
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
    setTasks([...tasks, { ...newTask, status: 'TO-DO', category: 'WORK', id: (tasks.length + 1).toString() }]);
    setNewTask({ title: '', due: Timestamp.now() });
    setIsAddingTask(false);
  };

  const updateTaskStatus = (id: string, status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED') => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status } : task));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateClick = () => {
    const datePicker = document.createElement("input");
    datePicker.type = "date";
    datePicker.value = newTask.due.toDate().toISOString().split('T')[0];
    datePicker.className = "absolute opacity-0 pointer-events-none";
    datePicker.addEventListener("change", () => {
      setNewTask((prev) => ({ ...prev, due: Timestamp.fromDate(new Date(datePicker.value)) }));
      datePicker.remove();
    });
    document.body.appendChild(datePicker);
    datePicker.click();
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setShowUpdateTask(false);
  };

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, removed);

    setTasks(newTasks);
  };

  return (
    <div className="w-full">
      <hr className="mt-8 border-gray-200" />
      <TaskTableHeader />

      <div className='flex justify-between items-center bg-[#FAC3FF] p-3 rounded-t-2xl'>
        <h6 className="font-xs font-semibold">Todo ({tasks.length})</h6>
        <button onClick={() => setOpenToDo(!openToDo)}>
          {openToDo ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </button>
      </div>

      <div className=' '>
        {openToDo && (
          <div className="bg-gray-100 rounded-b-2xl shadow-md">
            <div className="flex justify-between items-center p-2 border-b border-gray-300">
              <button onClick={() => setIsAddingTask(true)} className="rounded px-4 py-2 text-sm">
                <span className='text-purple'>+</span> ADD TASK
              </button>
            </div>

            {isAddingTask && (
              <div className="mb-4 p-4 bg-gray-50 rounded relative">
                <div className='flex items-center px-8 mr-50 justify-between mx-5'>
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
                    <img src={calenderimg} alt="Calendar Icon" className="w-5 h-5" />
                    <span className='text-xs'>Add Date</span>
                  </button>
                  <div>
                    <button className='border border-gray-300 rounded-full text-sm p-1'><FiPlus/></button>
                    <div className='flex bg-white absolute border border-gray-300 rounded-2xl p-2 text-sm items-start justify-items-start flex-col'>
                      <button className='w-full text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300'>TO-DO</button>
                      <button className='w-full text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300'>IN-PROGRESS</button>
                      <button className='w-full text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300'>COMPLETED</button>
                    </div>
                  </div>
                  <div>
                    <button className='border border-gray-300 rounded-full text-sm p-1'><FiPlus/></button>
                    <div className='flex bg-white absolute border border-gray-300 rounded-2xl p-2 text-sm items-start justify-items-start flex-col'>
                      <button className='w-text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300'>WORK</button>
                      <button className='w-text-start flex text-xs mb-1 items-start justify-items-start hover:border-b border-gray-300'>PERSONAL</button>
                    </div>
                  </div>
                </div>
                <div className="flex mt-2 mx-13">
                  <button onClick={addTask} className="bg-[#7B1984] flex items-center gap-2 text-white px-3 rounded-full" disabled={!newTask.title || !newTask.due}>
                    <span className='text-xs'>ADD </span>  <img src={union} alt="" />
                  </button>
                  <button onClick={() => setIsAddingTask(false)} className="rounded px-4 py-2">
                    CANCEL
                  </button>
                </div>
              </div>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="todo">
                {(provided) => (
                  <div className='min-h-30' ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.filter(task => task.status === 'TO-DO').map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-50 transition"
                          >
                            <div className='flex items-center gap-1 w-7/12'>
                              <input type="checkbox" className="" />
                              <div className="w-100 flex items-center">
                                <img src={dragicon} alt="" className='cursor-move' />
                                <span className='mr-2'><MdCheckCircle /></span>
                                <p className='flex-1'>{task.title}</p>
                              </div>
                            </div>
                            <div className="w-3/12 text-gray-500">{task.due.toDate().toLocaleDateString()}</div>
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
                                      <CiEdit/>
                                      <span>Edit</span>
                                    </div> 
                                  </button>
                                  <button
                                    className="block w-full text-left hover:text-black"
                                    onClick={() => handleDelete(task.id)}
                                  >
                                    <div className='flex items-center gap-1'>
                                      <MdDelete className='text-red-500'/>
                                      <span className='text-red-500'>Delete</span>
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

      <div className='mt-4'>
        <Inprogress tasks={tasks} handleDelete={handleDelete} handleEdit={handleEdit} updateTaskStatus={updateTaskStatus} menuOpenTaskId={menuOpenTaskId} setMenuOpenTaskId={setMenuOpenTaskId} />
      </div>
      <div className='mt-4'>
        <Completed tasks={tasks} handleDelete={handleDelete} handleEdit={handleEdit} updateTaskStatus={updateTaskStatus} menuOpenTaskId={menuOpenTaskId} setMenuOpenTaskId={setMenuOpenTaskId} />
      </div>

      {showUpdateTask && selectedTask && (
        <UpdateTask
          show={showUpdateTask}
          onHide={() => setShowUpdateTask(false)}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default TaskList;