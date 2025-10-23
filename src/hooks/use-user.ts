import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { currentSessionAction, logoutAction } from "@/components/auth/actions";
import { Session, UserSession } from "@/server/auth/utils/session";
import { useRouter } from "next/navigation";

type LogoutAction = () => Promise<void>;
type UseUserResult =
  | {
      state: "authenticated";
      session: Session;
      user: UserSession;
      logout: LogoutAction;
    }
  | {
      state: "unauthenticated";
      session: null;
      user: null;
      logout: LogoutAction;
    }
  | { state: "loading"; session: null; user: null; logout: LogoutAction };

export function useUser(): UseUserResult {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () => currentSessionAction(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const queryClient = useQueryClient();

  // Handle account configuration errors
  if (
    query.error instanceof Error &&
    query.error.message.includes("ACCOUNT_NOT_CONFIGURED")
  ) {
    router.push(`/auth/error?error=${encodeURIComponent(query.error.message)}`);
  }

  const { mutateAsync } = useMutation({
    mutationFn: logoutAction,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["current-user"] });
      queryClient.setQueryData(["current-user"], { session: null, user: null });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["current-user"] }),
  });

  const defaultResult: UseUserResult = {
    state: "unauthenticated",
    session: null,
    user: null,
    logout: mutateAsync,
  };

  if (query.isLoading) {
    return { ...defaultResult, state: "loading" };
  }
  if (query.data?.session) {
    return {
      ...defaultResult,
      state: "authenticated",
      session: query.data.session,
      user: query.data.user,
    };
  }
  return defaultResult;
}
