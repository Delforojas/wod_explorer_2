import { useEffect, useState } from "react";

import { getWodResults } from "../api/wodsResultsApi";
import { useAuth } from "../auth/useAuth";
import type { WodResultResponse } from "../types/WodResult";
import HomeView from "../views/home/HomeView";
import { getRecentWodResults } from "../views/home/homePresentation";

type HomeActivityState = {
  requestKey: string | null;
  status: "idle" | "loading" | "success" | "error";
  results: WodResultResponse[];
  error: string | null;
};

const initialActivityState: HomeActivityState = {
  requestKey: null,
  status: "idle",
  results: [],
  error: null,
};

function HomePage() {
  const { isAuthenticated, username } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [activity, setActivity] = useState<HomeActivityState>(
    initialActivityState,
  );
  const sessionKey = isAuthenticated ? username ?? "authenticated" : null;
  const requestKey = isAuthenticated ? `${sessionKey}:${retryCount}` : null;

  useEffect(() => {
    let active = true;

    if (!isAuthenticated) {
      return () => {
        active = false;
      };
    }

    getWodResults()
      .then((results) => {
        if (!active) {
          return;
        }

        setActivity({
          requestKey,
          status: "success",
          results: getRecentWodResults(results),
          error: null,
        });
      })
      .catch((cause) => {
        if (!active) {
          return;
        }

        setActivity({
          requestKey,
          status: "error",
          results: [],
          error:
            cause instanceof Error && cause.message
              ? cause.message
              : "No se pudo cargar tu actividad reciente.",
        });
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, requestKey]);

  const activityMatchesRequest = activity.requestKey === requestKey;

  return (
    <HomeView
      isAuthenticated={isAuthenticated}
      username={username}
      activityStatus={
        isAuthenticated
          ? activityMatchesRequest
            ? activity.status
            : "loading"
          : "idle"
      }
      activityResults={activityMatchesRequest ? activity.results : []}
      activityError={activityMatchesRequest ? activity.error : null}
      onRetry={() => setRetryCount((current) => current + 1)}
    />
  );
}

export default HomePage;
