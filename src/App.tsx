import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/Layout.tsx";
import "./App.css";
import Projects from "./components/Pages/Dashboard/Projects.tsx";
import MergeRequests from "./components/Pages/Dashboard/MergeRequests.tsx";
import Summary from "./components/Pages/Dashboard/Summary.tsx";
import Users from "./components/Pages/Dashboard/Users.tsx";
import Visualization from "./components/Pages/Dashboard/Visualization.tsx";
import Login from "./components/Pages/Login/Login.tsx";


function App() {
  return (

    <Router>
      <Routes>
        <Route path ="/" element={<Layout><Projects/></Layout>} />
        <Route path = "/projects" element={<Layout><Projects /></Layout>} />
        <Route path = "/merge-requests" element={<Layout><MergeRequests /></Layout>} />
        <Route path = "/summary" element={<Layout><Summary /></Layout>} />
        <Route path = "/users" element={<Layout><Users /></Layout>} />
        <Route path = "/visualization" element={<Layout><Visualization /></Layout>} />
        <Route path = "/signup" element={<Login />} />
        
      </Routes>
    </Router>
  );
}

export default App;