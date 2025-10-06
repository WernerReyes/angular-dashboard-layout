export interface ResourceState<T> {
    value(): T | undefined;
    isLoading(): boolean;
    error(): any;
    reload(): void;
    hasValue(): boolean;
}
