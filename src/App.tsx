
import './App.css'

import {Link, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
// import Graph from "./components/Graph/Graph";
import Navbar from "./components/Navbar/Navbar.tsx";

const logoLinkStyle = "flex items-center gap-2 text-xl font-bold text-cyan-300";


function App() {

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-void via-galaxy to-cosmic text-starlight">

          <Navbar/>
          {/*Логотип */}
          <Link to="/" className={logoLinkStyle}>
              <div>
                  <img src="/logo.png" className="logo" alt="logo"/>
              </div>
          </Link>
          <h1>Карта знань з основ програмування</h1>

          <Routes>


              <Route path="/" element={<Home/>}/>
              {/*<Route path="/graph" element={<Graph/>}/>*/}
          </Routes>
      </div>
  )
}

export default App
