import UserLogin from "./components/userLogin";
import AdminPage from "./components/AdminPage";
import UnderwriterPage from "./components/UnderwriterPage";

function App() {
  return (
    <>
      <UnderwriterPage />
      <UserLogin />
      {/* Render AdminPage - it fetches users from http://localhost:3000/users */}
      <AdminPage />
    </>
  );
}

export default App;
