import { type CSSProperties } from 'vue';

// 瀑布流虚拟列表props参数
export interface IVirtualWaterFallProps {
  column?: number; // 列数
  columnItemCount?: number; // 单列中容纳最小项数
  requestSize?: number; // 请求页数|数据量
  gap?: number; // 图片与图片之间的间距
  time?: string;
  request?: FsVirtualWaterFallReuqest; // 图片数据请求
}

// 一列数据表示一个数组，多列使用二维数据存储
export interface IColumnQueue {
  list: Array<IRenderItem>;
  height: number;
}
// 渲染计算的图片宽高
export interface IItemRect {
  width: number;
  height: number;
}
// 渲染视图项
export interface IRenderItem {
  item: IDataItem;
  y: number;
  h: number;
  style: CSSProperties;
}

// 数据源项类型：固定宽高
export interface IDataItem {
  id: number | string;
  width: number;
  height: number;
  [key: string]: any;
}

// 数据请求
export type FsVirtualWaterFallReuqest = (
  page: number,
  pageSize: number,
  time?: string
) => Promise<{
  total: number;
  list: IDataItem[];
}>;