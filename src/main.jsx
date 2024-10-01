import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
// routes

import Home from './pages/home/home.jsx';
import Login from "./pages/login/login.jsx";
import Register from './pages/register/register.jsx';
import Callback from './pages/authcallback/authCallback.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Profile from './pages/profile/profile.jsx';
import Inbox from './pages/inbox/inbox.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="login/:role" element={<Login />} />
          <Route path="/google/callback" element={<Callback />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="inbox/:id" element={<Inbox />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
