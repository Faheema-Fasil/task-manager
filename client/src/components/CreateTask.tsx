import React, { useEffect, useRef, useState } from "react";
import TextEditor from "./Quill";
import { Drawer } from "@mui/material"; // Import Material UI Drawer
import useMediaQuery from "@mui/material/useMediaQuery"; // Media query detection

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
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detect mobile screen size
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("WORK"); // Default category
  const [status, setStatus] = useState<string>("TO-DO"); // Default status
  const [dueDate, setDueDate] = useState<string>(""); // Store due date as string first
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!task.trim()) {
      alert("Task title is required!");
      return;
    }

    const taskData = {
      title: task,
      description,
      dueDate: dueDate ? new Date(dueDate) : new Date(), // Convert to Date
      category,
      status,
    };
    
    onAddTask(taskData);
    console.log("Task added:", taskData);
    
    setTask("");
  };

  const taskForm = (
    <div className="bg-white w-full md:w-200 px-2">
      <div className="flex justify-between items-center border-gray-300 border-b p-3">
        <h2 className="text-xl text-gray-600 p-2">Create Task</h2>
        <button
          onClick={onHide}
          className="text-gray-500 mr-2 hover:text-red-600 transition text-lg duration-200"
        >
          ✖
        </button>
      </div>

      <div className="p-2">
        <input
          className="w-full py-1 border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Task title"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <TextEditor />

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-col w-2/3">
            <label className="text-gray-600">Task Category*</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-1 rounded-md"
            >
              <option value="WORK">Work</option>
              <option value="PERSONAL">Personal</option>
            </select>
          </div>

          <div className="flex flex-col w-2/3">
            <label className="text-gray-600">Due on*</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 p-1 rounded-md"
            />
          </div>

          <div className="flex flex-col w-2/3">
            <label className="text-gray-600">Task Status*</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 p-1 rounded-md"
            >
              <option value="TO-DO">To-Do</option>
              <option value="IN-PROGRESS">In-Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-gray-600">Attachment</label>
          <div className="border border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:underline"
            >
              {selectedFile ? selectedFile.name : "Upload File"}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-end bg-gray-200 rounded-b-3xl">
        <button
          onClick={onHide}
          className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-400"
        >
          Close
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-700"
        >
          Create
        </button>
      </div>
    </div>
  );

  return (
    <>
      {!isMobile && show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          {taskForm}
        </div>
      )}

      <Drawer
        anchor="bottom"
        open={isMobile && show}
        onClose={onHide}
        PaperProps={{ style: { borderRadius: "20px 20px 0 0", paddingBottom: "5px" } }}
      >
        {taskForm}
      </Drawer>
    </>
  );
};

export default CreateTask;
