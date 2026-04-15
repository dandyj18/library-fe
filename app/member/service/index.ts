import type {
  ApiResponseDto,
  CreateMemberDto,
  DeleteMemberResponseDto,
  MemberDto,
  MemberListParamsDto,
  UpdateMemberDto,
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

export async function getMemberList(
  params: MemberListParamsDto = {}
): Promise<ApiResponseDto<MemberDto[]>> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const response = await fetch(buildUrl(`/members${query ? `?${query}` : ""}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<MemberDto[]>(response);
}

export async function createMember(
  payload: CreateMemberDto
): Promise<ApiResponseDto<MemberDto>> {
  const response = await fetch(buildUrl("/members"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<MemberDto>(response);
}

export async function updateMember(
  id: number,
  payload: UpdateMemberDto
): Promise<ApiResponseDto<MemberDto>> {
  const response = await fetch(buildUrl(`/members/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<MemberDto>(response);
}

export async function deleteMember(
  id: number
): Promise<ApiResponseDto<DeleteMemberResponseDto>> {
  const response = await fetch(buildUrl(`/members/${id}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<DeleteMemberResponseDto>(response);
}
