let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export async function customFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  let response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            headers.set('Authorization', `Bearer ${token}`);
            resolve(fetch(url, { ...options, headers }));
          },
          reject: (err: any) => {
            reject(err);
          }
        });
      });
    }
    
    isRefreshing = true;
    
    try {
      const refreshCall = await fetch('/api/auth/edge-refresh', { method: 'POST' });
      if (!refreshCall.ok) throw new Error("Auth rotation failure.");
      
      const data = await refreshCall.json();
      const freshToken = data.access_token;
      
      processQueue(null, freshToken);
      
      headers.set('Authorization', `Bearer ${freshToken}`);
      return await fetch(url, { ...options, headers });
    } catch (err) {
      processQueue(err, null);
      if (typeof window !== 'undefined') {
          window.location.href = '/login';
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
  
  return response;
}
