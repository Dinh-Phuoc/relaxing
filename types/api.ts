export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    error?: {
        code: string;
        message: string;
        statusCode: number;
    };
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}
