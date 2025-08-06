import { QueryCache, QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import { notifications } from "@mantine/notifications";

// Default configuration for all queries
const defaultQueryOptions = {
  retry: 2,
  gcTime: 1000 * 60 * 10, // 10 minutes
  staleTime: 1000 * 60 * 5, // 5 minutes
};

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: defaultQueryOptions,
      },
      queryCache: new QueryCache({
        onError: (error) => {
          // Only show notification in browser environment
          if (typeof window !== "undefined") {
            notifications.show({
              title: "Error",
              message:
                error instanceof Error ?
                  error.message
                : "An error occurred while fetching data",
              color: "red",
            });
          }
        },
      }),
    })
);

export default getQueryClient;
