
import React from 'react';
import  { Route , Routes} from "react-router-dom";
import "./App.css"
import Navbar from "./Components/Navbar"
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import pageerror from './Components/pageerror';
import LoginForm from './Components/Signin';
import UserList from './Components/UserLists';
import UserProfile from './Components/UserProfile';
import LogoutButton from './Components/Logout';
 const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userlists" element={<UserList />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/logout" element={<LogoutButton />} />




      
        
        
    

      </Routes>
      
    
      
    </div>
  );
}
export default App;
