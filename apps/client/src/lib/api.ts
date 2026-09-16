let currentAccessToken: string | null = null;

export function setApiAccessToken(token: string | null) {
  currentAccessToken = token;
}

export function getApiAccessToken(): string | null {
  return currentAccessToken;
}

interface RequestOptions extends RequestInit {
  data?: any;
}

function getCleanServerUrl(): string {
  const envUrl = import.meta.env.VITE_SERVER_URL;
  if (typeof envUrl === 'string' && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl.replace(/\/+$/, '');
  }
  return import.meta.env.PROD ? 'https://zync-server-zt02.onrender.com' : '';
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const serverBaseUrl = getCleanServerUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${serverBaseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (currentAccessToken) {
    headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // needed to send httpOnly refresh cookie
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  let response = await fetch(url, config);

  // If 401 and not an auth attempt, try refreshing the token once
  if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
    try {
      const refreshRes = await fetch(`${serverBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.data?.accessToken) {
          setApiAccessToken(refreshData.data.accessToken);
          headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
          // Retry original request
          response = await fetch(url, { ...config, headers });
        }
      }
    } catch {
      // Refresh failed, continue with original 401
    }
  }

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = resData.error || (resData.details ? resData.details[0]?.message : `Request failed with status ${response.status}`);
    throw new Error(message);
  }

  return resData;
}
