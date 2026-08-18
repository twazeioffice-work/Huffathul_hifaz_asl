import AsyncStorage from '@react-native-async-storage/async-storage';

type FailedRequestQueueItem = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: RequestInit & { url: string };
};

class ApiClient {
  private isRefreshing = false;
  private failedQueue: FailedRequestQueueItem[] = [];
  private baseUrl = 'https://api.suffat-ul-huffaz.org/v1'; // Production backend proxy

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        // Re-attempt the fetch with the new token
        const headers = new Headers(prom.config.headers);
        if (token) headers.set('Authorization', `Bearer ${token}`);
        prom.config.headers = headers;
        this.fetchWithAuth(prom.config.url, prom.config)
            .then(prom.resolve)
            .catch(prom.reject);
      }
    });
    this.failedQueue = [];
  }

  public async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = await AsyncStorage.getItem('@access_token');
    const headers = new Headers(options.headers);
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    
    // Custom dual-header for specific proxy routes
    const xForwardedHost = await AsyncStorage.getItem('@x_tenant_host');
    if (xForwardedHost) headers.set('X-Tenant-Host', xForwardedHost);

    options.headers = headers;
    
    let response = await fetch(`${this.baseUrl}${url}`, options);

    if (response.status === 401) {
      if (this.isRefreshing) {
        return new Promise<Response>((resolve, reject) => {
          this.failedQueue.push({ resolve: resolve as any, reject, config: { ...options, url } });
        });
      }

      this.isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        // Token rotation request
        const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken })
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh token invalid');
        }

        const data = await refreshResponse.json();
        await AsyncStorage.setItem('@access_token', data.accessToken);
        await AsyncStorage.setItem('@refresh_token', data.refreshToken);
        
        this.processQueue(null, data.accessToken);
        
        // Retry original request
        headers.set('Authorization', `Bearer ${data.accessToken}`);
        options.headers = headers;
        response = await fetch(`${this.baseUrl}${url}`, options);
      } catch (err) {
        this.processQueue(err as Error, null);
        // Dispatch logout event here
        await AsyncStorage.multiRemove(['@access_token', '@refresh_token']);
        throw err;
      } finally {
        this.isRefreshing = false;
      }
    }

    return response;
  }
}

export const apiClient = new ApiClient();
