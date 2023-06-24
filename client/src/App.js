import './App.css';
import Navbar from './components/Navbar';

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/createpost' element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
