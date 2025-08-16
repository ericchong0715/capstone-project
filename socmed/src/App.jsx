import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./state/AuthContext";
import AppRoutes from "./Routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}

export default App;
