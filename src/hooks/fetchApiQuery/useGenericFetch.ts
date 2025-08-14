import { fetchApi } from "@/utils/api/axios";
import {
  useQuery,
  UseQueryOptions,
  QueryKey,
  UseQueryResult,
} from "@tanstack/react-query";
import { z } from "zod"; // Asegúrate de tener Zod instalado y tipado
; // Importa tu utilidad fetchApi

/**
 * Un hook genérico que combina React Query con la utilidad fetchApi.
 * Permite definir la URL, los parámetros de consulta y el esquema para validar los datos.
 *
 * @template TData El tipo de dato esperado de la función de consulta (inferido del esquema).
 * @template TSchema El tipo del esquema Zod utilizado para validar los datos.
 * @template TQueryParams El tipo de los parámetros de consulta.
 * @template TError El tipo de error esperado.
 * @template TQueryKey El tipo de la clave de consulta.
 * @param {TQueryKey} queryKey La clave de consulta para React Query.
 * @param {string} url La URL de la API a la que se va a llamar.
 * @param {TSchema} schema El esquema Zod para validar la respuesta.
 * @param {TQueryParams} [queryParams] Parámetros de consulta opcionales para la URL.
 * @param {UseQueryOptions<TData, TError, TData, TQueryKey>} [options] Opciones opcionales de React Query.
 * @returns {UseQueryResult<TData, TError>} El resultado completo del hook useQuery.
 */
export const useGenericApiQuery = <
  TSchema extends z.ZodTypeAny, // Esquema Zod
  TData = z.infer<TSchema>, // TData se infiere del esquema
  TQueryParams extends Record<string, any> = Record<string, any>,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  url: string,
  schema: TSchema,
  queryParams?: TQueryParams,
  options?: UseQueryOptions<TData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> => {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey,
    queryFn: () =>
      fetchApi({
        url,
        queryParams,
        schema,
      }),
    ...options,
  });
};