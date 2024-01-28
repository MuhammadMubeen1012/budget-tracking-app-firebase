import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income"
import Saving from "./pages/Saving";
import Expenses from "./pages/Expenses";


function App() {  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/income" element={<Income />}></Route>
      <Route path="/expenses" element={<Expenses />}></Route>
      <Route path="/savings" element={<Saving />}></Route>
    </Routes>
  );
}

export default App;
