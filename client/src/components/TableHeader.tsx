import React from 'react';
import due from '../assets/Sort.png'


const TaskTableHeader: React.FC = () => (
  <div className="flex items-center justify-between text-gray-600 mr-10 p-2 rounded-t">
    <div className=" font-xs">Task name</div> 
    <div className="font-xs flex items-center gap-2"><span>Due on </span><img className='mt-1' src={due} alt="" /></div>
    <div className=" font-xs">Task Status</div>
    <div className="font-xs">Task Category</div> 
  </div>
);





export default TaskTableHeader;
