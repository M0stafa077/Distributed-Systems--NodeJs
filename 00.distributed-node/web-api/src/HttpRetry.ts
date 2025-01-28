interface HttpRetryResponse {
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
            } catch (err: any) {
                if (["EAI_AGAIN", "ECONNREFUSED", "ENOTFOUND"].includes(err.code)) {
                    retries++;
                    continue;
                } else if (["ETIMEDOUT", "ECONNRESET", "EPIPE"].includes(err.code)) {
                    if (this.isIdempotent(options.method || "GET")) {
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
                } else {
                    return {
                        status: "FAIL",
                        retries,
                        response: null,
                        code: 500,
                    };
                }
            }
        }

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
}
