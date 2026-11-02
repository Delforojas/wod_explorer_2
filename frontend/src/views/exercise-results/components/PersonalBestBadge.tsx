function PersonalBestBadge() {
  return (
    <span
      className="exercise-result-personal-best"
      role="img"
      aria-label="Récord personal"
      title="Récord personal"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm-3 2H3v2a4 4 0 0 0 4 4m10-6h2v2a4 4 0 0 1-4 4m-6 4v3m-3 2h12" />
      </svg>
      <span aria-hidden="true">PR</span>
    </span>
  );
}

export default PersonalBestBadge;
