import React, { useEffect, useRef, useState } from "react";
import TextEditor from "./Quill";

interface Props {
  description: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddTask: (taskData: { title: string; description: string; dueDate: Date; category: string; status: string }) => void;
  task: string;
  setTask: (task: string) => void;
}

interface CreateTaskProps {
  show: boolean;
  onHide: () => void;
}

const CreateTask: React.FC<CreateTaskProps & Props> = ({
  description,
  onChange,
  show,
  onHide,
  onAddTask,
  task,
  setTask,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpdateClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input dialog
    }
  };

  const handleSubmit = () => {
    const taskData = {
      title: task,
      description: description,
      dueDate: new Date(), // Replace with actual due date from your form
      category: "WORK", // Replace with actual category from your form
      status: "TO-DO", // Replace with actual status from your form
    };
    onAddTask(taskData);
    console.log("Task added:", taskData);
    
  };
  

  if (!show) return null; // Hide modal when `show` is false

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center text-sm items-center z-50">
      <div className="bg-white rounded-3xl shadow-lg w-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-gray-300 border-b p-3">
          <h2 className="text-xl text-gray-600 p-2">Create Task</h2>
          <button
            onClick={onHide}
            className="text-gray-500 mr-2 hover:text-red-600 transition text-lg duration-200"
          >
            ✖
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 snap-y mb-25">
          <input
            className="w-full py-1 bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Task title"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <TextEditor />

          {/* Task Category, Due Date, and Status */}
          <div className="flex items-center gap-3 mt-2 justify-between border-gray-300">
            <div className="font-sm w-4/12 flex flex-col gap-2 text-gray-600">
              Task Category*
              <div className="flex gap-2">
                <button className="border border-gray-300 px-4 text-xs text-black py-1 rounded-full hover:bg-gray-200 transition duration-200">
                  Work
                </button>
                <button className="border border-gray-300 px-4 text-xs text-black py-1 rounded-full hover:bg-gray-200 transition duration-200">
                  Personal
                </button>
              </div>
            </div>
            <div className="font-sm w-4/12 flex flex-col gap-2 text-gray-600">
              Due on*
              <input
                type="date"
                className="border bg-gray-50 w-full border-gray-300 text-gray-400 px-2 py-1 rounded-lg text-sm hover:bg-gray-100"
              />
            </div>
            <div className="font-sm w-4/12 flex flex-col gap-2 text-gray-600">
              Task Status*
              <select
                className="border border-gray-300 text-gray-400 transition duration-200 w-full bg-gray-50 hover:bg-gray-100 text-sm text-black py-1 rounded-full"
              >
                <option value="" disabled selected hidden>
                  Choose
                </option>
                <option value="TO-DO">To-Do</option>
                <option value="IN-PROGRESS">In-Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Attachment */}
          <div>
            <div className="font-xs w-4/12 flex flex-col gap-2 py-2 text-gray-400">Attachment</div>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-100 text-center relative">
              <input
                type="file"
                ref={fileInputRef}
                className="absolute opacity-0 pointer-events-none"
                onChange={handleFileChange}
              />
              <p className="text-gray-600">
                {selectedFile ? (
                  <span>
                    {selectedFile.name} ({selectedFile.size} bytes)
                  </span>
                ) : (
                  <span>
                    Drop your files here or{" "}
                    <button onClick={handleUpdateClick} className="text-blue-500 hover:underline focus:outline-none">
                      Update
                    </button>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 p-6 flex rounded-b-3xl border-t border-gray-400 bg-gray-200 justify-end gap-3">
          <button
            onClick={onHide}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-400 text-gray-700 transition duration-150 ease-in-out focus:outline-none"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#7B1984]/50 rounded-full hover:bg-[#7B1984]/30 text-white transition duration-150 ease-in-out focus:outline-none"
          >
            <span className="flex items-center gap-2">Create</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;