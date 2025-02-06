import React from 'react';
import due from '../assets/Sort.png'


const TaskTableHeader: React.FC = () => (
  <div className="flex items-center justify-between text-gray-600 mr-10 p-2 rounded-t">
    <div className=" font-xs w-7/12">Task name</div> 
    <div className="font-xs flex items-center gap-2 w-3/12"><span>Due on </span><img className='mt-1' src={due} alt="" /></div>
    <div className=" font-xs w-2/12">Task Status</div>
    <div className="font-xs w-2/12">Task Category</div> 
  </div>
);





export default TaskTableHeader;
