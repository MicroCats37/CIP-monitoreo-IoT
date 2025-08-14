export function removeLastValueOfUrl(url: string): string {
    return url.replace(/\/last-value\/?$/, '');
}
export function removeHistoricalOfUrl(url: string): string {
    return url.replace(/\/historical\/?$/, '');
}
export function getBasePath(url: string): string {
    return url.replace(/\/[^\/]+$/, "/");
}

// Ejemplo de uso:
// const formattedUrl = removeLastValue('/api/device/bombas-agua/estado/agua-potable/last-value');
// Resultado: '/api/device/bombas-agua/estado/agua-potable'