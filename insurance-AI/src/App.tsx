import UserLogin from "./components/userLogin";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <>
      <UserLogin />
      {/* Render AdminPage - it fetches users from http://localhost:3000/users */}
      <AdminPage />
    </>
  );
}

export default App;
