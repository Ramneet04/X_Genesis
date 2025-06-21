import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/NavBar'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'

function App() {

  return (
    <>
    <div className='w-full'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/aboutUs" element={<AboutUs/>}></Route>
      </Routes>
    </div>
    </>
  )
}

export default App
