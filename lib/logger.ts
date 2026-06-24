type LogMeta = Record<string, unknown>;

function formatError(error: unknown) {
    if (error instanceof Error) {
        const mongoError = error as Error & {
            code?: number;
            keyPattern?: Record<string, number>;
        };

        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...(mongoError.code !== undefined
                ? { code: mongoError.code, keyPattern: mongoError.keyPattern }
                : {}),
        };
    }

    return { raw: error };
}

export const logger = {
    error(context: string, error: unknown, meta?: LogMeta) {
        console.error(`[ERROR] ${context}`, {
            ...formatError(error),
            ...meta,
        });
    },

    activity(context: string, meta?: LogMeta) {
        console.log(`[ACTIVITY] ${context}`, meta ?? {});
    },
};
