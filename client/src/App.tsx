
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import TaskBuddy from "./pages/TaskView";
// import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<TaskBuddy />} />

      </Routes>
    </Router>
  );
};

export default App;