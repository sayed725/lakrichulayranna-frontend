import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export interface GetItemsParams {
  limit?: number;
  page?: number;
  searchTerm?: string;
  categoryId?: string;
  "category.name"?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isBestSelling?: boolean;
  isCategoryFeatured?: boolean;
  isNew?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Item {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  images: string[];
  categoryId: string;
  isSpicy?: boolean;
  weight?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSelling?: boolean;
  isCategoryFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
  createdAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateItemPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  images: string[];
  categoryId: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isBestSelling?: boolean;
  isCategoryFeatured?: boolean;
  isNew?: boolean;
  isSpicy?: boolean;
  weight?: string;
  tags?: string[];
}

export interface UpdateItemPayload extends Partial<CreateItemPayload> {}

export const getItems = async (params?: GetItemsParams) => {
  const response = await api.get(API_ROUTES.ADMIN.ITEMS, { params });
  return response.data;
};

export const getItemById = async (id: string) => {
  const response = await api.get(`${API_ROUTES.ADMIN.ITEMS}/${id}`);
  return response.data;
};

export const createItem = async (payload: CreateItemPayload) => {
  const response = await api.post(API_ROUTES.ADMIN.ITEMS, payload);
  return response.data;
};

export const updateItem = async (id: string, payload: UpdateItemPayload) => {
  const response = await api.patch(`${API_ROUTES.ADMIN.ITEMS}/${id}`, payload);
  return response.data;
};

export const deleteItem = async (id: string) => {
  const response = await api.delete(`${API_ROUTES.ADMIN.ITEMS}/${id}`);
  return response.data;
};
