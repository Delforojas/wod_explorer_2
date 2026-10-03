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
import WodVersionsPage from "./pages/WodVersionsPage";
import WodVersionItemsPage from "./pages/WodVersionItemsPage";
import CreateWodPage from "./pages/CreateWodPage";
import MyExerciseResultsPage from "./pages/MyExerciseResultsPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/wods" element={<WodsPage />} />
        <Route path="/wod-versions" element={<WodVersionsPage />} />
        <Route path="/wod-version-items" element={<WodVersionItemsPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/my-wods" element={<MyWodsPage />} />
          <Route path="/create-wod" element={<CreateWodPage />} />
          <Route path="/history" element={<HistoryPage />} />

          <Route
            path="/my-exercise-results"
            element={<MyExerciseResultsPage />}
          />

          <Route path="/personal-bests" element={<PersonalBestsPage />} />
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default App;
