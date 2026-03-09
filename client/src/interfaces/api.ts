export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  status: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ComponentsFilters {
  category?: string;
  minYear?: number;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  socket?: string;
  formFactor?: string;
  memoryType?: string;
  search?: string;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
