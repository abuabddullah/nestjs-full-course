// common/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedData<T> {
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
  result: T[];
}
