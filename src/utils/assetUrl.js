const configuredBaseUrl = import.meta.env?.BASE_URL || '/'

export function assetUrl(path, baseUrl = configuredBaseUrl) {
  const base = typeof baseUrl === 'string' ? baseUrl : configuredBaseUrl
  return path?.startsWith('/assets/') ? `${base}${path.slice(1)}` : path
}
