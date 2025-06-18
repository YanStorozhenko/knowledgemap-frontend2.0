
import './App.css'

import { Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.tsx";


import Home from "./pages/Home";
import Map from "./pages/MapPage.tsx";
import Topics from "./pages/Topics";
import Posts from "./pages/Posts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Progress from "./pages/Progress";
import Tests from "./pages/Tests";
import CodeExamples from "./pages/CodeExamples";
import Glossary from "./pages/Glossary";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import AdminPage from "./pages/admin/AdminPage.tsx";


function App() {

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-void via-galaxy to-cosmic text-starlight">


          <Navbar/>


          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/codeExamples" element={<CodeExamples />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/favorites" element={<Favorites />} />

              <Route path="/login" element={<Login />} />
              <Route path="/admin/adminPage" element={<AdminPage />} />
          </Routes>
      </div>
  )
}

export default App
