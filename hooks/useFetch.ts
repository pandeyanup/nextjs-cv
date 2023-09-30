import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";

type UseFetchResponse<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

function useFetch<T>(url: string): UseFetchResponse<T> {
  const { toast } = useToast();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      axios
        .get(url)
        .then((res) => {
          setData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err instanceof AxiosError) {
            toast({
              title: "Error",
              description: err.message,
              variant: "destructive",
            });
            setError(err.message);
            setIsLoading(false);
          } else {
            toast({
              title: "Timeout",
              description: "Try again later.",
              variant: "destructive",
            });
            setError("Try again later.");
            setIsLoading(false);
          }
        });
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isLoading, error };
}

export default useFetch;
