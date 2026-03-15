import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Login from "./pages/Login";

function App() {

  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/doc/:id"
          element={token ? <Editor /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;