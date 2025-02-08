import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import TaskBuddy from "./pages/TaskView";
import { useAuth } from "./firebase";
// import Dashboard from "./components/Dashboard";

const App = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
        <Routes>
          <Route
            path="/"
            element={currentUser !== null ? <Navigate to="/landing" /> : <LoginPage />}
          />
          <Route path="/landing" element={currentUser !== null ? <TaskBuddy /> : <Navigate to="/" />} />
        </Routes>
    </Router>
  );
};

export default App;

