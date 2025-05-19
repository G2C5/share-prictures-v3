// 定义会话存储工具类
class Session {
  // 将数据存储到会话存储中
  static setItem(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  // 从会话存储中获取数据
  static getItem<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

  // 从会话存储中移除数据
  static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // 清空会话存储
  static clear(): void {
    sessionStorage.clear();
  }
}

export default Session;