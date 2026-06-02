import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export interface GetBannersParams {
  limit?: number;
  page?: number;
  searchTerm?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerPayload {
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateBannerPayload extends Partial<CreateBannerPayload> {}

export const getBanners = async (params?: GetBannersParams) => {
  const response = await api.get(API_ROUTES.ADMIN.BANNERS, { params });
  return response.data;
};

export const getBannerById = async (id: string) => {
  const response = await api.get(`${API_ROUTES.ADMIN.BANNERS}/${id}`);
  return response.data;
};

export const createBanner = async (payload: CreateBannerPayload) => {
  const response = await api.post(API_ROUTES.ADMIN.BANNERS, payload);
  return response.data;
};

export const updateBanner = async (id: string, payload: UpdateBannerPayload) => {
  const response = await api.patch(`${API_ROUTES.ADMIN.BANNERS}/${id}`, payload);
  return response.data;
};

export const deleteBanner = async (id: string) => {
  const response = await api.delete(`${API_ROUTES.ADMIN.BANNERS}/${id}`);
  return response.data;
};
