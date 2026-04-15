import type {
  ApiResponseDto,
  BukuDto,
  BukuListParamsDto,
  CreateBukuDto,
  DeleteBukuResponseDto,
  UpdateBukuDto,
} from "../dto";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  return `${API_BASE_URL}${path}`;
}

async function handleResponse<T>(response: Response): Promise<ApiResponseDto<T>> {
  const payload = (await response.json()) as ApiResponseDto<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export async function getBukuList(
  params: BukuListParamsDto = {}
): Promise<ApiResponseDto<BukuDto[]>> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.filters) {
    searchParams.set("filters", params.filters);
  }

  const query = searchParams.toString();
  const response = await fetch(buildUrl(`/books${query ? `?${query}` : ""}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<BukuDto[]>(response);
}

export async function createBuku(
  payload: CreateBukuDto
): Promise<ApiResponseDto<BukuDto>> {
  const response = await fetch(buildUrl("/books"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<BukuDto>(response);
}

export async function updateBuku(
  id: number,
  payload: UpdateBukuDto
): Promise<ApiResponseDto<BukuDto>> {
  const response = await fetch(buildUrl(`/books/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<BukuDto>(response);
}

export async function deleteBuku(
  id: number
): Promise<ApiResponseDto<DeleteBukuResponseDto>> {
  const response = await fetch(buildUrl(`/books/${id}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<DeleteBukuResponseDto>(response);
}
