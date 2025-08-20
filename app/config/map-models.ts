import { ModelConfig } from './models';

export interface MapNode {
  id: string;
  coordinates: [number, number]; // [latitude, longitude] - kept for compatibility
  modelConfig: ModelConfig;
  locationName: string;
  icon?: 'warehouse' | 'pointcloud' | 'scan' | 'default';
  description?: string;
}

// Warehouse storage areas with PLY models
export const mapNodes: MapNode[] = [
  {
    id: 'node-area-1',
    coordinates: [0, 0], // Not used in warehouse view
    modelConfig: {
      id: 'storeroom',
      name: '倉庫模型',
      path: '/models/storeroom.ply',
      description: '主要倉庫儲存模型'
    },
    locationName: '儲存區 1 - 主倉庫',
    icon: 'warehouse',
    description: '41號碼頭主要儲存設施'
  },
  {
    id: 'node-area-2',
    coordinates: [0, 0],
    modelConfig: {
      id: 'point_cloud',
      name: '點雲掃描',
      path: '/models/point_cloud.ply',
      description: '基礎點雲視覺化'
    },
    locationName: '儲存區 2 - 掃描數據',
    icon: 'pointcloud',
    description: '港區點雲掃描數據'
  },
  {
    id: 'node-area-3',
    coordinates: [0, 0],
    modelConfig: {
      id: 'point_cloud_1',
      name: '替代點雲',
      path: '/models/point_cloud_1.ply',
      description: '替代點雲數據集'
    },
    locationName: '儲存區 3 - 備用掃描',
    icon: 'pointcloud',
    description: '替代掃描方法結果'
  },
  {
    id: 'node-area-4',
    coordinates: [0, 0],
    modelConfig: {
      id: 'seg_params',
      name: '分割參數',
      path: '/models/seg_params.ply',
      description: '分割參數模型'
    },
    locationName: '儲存區 4 - 分割數據',
    icon: 'scan',
    description: '分割倉庫掃描數據'
  },
  {
    id: 'node-area-5',
    coordinates: [0, 0],
    modelConfig: {
      id: 'sgs_slam_seg_param',
      name: 'SLAM分割',
      path: '/models/sgs_slam_seg_param.ply',
      description: 'SLAM分割參數'
    },
    locationName: '儲存區 5 - SLAM映射',
    icon: 'scan',
    description: 'SLAM生成的3D映射數據'
  }
];

// Default map center (not used in warehouse view)
export const mapConfig = {
  center: [22.3193, 114.1694] as [number, number],
  defaultZoom: 11,
  minZoom: 10,
  maxZoom: 18,
};