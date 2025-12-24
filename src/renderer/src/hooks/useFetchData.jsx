import { useState, useEffect } from 'react';

export function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;

    if (!url) {
      if (isMounted) {
        setData(null);
        setLoading(false);
        setError(null);
      }
      return;
    }

    async function fetchData() {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      const fullUrl = `${import.meta.env.VITE_BASE_URL}${url}`;
      try {
        const response = await fetch(fullUrl);

        if (!response.ok) {
          let errorDetail = response.statusText;

          throw new Error(`HTTP error! Status: ${response.status} (${errorDetail})`);
        }

        const json = await response.json();

        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An unknown error occurred during fetch.');
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, refetchTrigger]);

  return { data, loading, error, refetch };
}
