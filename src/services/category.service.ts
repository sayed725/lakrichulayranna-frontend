import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt: Date;
}

export const getCategories = async () => {
  const response = await api.get(API_ROUTES.ADMIN.CATEGORIES);
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`${API_ROUTES.ADMIN.CATEGORIES}/${id}`);
  return response.data;
};
