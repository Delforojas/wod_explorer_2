import type { FormEvent } from "react";

export interface RegisterViewProps {
  username: string;
  email: string;
  password: string;

  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;

  error: string | null;
  isSubmitting: boolean;
  isSuccess: boolean;
}
