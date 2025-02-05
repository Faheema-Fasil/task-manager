import React, { useState, useRef } from 'react';
import calenderimg from '../assets/calender_icon.svg';
import { IoMdClose } from "react-icons/io";
import TextEditor from './Quill';

interface UpdateTaskProps {
    show: boolean;
    onHide: () => void;
    task: Task;
    onSave: (updatedTask: Task) => void;
}

interface Task {
    id: string;
    name: string;
    dueDate: string;
    status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
    category: 'WORK' | 'PERSONAL';
    description: string;
    attachment: File | null;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ task, show, onHide, onSave }) => {
    const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUpdatedTask({ ...updatedTask, status: e.target.value as Task['status'] });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUpdatedTask({ ...updatedTask, category: e.target.value as Task['category'] });
    };

    const handleDateClick = () => {
        if (!updatedTask.dueDate) {
            updatedTask.dueDate = new Date().toLocaleDateString('en-CA');
        }
        const datePicker = document.createElement("input");
        datePicker.type = "date";
        datePicker.value = updatedTask.dueDate;
        datePicker.className = "absolute opacity-0 pointer-events-none";
        datePicker.addEventListener("change", () => {
            setUpdatedTask((prev) => ({ ...prev, dueDate: datePicker.value }));
            datePicker.remove();
        });
        document.body.appendChild(datePicker);
        datePicker.click();
    };

    const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setUpdatedTask({ ...updatedTask, attachment: file });
    };

    const handleUpdate = () => {
        onSave(updatedTask);
        onHide();
    };

    return (
        <>
            {show && (

                <div className="fixed inset-0 bg-black/50 flex justify-center items-center text-sm z-50">
                    <div className="bg-white  rounded-3xl p-4 shadow-lg w-250 relative">
                        <div className='border-b w-full border-gray-300 py-8'>
                            <button onClick={onHide} className="absolute  top-4 mr-2 text-bold text-2xl right-4 text-gray-500 hover:text-red-600">
                                <IoMdClose size={24} />
                            </button>
                        </div>
                        <div className='flex w-full justify-between'>

                            <div className= 'w-7/12  max-h-100 overflow-y-auto'>

                                <div className="p-6 snap-y mb-25">
                                    <input
                                        className="w-full py-1 bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Task title"
                                        type="text"
                                        name="name"
                                        value={updatedTask.name}
                                        onChange={handleInputChange}
                                    />

                                    <TextEditor
                                        className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows={5}
                                        name="description"
                                        value={updatedTask.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter task description..."
                                    />

                                    <div className="flex items-center gap-3 mt-2 justify-between border-gray-300">
                                        <div className="font-sm w-4/12 flex flex-col gap-2 text-gray-600">
                                            Task Category*
                                            <div
                                                className=" flex gap-2  text-xs text-black py-1 rounded-full "
                                            // value={updatedTask.category}
                                            // onChange={handleCategoryChange}
                                            >
                                                <button className='border border-gray-300 rounded-full px-2 py-1 hover:bg-gray-100' value="WORK">Work</button>
                                                <button className='border border-gray-300 rounded-full px-2 py-1 hover:bg-gray-100' value="PERSONAL">Personal</button>
                                            </div>
                                        </div>
                                        <div className="font-sm w-4/12 flex flex-col gap-2 text-gray-600">
                                            Due on*
                                            <input
                                                type="date"
                                                className="border bg-gray-50 w-full border-gray-300 text-gray-400 px-2 py-1 rounded-lg text-sm hover:bg-gray-100"
                                                value={updatedTask.dueDate}
                                                onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="font-sm w-4/12 flex flex-col gap-2 text-gray-600">
                                            Task Status*
                                            <select
                                                className="border border-gray-300 text-gray-400 transition duration-200 w-full bg-gray-50 hover:bg-gray-100 text-sm text-black py-1 rounded-full"
                                                value={updatedTask.status}
                                                onChange={handleStatusChange}
                                            >
                                                <option value="TO-DO">To-Do</option>
                                                <option value="IN-PROGRESS">In-Progress</option>
                                                <option value="COMPLETED">Completed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="font-xs w-4/12 flex flex-col gap-2 py-2 text-gray-400">Attachment</div>
                                    <div className="border border-gray-300 rounded-md p-4 bg-gray-100 text-center relative">
                                        <input
                                            type="file"
                                            ref={inputRef}
                                            className="absolute opacity-0 pointer-events-none"
                                            onChange={handleAttachmentChange}
                                        />
                                        <p className="text-gray-600">
                                            {updatedTask.attachment ? (
                                                <span>
                                                    {updatedTask.attachment.name} ({updatedTask.attachment.size} bytes)
                                                </span>
                                            ) : (
                                                <span>
                                                    Drop your files here to{' '}
                                                    <button onClick={() => inputRef.current?.click()} className="text-blue-500 hover:underline focus:outline-none">
                                                        Upload
                                                    </button>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                               
                            </div>
                            <div className='w-5/12 bg-gray-100'>
                                <div className='flex items-center px-3 bg-white gap-2 py-4 border text-lg border-gray-300'>
                                    Activity
                                </div>
                                <ul className='p-2 flex flex-col gap-3 text-gray-600 bg-gray-100 min-h-auto'>
                                    <li className='flex items-center justify-between text-xs gap-4 '>
                                       <p>You created this task</p> 
                                       <p>Dec 27 at 1:15 pm</p>
                                    </li>
                                    <li className='flex items-center justify-between text-xs gap-4 '>
                                       <p>You changed status from in progress to 
                                       complete</p> 
                                       <p>Dec 28 at 1:15 pm</p>
                                    </li>
                                    <li className='flex items-center justify-between text-xs gap-4 '>
                                       <p>You uploaded file</p> 
                                       <p>Dec 27 at 1:15 pm</p>
                                    </li>
                                </ul>

                            </div>
                        </div>
                         <div className="flex border-t bg-gray-50 border-gray-300 w-full py-4 items-center justify-end">
                                    
                                    <button onClick={onHide} className="px-6 py-3 text-gray-600 rounded-full hover:text-gray-800 focus:outline-none">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="px-6 py-3  bg-[#7B1984] rounded-full hover:bg-[#7B1984]/70 text-white mr-2 focus:outline-none"
                                    >
                                        Update
                                    </button>
                                </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateTask;
