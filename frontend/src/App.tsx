import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import WodsPage from "./pages/WodsPage";
import ExercisesPage from "./pages/ExercisesPage";
import LoginPage from "./pages/LoginPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import HistoryPage from "./pages/HistoryPage";
import MyWodsPage from "./pages/MyWodsPage";
import PersonalBestsPage from "./pages/PersonalBestsPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/wods" element={<WodsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/my-wods" element={<MyWodsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/personal-bests" element={<PersonalBestsPage />} />
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default App;
