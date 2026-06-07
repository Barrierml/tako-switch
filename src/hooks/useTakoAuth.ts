import { useQuery, useQueryClient } from "@tanstack/react-query";
import { takoCurrentIdentity, type TakoIdentity } from "@/lib/api/tako";

const QUERY_KEY = ["tako-identity"];

/**
 * Tako 登录态：从 Tako provider 的 cr_ key 派生（后端 tako_current_identity）。
 * 网络失败时后端降级为 offline=true 仍算已登录，避免抖动登出。
 */
export function useTakoAuth() {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery<TakoIdentity>({
    queryKey: QUERY_KEY,
    queryFn: takoCurrentIdentity,
    staleTime: 60_000,
    retry: false,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  return {
    loggedIn: data?.logged_in ?? false,
    name: data?.name ?? null,
    plan: data?.plan ?? null,
    offline: data?.offline ?? false,
    loading: isLoading,
    refetch,
    invalidate,
  };
}
