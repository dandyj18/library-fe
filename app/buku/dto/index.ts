export interface BukuDto {
  id: number;
  code: string;
  title: string;
  author: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BukuListParamsDto {
  page?: number;
  limit?: number;
  search?: string;
  filters?: string;
}

export interface CreateBukuDto {
  code: string;
  title: string;
  author: string;
  stock: number;
}

export interface UpdateBukuDto {
  code?: string;
  title?: string;
  author?: string;
  stock?: number;
}

export interface PaginationMetaDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMetaDto;
  errors?: string | string[];
}

export interface DeleteBukuResponseDto {
  deleted: boolean;
}
