import React, { useState } from 'react';
import Header from '../components/Header';
import ListBoardFilter from '../components/ListBoardFilter';

import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';

// --- Interfaces ---
interface Task {
    title: string;
  name: string;
  dueDate: string;
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  category: 'WORK' | 'PERSONAL';


}





// --- Main TaskBuddy Component ---
const TaskBuddy: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<{ name: string; dueDate: string }>({ name: '', dueDate: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [openSections, setOpenSections] = useState<{
    'TO-DO': boolean;
    'IN-PROGRESS': boolean;
    'COMPLETED': boolean;
  }>({
    'TO-DO': true,
    'IN-PROGRESS': true,
    'COMPLETED': true,
  });

  const addTask = () => {
    setTasks([...tasks, { ...newTask, status: 'TO-DO' }]);
    setNewTask({ name: '', dueDate: '' });
    setIsAddingTask(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const filterTasks = (status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED') =>
    tasks.filter((task) => task.status === status);

  const toggleSection = (status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED') =>
    setOpenSections({ ...openSections, [status]: !openSections[status] });

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <Header />

        <ListBoardFilter setIsAddingTask={setIsAddingTask} />

        {isAddingTask && (
          <AddTaskForm
            newTask={newTask}
            handleInputChange={handleInputChange}
            addTask={addTask}
            onCancel={() => setIsAddingTask(false)}
          />
        )}

        <TaskList
          title="Todo"
          tasks={filterTasks('TO-DO')}
          isOpen={openSections['TO-DO']}
          onToggle={() => toggleSection('TO-DO')}
        />
        
      </div>
    </div>
  );
};

export default TaskBuddy;
