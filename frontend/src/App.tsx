import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import WodsPage from "./pages/WodsPage";
import ExercisesPage from "./pages/ExercisesPage";
import LoginPage from "./pages/LoginPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/wods" element={<WodsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
