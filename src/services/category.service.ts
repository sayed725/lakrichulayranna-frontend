import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export interface GetCategoriesParams {
  limit?: number;
  page?: number;
  searchTerm?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  _count?: {
    items: number;
  };
}

export interface CreateCategoryPayload {
  name: string;
  imageUrl?: string;
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export const getCategories = async (params?: GetCategoriesParams) => {
  const response = await api.get(API_ROUTES.ADMIN.CATEGORIES, { params });
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`${API_ROUTES.ADMIN.CATEGORIES}/${id}`);
  return response.data;
};

export const createCategory = async (payload: CreateCategoryPayload) => {
  const response = await api.post(API_ROUTES.ADMIN.CATEGORIES, payload);
  return response.data;
};

export const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
  const response = await api.patch(`${API_ROUTES.ADMIN.CATEGORIES}/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`${API_ROUTES.ADMIN.CATEGORIES}/${id}`);
  return response.data;
};
