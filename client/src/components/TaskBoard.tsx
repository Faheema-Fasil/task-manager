import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// interface Task {
//   id: string;
//   name: string;
//   dueDate: string;
//   status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
//   category: 'WORK' | 'PERSONAL';
// }

// interface TaskBoardProps {
 
// }

const TaskBoard: React.FC = () => {



  return (
   <div className='mt-8'>
    <div className='flex flex-row gap-4'>
      <div className='w-1/4 border-none  rounded-lg p-4 min-h-100 bg-gray-100'>
      
        <span className='bg-[#FAC3FF] p-2  rounded text-xs'>TO-DO</span>
{/* todooooo */}

        <div className='bg-white flex flex-col gap-15 p-2 mt-5 rounded-2xl'>
          <div className='flex items-center justify-between'>

          <span className='text-sm font-semibold'>Interview with Design Team</span>
          <BsThreeDots className='text-sm' />

          </div>
          <div className='flex items-center  justify-between'>

          <span className='text-xs text-gray-400'>Work</span>
          <span className='text-xs text-gray-400'>date</span>


          </div>

        </div>
      </div>




      {/* inprogress */}
      <div className='w-1/4 border-none  rounded-lg p-4 min-h-100 bg-gray-100'>
      
        <span className='bg-[#FAC3FF] p-2  rounded text-xs'>IN-PROGRESS</span>


        <div className='bg-white flex flex-col gap-15 p-2 mt-5 rounded-2xl'>
          <div className='flex items-center justify-between'>

          <span className='text-sm font-semibold'>Interview with Design Team</span>
          <BsThreeDots className='text-sm' />

          </div>
          <div className='flex items-center  justify-between'>

          <span className='text-xs text-gray-400'>Work</span>
          <span className='text-xs text-gray-400'>date</span>


          </div>

        </div>
      </div>





      {/* COMPLETED */}
      <div className='w-1/4 border-none  rounded-lg p-4 min-h-100 bg-gray-100'>
      
        <span className='bg-[#FAC3FF] p-2  rounded text-xs'>COMPLETED</span>


        <div className='bg-white flex flex-col gap-15 p-2 mt-5 rounded-2xl'>
          <div className='flex items-center justify-between'>

          <span className='text-sm font-semibold line-through'>Interview with Design Team</span>
          <button>

          <BsThreeDots className='text-sm' />
          </button>

          </div>
          <div className='flex items-center  justify-between'>

          <span className='text-xs text-gray-400'>Work</span>
          <span className='text-xs text-gray-400'>date</span>


          </div>

        </div>
      </div>



    </div>

   </div>
  );
};

export default TaskBoard;
