import { useEffect, useState } from "react";

import { getWodResults } from "../../api/wodsResultsApi";
import { getWods } from "../../api/wodsApi";
import { useAuth } from "../../auth/useAuth";
import type { WodResultResponse } from "../../types/WodResult";
import type { WodAggregateResponse } from "../../types/Wod";
import {
  getFeaturedWods,
  getRecentWodResults,
} from "../home/homePresentation";

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

type HomeFeaturedState = {
  requestKey: number | null;
  status: "loading" | "success" | "error";
  wods: WodAggregateResponse[];
  error: string | null;
};

const initialFeaturedState: HomeFeaturedState = {
  requestKey: null,
  status: "loading",
  wods: [],
  error: null,
};

export function useHome() {
  const { isAuthenticated, username } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [activity, setActivity] = useState<HomeActivityState>(
    initialActivityState,
  );
  const [featuredRetryCount, setFeaturedRetryCount] = useState(0);
  const [featured, setFeatured] = useState<HomeFeaturedState>(
    initialFeaturedState,
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

  useEffect(() => {
    let active = true;

    if (isAuthenticated) {
      return () => {
        active = false;
      };
    }

    getWods()
      .then((wods) => {
        if (active) {
          setFeatured({
            requestKey: featuredRetryCount,
            status: "success",
            wods: getFeaturedWods(wods),
            error: null,
          });
        }
      })
      .catch((cause) => {
        if (active) {
          setFeatured({
            requestKey: featuredRetryCount,
            status: "error",
            wods: [],
            error:
              cause instanceof Error && cause.message
                ? cause.message
                : "No se pudieron cargar los WODs destacados.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [featuredRetryCount, isAuthenticated]);

  const activityMatchesRequest = activity.requestKey === requestKey;

  return {
    isAuthenticated,
    username,
    activityStatus:
      isAuthenticated
        ? activityMatchesRequest
          ? activity.status
          : "loading"
        : "idle",
    activityResults: activityMatchesRequest ? activity.results : [],
    activityError: activityMatchesRequest ? activity.error : null,
    onRetry: () => setRetryCount((current) => current + 1),
    featuredStatus:
      featured.requestKey === featuredRetryCount
        ? featured.status
        : "loading",
    featuredWods: featured.requestKey === featuredRetryCount ? featured.wods : [],
    featuredError: featured.requestKey === featuredRetryCount ? featured.error : null,
    onRetryFeatured: () => setFeaturedRetryCount((current) => current + 1),
  };
}
