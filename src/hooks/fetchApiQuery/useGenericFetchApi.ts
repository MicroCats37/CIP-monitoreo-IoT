import { fetchApi } from '@/utils/api/axios';
import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from '@tanstack/react-query';
import { z } from 'zod';

type UseApiOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
>;

interface UseApiHookProps<T> {
  url?: string;
  queryParams?: Record<string, string | number | boolean>;
  schema: z.ZodSchema<T>;
  queryKey?: QueryKey;
  apiOptions?: UseApiOptions<T, Error>;
}

export const useGenericFetchApi = <T>({
  url,
  queryParams,
  schema,
  queryKey = [url, queryParams],
  apiOptions = {},
}: UseApiHookProps<T>): UseQueryResult<T, Error> => {

  const isEnabled = !!url;

  return useQuery<T, Error>({
    queryKey,
    queryFn: () => {
      if (!url) {
        // Esta línea no debería ejecutarse gracias a `enabled`
        return Promise.reject(new Error('URL is undefined'));
      }
      return fetchApi<T>({ url, queryParams, schema });
    },
    enabled: isEnabled,
    ...apiOptions,
  });
};