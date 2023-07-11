import './App.css';
import Navbar from './components/Navbar';

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';

import NetworkContext from './context/NetworkContext'
import UserContext from "./context/UserContext"
import { initialState, reducer } from './reducers/userReducer'
import { useContext, useEffect, useReducer } from 'react';
import UserProfile from './pages/UserProfile';
import SubscribedUserPost from './pages/SubscribedUserPost';


const Routing = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    if (user) {
      dispatch({ type: "USER", payload: user })
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/createpost' element={<CreatePost />} />
        <Route path='/profile/:userId' element={<UserProfile />} />
        <Route path='/myfollowerspost' element={<SubscribedUserPost />} />
      </Routes>
    </>
  )
}

function App() {
  // const networkUrl = "http://localhost:5000"
  const networkUrl = "https://instagram-backend-4p30.onrender.com"
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <NetworkContext.Provider value={networkUrl}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </NetworkContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
