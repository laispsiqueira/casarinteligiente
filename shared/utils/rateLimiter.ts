
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestCount = 0;
  private windowStart = Date.now();

  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();

      if (now - this.windowStart > this.windowMs) {
        this.requestCount = 0;
        this.windowStart = now;
      }

      if (this.requestCount >= this.maxRequests) {
        const waitTime = this.windowMs - (now - this.windowStart);
        console.warn(`⏳ Rate limit atingido. Aguardando ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.windowStart = Date.now();
      }

      const task = this.queue.shift();
      if (task) {
        this.requestCount++;
        await task();
      }
    }

    this.processing = false;
  }
}

export const geminiRateLimiter = new RateLimiter(15, 60000);
