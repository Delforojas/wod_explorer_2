import HomeView from "../views/home/HomeView";
import { useHome } from "../views/home/useHome";

function HomePage() {
  const {
    isAuthenticated,
    username,
    activityStatus,
    activityResults,
    activityError,
    onRetry,
    featuredStatus,
    featuredWods,
    featuredError,
    onRetryFeatured,
  } = useHome();

  return (
    <HomeView
      isAuthenticated={isAuthenticated}
      username={username}
      activityStatus={activityStatus}
      activityResults={activityResults}
      activityError={activityError}
      onRetry={onRetry}
      featuredStatus={featuredStatus}
      featuredWods={featuredWods}
      featuredError={featuredError}
      onRetryFeatured={onRetryFeatured}
    />
  );
}

export default HomePage;
