import React from 'react'
const AddTaskForm: React.FC<{
  newTask: { name: string; dueDate: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addTask: () => void;
  onCancel: () => void;
}> = ({ newTask, handleInputChange, addTask, onCancel }) => (
  <div className="mb-4 p-4 bg-gray-50 rounded">
    <input
      type="text"
      name="name"
      placeholder="Task Title"
      value={newTask.name}
      onChange={handleInputChange}
      className="border rounded px-2 py-1 mr-2 w-full mb-2"
    />
    <input
      type="text"
      name="dueDate"
      placeholder="Add date"
      value={newTask.dueDate}
      onChange={handleInputChange}
      className="border rounded px-2 py-1 mr-2 w-full mb-2"
    />
    <div className="flex justify-end">
      <button onClick={addTask} className="bg-indigo-500 text-white rounded px-4 py-2 mr-2">
        ADD
      </button>
      <button onClick={onCancel} className="text-gray-600 rounded px-4 py-2">
        CANCEL
      </button>
    </div>
  </div>
);


export default AddTaskForm
