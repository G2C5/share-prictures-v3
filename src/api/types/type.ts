export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  name: string
  username: string
  password: string
  captcha: number
}
export interface PaginationData {
  page: number
  pageSize: number
  userId?: string
}

export interface SearchParams {
  keyword?: string;
  tags?: string[];
  sort_mode?: string;
  sort_state?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchUserParams {
  keyword: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortBy?: string;
}

export interface LevMsgParams {
  imageId: string;
  levmsg: string;
}

export interface UserInfoData {
  name: string;
  sign: string;
}