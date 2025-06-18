import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { currentSessionAction, logoutAction } from "./actions";
import { Session, UserSession } from "@/server/auth/utils/session";

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
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () => currentSessionAction(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const queryClient = useQueryClient();

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
