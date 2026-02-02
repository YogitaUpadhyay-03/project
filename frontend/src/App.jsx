import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/doc/:id" element={<Editor />} />
    </Routes>
  </BrowserRouter>
);

export default App;
