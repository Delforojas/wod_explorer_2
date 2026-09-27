import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import WodsPage from "./pages/WodsPage";
import ExercisesPage from "./pages/ExercisesPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/wods" element={<WodsPage />} />
      </Routes>
    </>
  );
}

export default App;
