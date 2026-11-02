export interface SubmissionGuard {
  tryAcquire: () => boolean;
  release: () => void;
}

export function createSubmissionGuard(): SubmissionGuard {
  let locked = false;

  return {
    tryAcquire() {
      if (locked) {
        return false;
      }

      locked = true;
      return true;
    },
    release() {
      locked = false;
    },
  };
}
