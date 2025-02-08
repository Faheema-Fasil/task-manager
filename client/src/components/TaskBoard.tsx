import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
  editTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks, editTask, deleteTask }) => {
  const groupedTasks = {
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    "COMPLETED": tasks.filter((task) => task.status === "COMPLETED"),
  };

  /**
   * Handles drag and drop of tasks within the same column.
   * @param {object} result - The result of the drag and drop operation.
   * @return {void}
   */
  // const onDragEnd = (result: any) => {
  //   if (!result.destination) return;

  //   const { source, destination } = result;
  //   const updatedTasks = [...tasks];

  //   // Find the dragged task
  //   const movedTask = updatedTasks.find((task) => task.id === result.draggableId);
  //   if (!movedTask) return;

  //   // Remove the task from the source position
  //   updatedTasks.splice(source.index, 1);

  //   // Insert the task at the new position
  //   updatedTasks.splice(destination.index, 0, movedTask);

  //   // Update the status if moved to a new column
  //   if (source.droppableId !== destination.droppableId) {
  //     movedTask.status = destination.droppableId as "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  //   }

  //   // Set the new state
  //   setTasks(updatedTasks);
  // };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Clone the tasks array
    let updatedTasks = [...tasks];

    // Find the dragged task index
    const draggedTaskIndex = updatedTasks.findIndex((task) => task.id === draggableId);
    if (draggedTaskIndex === -1) return; // Exit if task not found

    // Extract the dragged task
    const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);

    // Update status if moved across lists
    if (source.droppableId !== destination.droppableId) {
      draggedTask.status = destination.droppableId as "TO-DO" | "IN-PROGRESS" | "COMPLETED";
    }

    // Filter tasks for the destination list
    const destinationTasks = updatedTasks.filter((task) => task.status === destination.droppableId);

    // Insert task at correct position in the filtered list
    destinationTasks.splice(destination.index, 0, draggedTask);

    // Rebuild the final task list with updated ordering
    updatedTasks = [
      ...updatedTasks.filter((task) => task.status !== destination.droppableId),
      ...destinationTasks,
    ];

    setTasks(updatedTasks);
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mt-8 flex flex-row gap-4">
        {Object.entries(groupedTasks).map(([status, taskList]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-1/4 border-none rounded-lg p-4 min-h-100 bg-gray-100"
              >
                <span className="bg-[#FAC3FF] p-2 rounded text-xs">{status}</span>

                {taskList.length > 0 ? (
                  taskList.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white flex flex-col gap-2 p-2 mt-5 rounded-2xl"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-semibold ${status === "COMPLETED" ? "line-through" : ""
                                }`}
                            >
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <BsThreeDots className="text-sm" onClick={() => {
                                const menu = document.getElementById(`menu-${task.id}`);
                                if (menu) {
                                  menu.classList.toggle('hidden');
                                }
                              }} />
                              <div id={`menu-${task.id}`} className="hidden absolute ml-5 mt-2 w-32 bg-white rounded-md shadow-lg">
                                <div className="py-1 text-right">
                                  <button onClick={() => editTask(task)} className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                                    <CiEdit className="inline-block mr-2" />
                                    Edit
                                  </button>
                                  <button onClick={() => deleteTask(task)} className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                                    <MdDelete className="inline-block mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{task.category}</span>
                            <span>{task.dueDate.toDate().toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="flex flex-col items-center mt-5">
                    <p className="text-gray-500 text-sm">No tasks</p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;

