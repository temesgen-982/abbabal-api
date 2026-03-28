export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface ProfileResponse {
  id: number;
  username: string;
}

export interface CreateApiKeyRequest {
  name: string;
}

export interface CreateApiKeyResponse {
  id: number;
  name: string;
  key: string;
  createdAt: string;
}

export interface ApiKeyListItem {
  id: number;
  name: string;
  isActive: boolean;
  lastUsedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RevokedApiKeyResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Proverb {
  id: number;
  date: string;
  text: string;
  views: number;
  forwards: number;
  englishTranslation?: string | null;
  amharicMeaning?: string | null;
  englishMeaning?: string | null;
  translationSource?: string | null;
  meaningSource?: string | null;
  confidence: number;
  needsReview: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PaginatedProverbs {
  page: number;
  limit: number;
  total: number;
  results: Proverb[];
}

export interface ProverbsListQuery {
  page?: number;
  limit?: number;
}

export interface ProverbsSearchQuery {
  q: string;
  limit?: number;
}
