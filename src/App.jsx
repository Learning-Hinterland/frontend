import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses/Courses.jsx";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateCourses from "./pages/Courses/CreateCourses.jsx";
import CourseById from "./pages/Courses/CourseById.jsx";
import ContentByMaterialId from "./pages/Content.jsx";
import CreateMaterial from "./pages/Courses/CreateMaterial.jsx";
import CreateContent from "./pages/Courses/CreateContent.jsx";
import EditCourses from "./pages/Courses/EditCourses.jsx";
import EditMaterial from "./pages/Courses/EditMaterial.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseById />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute>
              <CreateCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/edit/:id"
          element={
            <ProtectedRoute>
              <EditCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contents/:id"
          element={
            <ProtectedRoute>
              <ContentByMaterialId />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contents/create/:id"
          element={
            <ProtectedRoute>
              <CreateContent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/material/create/:id"
          element={
            <ProtectedRoute>
              <CreateMaterial />
            </ProtectedRoute>
          }
        />

        <Route
          path="/material/edit/:id"
          element={
            <ProtectedRoute>
              <EditMaterial />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
