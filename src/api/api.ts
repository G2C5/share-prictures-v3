import request from './axios'
import type { LoginData, RegisterData, SearchParams, PaginationData, LevMsgParams, UserInfoData } from './types/type'


// 用户
export const login = (data: LoginData) =>
  request({ url: '/api/login', method: 'post', data }) // 思路
export const register = (data: RegisterData) =>
  request({ url: '/api/register', method: 'post', data }) // 注册
export const getMyInfo = () =>
  request({ url: '/api/userInfo', method: 'get' }) // 获取用户信息
export const reqsvgCode = (timestamp = Date.now()) =>
  request({ url: `/api/captcha?timestamp=${timestamp}`, method: 'get' }) // 验证码
export const following = (userId: string) =>
  request({ url: `/api/follow/${userId}`, method: 'post' })// 关注用户
export const unfollowing = (userId: string) =>
  request({ url: `/api/unfollow/${userId}`, method: 'post' })// 取消关注
export const isfollowing = (data: { userId: string, authorId: string }) =>
  request({ url: `/api/isfollow/${data.authorId}`, method: 'get' })// 验证关注状态
export const userIsLogin = () =>
  request({ url: '/api/islogin', method: 'get' })// 验证登录状态
export const isRecordPicture = (imageId: string) =>
  request({ url: `/api/isRecord/${imageId}` }) // 验证图片状态


/* 
  图片展示 
*/
export const getWeeklyHotShareImage = (data: PaginationData) =>
  request({ url: '/api/show/week-popular-views', method: 'get', params: data })// 本周热门
export const getMonthlyHotShareImage = (data: PaginationData) =>
  request({ url: '/api/show/month-popular-views', method: 'get', params: data }) // 本月热门
export const greatestHistory = (data: PaginationData) => request({ url: '/api/show/greatest-history', method: 'get', params: data }) // 本站热门
export const latestSharing = (data: PaginationData) => request({ url: '/api/show/latest-sharing', method: 'get', params: data }) //  最新
export const siteRecommended = () => request({ url: '/api/show/site-recommended', method: 'get' })// 站点推荐

/*
  图片
*/
// 用户上传图片
export const uploadShareImage = (formData: FormData) => request({
  url: '/api/shareImages/upload', method: 'post', headers: {
    'Content-Type': 'multipart/form-data'
  }, data: formData
})
// 用户获取自己上传的图片
export const shareImageList = () =>
  request({ url: '/api/shareImages/list', method: 'post' })
// 用户删除图片
export const delShareImage = (imageId: string) =>
  request({ url: `/api/shareImages/delete/${imageId}`, method: 'delete' })
// 查看图片详情
export const getImageDetail = (imageId: string) =>
  request({ url: `/api/shareImages/detail/${imageId}`, method: 'get' })
// 图片详情推荐的其它图片
export const getOtherImage = (data: { imageId: string, userId: string }) =>
  request({
    url: `/api/shareImages/other`, method: 'get',
    params: { userId: data.userId, imageId: data.imageId }
  })
// 记录图片查看次数
export const watchRecord = (imageId: string) =>
  request({ url: `/api/watchrecord/record/${imageId}`, method: 'post' })
// 点赞图片
export const likeShareImage = (imageId: string) =>
  request({ url: `/api/shareImages/like/${imageId}`, method: 'post' })
// 收藏图片
export const collectShareImage = (imageId: string) =>
  request({ url: `/api/shareImages/collect/${imageId}`, method: 'post' })
// 用户查看收藏的图片
export const myCollectShareImage = () =>
  request({ url: '/api/shareImages/', method: 'get' })

/* 
  图片留言
*/
// 用户添加图片留言
export const addLevMsg = (data: LevMsgParams) => request({ url: '/api/levmsg/add', method: 'post', data })
// 查看图片留言
export const viewLevMsg = (data: { imageId: string, page?: number, pageSize?: number }) =>
  request({
    url: `/api/levmsg/view/${data.imageId}`, method: 'get',
    params: { page: data.page, pageSize: data.pageSize }
  })
// 用户删除留言
export const delLevMsg = (levMsgId: string) =>
  request({ url: `/api/levmsg/delete/${levMsgId}`, method: 'delete' })
// 留言点赞
export const likeLevMsg = (levMsgId: string) =>
  request({ url: `/api/levmsg/like/${levMsgId}`, method: 'post' })
// 用户获取历史所有留言
export const myLevMsg = (page?: number, pageSize?: string, sortBy?: string, sort?: string) =>
  request({
    url: '/api/levmsg/user/all',
    method: 'get',
    params: { page, pageSize, sortBy, sort }
  })

/* 
  搜索
*/
// 按标题|标签搜素图片
export const searchShareImage = (data: SearchParams) =>
  request({
    url: '/api/search/image',
    method: 'get',
    params: { ...data }
  })

// 搜索用户 // sortBy:followersCount or regDate
export const searchUserByNmae = (keyword: string, page?: number, pageSize?: number, sort?: string, sortBy?: string) => request({
  url: '/api/search/user',
  params: { keyword, page, pageSize, sort, sortBy }
})

/* 个人中心 */
// 个人动态
export const getMyDynamic = (data: PaginationData) => request({ url: '/api/center/my-dynamic', method: 'get', params: data })

// 作者动态
export const getAuthorDynamic = (data: PaginationData) => request({ url: '/api/center/autohr-dynamic', method: 'get', params: data })
// 我的图集
export const getMyShareImage = (data: PaginationData) => request({ url: '/api/center/all-share', method: 'get', params: data })

// 更改头像
export const uploadAvatar = (avatar: FormData) => request({
  url: "api/upload/avatar",
  headers: { 'Content-Type': 'multipart/form-data' },
  data: avatar,
  method: 'post'
})

// 更新个人信息
export const updateUserInfo = (data: UserInfoData) => request({
  url: '/api/update/user-info',
  data,
  method: 'post'
})

// 我的收藏
export const getUserCollect = (data: PaginationData) => request({
  url: '/api/center/collect',
  method: 'get',
  params: data
})

// 我的关注
export const getUserFollowing = (data: PaginationData) => request({
  url: '/api/center/following',
  method: 'get',
  params: data
})

// 我的粉丝
export const getUserFollower = (data: PaginationData) => request({
  url: '/api/center/follower',
  method: 'get',
  params: data
})

// 用户信息
export const getUserInfo = (data: string) => request({
  url: '/api/center/userinfo',
  method: 'get',
  params: data
})


