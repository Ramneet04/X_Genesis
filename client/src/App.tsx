import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/NavBar'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import LoginCard from './components/auth/login'
import SignupCard from './components/auth/signup'
import VerifyEmail from './pages/VerifyEmail'
import CreateNfts from './pages/CreateNft'
import OrganizationRegistrationForm from './pages/Organizations'

function App() {

  return (
    <>
    <div className='w-full bg-gray-950 h-screen'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/aboutUs" element={<AboutUs/>}></Route>
        <Route path="/login" element={<LoginCard/>}></Route>
        <Route path="/signup" element={<SignupCard/>}></Route>
        <Route path="/verify-email" element={<VerifyEmail/>}></Route>
        <Route path="/create-nft" element={<CreateNfts/>}></Route>
        <Route path="/create-organization" element={<OrganizationRegistrationForm/>}></Route>
      </Routes>
    </div>
    </>
  )
}

export default App
