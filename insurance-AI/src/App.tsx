import { useEffect, useState } from "react";
import UserLogin from "./components/userLogin";
import AdminPage from "./components/AdminPage";
import UnderwriterPage from "./components/UnderwriterPage";
<<<<<<< HEAD
import Chatbot from "./components/Chatbot";
=======
import ChatWidget from "./components/ChatWidget";



>>>>>>> ab546b7282011979dd8f752fde2b263cca70168b

function App() {
  return (
    <>
<<<<<<< HEAD
      <Chatbot />
      <UnderwriterPage />
      <UserLogin />
=======
      {/* <UnderwriterPage /> */}
      <UserLogin /> 
>>>>>>> ab546b7282011979dd8f752fde2b263cca70168b
      {/* Render AdminPage - it fetches users from http://localhost:3000/users */}
      {/* <AdminPage /> */}
      <ChatWidget />
      
    </>
  );
}

export default App;
