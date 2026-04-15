import type {
  ApiResponseDto,
  CreatePeminjamanDto,
  DeletePeminjamanResponseDto,
  PeminjamanDto,
  PeminjamanListParamsDto,
  UpdatePeminjamanDto,
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

export async function getPeminjamanList(
  params: PeminjamanListParamsDto = {}
): Promise<ApiResponseDto<PeminjamanDto[]>> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const response = await fetch(
    buildUrl(`/borrowings${query ? `?${query}` : ""}`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  return handleResponse<PeminjamanDto[]>(response);
}

export async function createPeminjaman(
  payload: CreatePeminjamanDto
): Promise<ApiResponseDto<PeminjamanDto>> {
  const response = await fetch(buildUrl("/borrowings"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<PeminjamanDto>(response);
}

export async function updatePeminjaman(
  id: number,
  payload: UpdatePeminjamanDto
): Promise<ApiResponseDto<PeminjamanDto>> {
  const response = await fetch(buildUrl(`/borrowings/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<PeminjamanDto>(response);
}

export async function deletePeminjaman(
  id: number
): Promise<ApiResponseDto<DeletePeminjamanResponseDto>> {
  const response = await fetch(buildUrl(`/borrowings/${id}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<DeletePeminjamanResponseDto>(response);
}

