export interface BorrowingMemberDto {
  id: number;
  code: string;
  name: string;
}

export interface BorrowingBookDto {
  id: number;
  code: string;
  title: string;
}

export interface PeminjamanDto {
  id: number;
  member_id: number;
  book_id: number;
  borrow_date: string;
  return_date: string | null;
  due_date: string;
  member?: BorrowingMemberDto;
  book?: BorrowingBookDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface PeminjamanListParamsDto {
  page?: number;
  limit?: number;
}

export interface CreatePeminjamanDto {
  member_id: number;
  book_id: number;
  borrow_date: string;
  return_date?: string | null;
  due_date: string;
}

export interface UpdatePeminjamanDto {
  member_id?: number;
  book_id?: number;
  borrow_date?: string;
  return_date?: string | null;
  due_date?: string;
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

export interface DeletePeminjamanResponseDto {
  deleted: boolean;
}

