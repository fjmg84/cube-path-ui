import { useApiKeyStore } from "@/store/useApiKeyStore";
import { useEffect, useState } from "react";

function useFetch<T>(url: string, refresh?: boolean) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const { apiKey } = useApiKeyStore();

  useEffect(() => {
    if (!apiKey) {
      setData(null);
      setLoading(false);
      setError(null);

      if (refresh) {
        setRefreshing(false);
      }
      return;
    }

    let isMounted = true;

    const fetchProjects = async (isBackgroundRefresh = false) => {
      setError(null);

      if (isBackgroundRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            response.statusText || "No se pudieron cargar los proyectos",
          );
        }

        const resp = await response.json();

        if (!isMounted) return;

        setData(resp as T);
        if (refresh) {
          setLastUpdated(Date.now());
        }
      } catch (caughtError) {
        console.error(`Error fetching url: ${url}`, caughtError);
        if (!isMounted) return;
        setError("No se pudieron cargar los proyectos.");
      } finally {
        if (isMounted) setLoading(false);

        setRefreshing(false);
      }
    };

    fetchProjects();
    const intervalId = refresh
      ? window.setInterval(() => {
          void fetchProjects(true);
        }, 5000)
      : null;

    return () => {
      isMounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [apiKey, url]);

  return {
    loading,
    error,
    data,
    apiKey,
    refreshing,
    lastUpdated,
  };
}

export default useFetch;
