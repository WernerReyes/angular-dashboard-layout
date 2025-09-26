export interface ApiResponse<T> {
    readonly data: T;
    readonly message: string;
    readonly success: boolean;
    readonly timestamp: string;
}