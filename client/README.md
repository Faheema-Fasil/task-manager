Task Management Application

A fully responsive task management application built with React, Firebase, and Drag-and-Drop functionality, enabling users to efficiently manage their tasks with seamless authentication, categorization, and prioritization.

 Live Demo
 Live Application

 Features
       User Authentication – Google Sign-In using Firebase Authentication.
       Task Management – Create, edit, delete, and categorize tasks (To-Do, In Progress, Completed).
       Drag-and-Drop Functionality – Rearrange tasks seamlessly across different statuses.
       Sorting & Filtering – Organize tasks by due date and category.
       Multiple Views – List and board views for better task visualization.
       Responsive UI – Fully optimized for mobile, tablet, and desktop devices.

 Tech Stack
  
  Frontend
         1. React (TypeScript)
         2. React Router (Navigation)
         3. MUI, Bootstrap, MDB React UI Kit, Tailwind CSS, Emotion (UI Components)
         4. React DND 
        
  Backend & Database
        1. Firebase Firestore (Real-time Database)
        2. Firebase Authentication (Google Sign-In)
        3. Development & Build Tools
        4. Vite (Fast Development Build)
        5. TypeScript (Strong Typing)
        
 Installation & Setup
 
  Follow these steps to run the project locally:
  
    1. Clone the Repository
        git clone https://github.com/Faheema-Fasil/task-manager.git
        cd task-manager
    
    2. Install Dependencies
        npm install
    
    3. Run the Development Server
         npm run dev
       
    4. Build the Application for Deployment
        npm run build

 Challenges Faced & Solutions
        1. Task Rearrangement Bug
            Issue: When dragging a task, it was being placed at the wrong position.
            Solution: Fixed by properly filtering and reordering the tasks array before updating the state.
        2. Task Multiplication on Drop
            Issue: Tasks were duplicating when dropped into a new status category.
            Solution: Ensured tasks were removed from the source list before inserting them into the destination list.
        3. Firebase Firestore Synchronization
            Issue: Reordered tasks were not updating in Firebase.
            Solution: Implemented batch updates to reflect changes in the database instantly.
