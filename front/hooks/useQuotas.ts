import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

export function useQuotas() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quotaMessage, setQuotaMessage] = useState("");

  const fetchQuotas = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/quotas");
      const data = await res.json();
      setUsage(data.usage);
      setLimit(data.limit);
      setQuotaMessage(data.message);
    } catch {
      setQuotaMessage("Erreur récupération quotas");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotas();
  }, [session, fetchQuotas]);

  return {
    usage,
    limit,
    remaining: limit - usage,
    canUpload: usage < limit,
    isLoading,
    refresh: fetchQuotas,
    quotaMessage,
    isAuthenticated: !!session,
  };
}
