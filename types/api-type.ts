export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
    statusCode?: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
