// 注册信息
export interface RegisterRuleFrom {
  name: string
  username: string
  password: string
  password2: string
  captcha: string
}
// 登录信息
export interface LoginRuleFrom {
  username: string
  password: string
  captcha: string
}
// 图片路径信息
export interface ImageUrl {
  url: string;
  width?: number;
  height?: number;
  _id?: string;
}
// 图片详情
export interface ImageDetail {
  _id: string;
  userId: string;
  imageUrl: ImageUrl[];
  title: string;
  description: string;
  tags: string[];
  like: number;
  collect: number;
  views: number;
  date: string;
  name: string;
  userImg: string;
  followersNum: number;
  followers: string[];
}
// 作者其它推荐图片
export interface OtherImageData {
  _id: string;
  userId: string;
  imageUrl: ImageUrl[];
  title: string;
  description: string;
  tags: string[];
  like: number;
  collect: number;
  views: number;
  date: string;
  __v: number;
}
// 留言详情
export interface LevMsgDetail {
  _id: string;
  userId: string;
  imageId: string;
  levmsg: string;
  like: number;
  date: string;
  name: string;
  userImg: string;
  isLike: number,
  isMyLevMsg: number,
}
// 用户信息
export interface UserInfo {
  _id?: string;
  name?: string;
  userImg?: string;
  followersNum?: number;
  followingNum?: number;
}
// 搜索参数
export interface SearchParams {
  keyword?: string
  tags?: string[]
  sort_mode?: string
  sort_state?: string
  startDate?: string | undefined
  endDate?: string | undefined
  page?: number
  pageSize?: number
}
// 搜索结果数据
export interface SearchImageData {
  _id: string;
  userId: {
    _id: string;
    name: string;
    userImg: string;
  };
  imageUrl: ImageUrl[];
  title: string;
  description: string;
  tags: string[];
  like: number;
  collect: number;
  views: number;
  date: string; // 可以根据需要将其转换为 Date 类型
  __v?: number;
}
// 图片操作记录
export interface PictureRecord {
  isLike: number
  isCollect: number
  isFollowing: boolean
}
// 上传图片
export interface RuleFrom {
  title: string,
  tags: Array<string>,
  description: string
}
// 个人中心：我的动态
export interface MyDynamic {
  _id: string;
  userId: string;
  imageUrl: ImageUrl[];
  title: string;
  description: string;
  tags: string[];
  like: number;
  collect: number;
  views: number;
  date: string;
  topLevMsgs: LevMsgDetail[];
}
// 个人中心：我的图集
export interface MyShareImage {
  _id: string;
  imageUrl: string[];
  title: string;
  description: string;
  tags: string[];
  date: string;
}
// 个人中心：个人信息 MyInfo
export interface MyInfo {
  name?: string;
  sign?: string;
}

export interface FollowersInfo {
  name: string;
  sign: string;
  followersNum: number;
  followingNum: number;
  uploadCount: number;
  userImg: string;
}




