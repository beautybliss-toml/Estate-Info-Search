'use client';
import axios from 'axios';
import { useSelector, } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Userlist from './pages/userlist.jsx';
import Profile from './pages/profile.jsx';
import Login from './pages/login.jsx'
import Search from './pages/search.jsx';
import Register from './pages/register.jsx';
import InvalidRoute from './pages/invalidroute.jsx';

import { getUser } from './features/userSlice.js';
import store from './store'
import config from './app/config.js';

const TOKEN = localStorage.getItem("token");
if (TOKEN) {
  axios.defaults.headers.common["Authorization"] = `${TOKEN}`;
  store.dispatch(getUser())
}

function App() {
  const { user } = useSelector((store) => store.user);

  return (
    <Router>
      <Routes>
        <Route path='/' element={ !user ? <Login /> : <Search /> } />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={ <Register /> } />
        {/* {renderRoute()} */}
        {user ? <Route path="/search" element={<Search />} /> : <Route path="/search" element={<InvalidRoute />} />}
        {user?.username === config.admin_name && <Route path="/userlist" element={<Userlist />} />}
        {user ? <Route path="/profile" element={<Profile />} /> : <Route path="/search" element={<InvalidRoute />} />}
      </Routes>
    </Router>
  );
}

export default App

