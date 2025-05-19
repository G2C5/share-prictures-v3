
// 定义存储数据的接口
interface StorageData {
  [key: string]: any;
}

// 封装本地存储工具类
class Local {
  // 将数据存储到本地存储中
  static setItem(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // 从本地存储中获取数据
  static getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

  // 从本地存储中移除数据
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // 清空本地存储
  static clear(): void {
    localStorage.clear();
  }
}

export default Local;
