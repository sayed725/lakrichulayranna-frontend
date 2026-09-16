export type UserRole = "ADMIN" | "CUSTOMER" | "MANAGER" | string;
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | string;

export interface UserCount {
  orders?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
  _count?: UserCount;
  orders?: any[];
}

export interface UserFilterState {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
}
