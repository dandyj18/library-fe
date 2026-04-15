export interface MemberDto {
  id: number;
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemberListParamsDto {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateMemberDto {
  code: string;
  name: string;
}

export interface UpdateMemberDto {
  code?: string;
  name?: string;
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

export interface DeleteMemberResponseDto {
  deleted: boolean;
}
