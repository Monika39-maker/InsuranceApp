import { useEffect, useState } from "react";
import UserLogin from "./components/userLogin";
import AdminPage from "./components/AdminPage";
import UnderwriterPage from "./components/UnderwriterPage";
import ChatWidget from "./components/ChatWidget";




function App() {
  return (
    <>
      {/* <UnderwriterPage /> */}
      <UserLogin /> 
      {/* Render AdminPage - it fetches users from http://localhost:3000/users */}
      {/* <AdminPage /> */}
      <ChatWidget />
      
    </>
  );
}

export default App;
