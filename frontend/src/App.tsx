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
import RegisterExerciseResultPage from "./pages/RegisterExerciseResultPage";

import MyWodResultsPage from "./pages/MyWodResultsPage";
import RegisterWodResultPage from "./pages/RegisterWodResultPage";

import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AppLayout>

      <Routes>
        {/* Páginas públicas */}

        <Route path="/" element={<HomePage />} />

        <Route path="/exercises" element={<ExercisesPage />} />

        <Route path="/wods" element={<WodsPage />} />

        <Route path="/wod-versions" element={<WodVersionsPage />} />

        <Route path="/wod-version-items" element={<WodVersionItemsPage />} />

        {/* Autenticación */}

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        {/* Rutas privadas */}

        <Route element={<RequireAuth />}>
          {/* Gestión de WODs personales */}

          <Route path="/my-wods" element={<MyWodsPage />} />

          <Route path="/create-wod" element={<CreateWodPage />} />

          {/* Resultados de WODs */}

          <Route path="/my-wod-results" element={<MyWodResultsPage />} />

          {/* Registrar resultado de WOD */}

          <Route
            path="/my-wod-results/new"
            element={<RegisterWodResultPage />}
          />

          {/* Historial */}

          <Route path="/history" element={<HistoryPage />} />

          {/* Resultados de ejercicios */}

          <Route
            path="/exercise-results/new"
            element={<RegisterExerciseResultPage />}
          />

          <Route
            path="/my-exercise-results"
            element={<MyExerciseResultsPage />}
          />

          {/* Mejores marcas */}

          <Route path="/personal-bests" element={<PersonalBestsPage />} />
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default App;
