import React, { useState } from "react";
import Header from "../components/Header";
import ListBoardFilter from "../components/ListBoardFilter";


const TaskBuddy: React.FC = () => {
  const [openSections, setOpenSections] = useState<{
    "TO-DO": boolean;
    "IN-PROGRESS": boolean;
    COMPLETED: boolean;
  }>({
    "TO-DO": true,
    "IN-PROGRESS": true,
    COMPLETED: true,
  });

  const toggleSection = (status: "TO-DO" | "IN-PROGRESS" | "COMPLETED") =>
    setOpenSections({ ...openSections, [status]: !openSections[status] });

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-md">
        <Header />

      <div className="p-4 md:p-15">

        <ListBoardFilter
          toggleSection={toggleSection}
          openSections={openSections}
          />
          </div>
      </div>
    </div>
  );
};

export default TaskBuddy;
