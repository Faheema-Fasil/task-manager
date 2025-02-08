import React from "react";
import { BsThreeDots } from "react-icons/bs";


interface Task {
  id: string;
  title: string;
  dueDate: any;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: "WORK" | "PERSONAL";
  description: string;
  createdAt: any;
}

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks }: TaskBoardProps) => {
  const groupedTasks = {
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    "COMPLETED": tasks.filter((task) => task.status === "COMPLETED"),
  };

  return (
    <div className="mt-8">
      <div className="flex flex-row gap-4">
        {Object.entries(groupedTasks).map(([status, taskList]) => (
          <div key={status} className="w-1/4 border-none rounded-lg p-4 min-h-100 bg-gray-100">
            <span className="bg-[#FAC3FF] p-2 rounded text-xs">{status}</span>

            {taskList.length > 0 ? (
              taskList.map((task) => (
                <div key={task.id} className="bg-white flex flex-col gap-2 p-2 mt-5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${status === "COMPLETED" ? "line-through" : ""}`}>
                      {task.title}
                    </span>
                    <BsThreeDots className="text-sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{task.category}</span>
                    <span>{task.dueDate.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center mt-5">

                <p className="text-gray-500 text-sm">No tasks</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;

