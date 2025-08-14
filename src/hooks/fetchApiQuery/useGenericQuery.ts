import {
    useQuery,
    UseQueryOptions,
    QueryKey,
    UseQueryResult, // Importa este tipo para tipar el retorno correctamente
} from "@tanstack/react-query";

/**
 * Un hook genérico de React Query para obtener datos, que devuelve todas las propiedades de useQuery.
 *
 * @template TData El tipo de dato esperado de la función de consulta.
 * @template TError El tipo de error esperado de la función de consulta.
 * @template TQueryKey El tipo de la clave de consulta.
 * @param {TQueryKey} queryKey La clave de consulta para React Query.
 * @param {() => Promise<TData>} queryFn La función que obtiene los datos.
 * @param {UseQueryOptions<TData, TError, TData, TQueryKey>} [options] Opciones opcionales de React Query.
 * @returns {UseQueryResult<TData, TError>} El resultado completo del hook useQuery.
 */
export const useGenericQuery = <
    TData,
    TError = Error,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    queryFn: () => Promise<TData>,
    options?: UseQueryOptions<TData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> => {
    return useQuery<TData, TError, TData, TQueryKey>({
        queryKey,
        queryFn,
        ...options, // Extiende cualquier opción adicional pasada
    });
};