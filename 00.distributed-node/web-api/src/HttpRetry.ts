export interface HttpRetryResponse {
    status: "DONE" | "FAIL";
    retries: number;
    response: Record<any, any> | null;
    code: number;
}

export default class HttpRetry {
    static maxRetries: number = 3;

    static async fetch(url: string, options: RequestInit = {}): Promise<HttpRetryResponse> {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                const res = await fetch(url, options);
                const response = res.ok ? ((await res.json()) as Record<any, any>) : null;

                return {
                    status: res.ok ? "DONE" : "FAIL",
                    retries,
                    response,
                    code: res.status,
                };
            } catch (err) {
                console.log(err);

                if (err instanceof Error && err.message) {
                    const errorCause = (err as Error & { cause?: any }).cause;
                    if (this.shouldRetry(errorCause.code, options.method || "GET")) {
                        console.log("Retrying...");
                        retries++;
                        continue;
                    } else {
                        return {
                            status: "FAIL",
                            retries,
                            response: null,
                            code: 500,
                        };
                    }
                }
                return {
                    status: "FAIL",
                    retries,
                    response: null,
                    code: 500,
                };
            }
        }
        // Add to queue of failed requests [TODO]
        return {
            status: "FAIL",
            retries,
            response: null,
            code: 500,
        };
    }

    private static isIdempotent(method: string): boolean {
        return ["GET", "HEAD", "PUT", "DELETE", "OPTIONS", "TRACE"].includes(method);
    }

    private static shouldRetry(errCode: string, method: string): boolean {
        switch (errCode) {
            case "EAI_AGAIN":
            case "ECONNREFUSED":
            case "ENOTFOUND":
                return true;
            case "ETIMEDOUT":
            case "ECONNRESET":
            case "EPIPE":
                return this.isIdempotent(method || "GET");
            default:
                return false;
        }
    }
}
