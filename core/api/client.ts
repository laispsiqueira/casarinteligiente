
/**
 * Abstração de API para simular backend e persistência local.
 */
class ApiClient {
  async get<T>(key: string): Promise<T | null> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async post<T>(key: string, data: T): Promise<void> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export const apiClient = new ApiClient();
