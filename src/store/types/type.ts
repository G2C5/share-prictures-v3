export interface TokenInfo {
  exp: number; // 令牌过期时间
  iat: number; // 令牌签发时间
  _id: string; // 用户ID
}
export interface UserInfo {
  username?: string;
  followersNum?: number; // 粉丝数量
  followingNum?: number; // 关注数量
  isaAdmin?: string; // 是否为管理员
  name?: string; // 用户名
  userImg?: string; // 用户头像 URL
  _id?: string; // 用户ID
  uploadCount?: number; // 动态总数
  sign?: string; //用户签名
}