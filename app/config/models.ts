export interface ModelConfig {
  id: string;
  name: string;
  path: string;
  description?: string;
}

export const availableModels: ModelConfig[] = [
  {
    id: 'storeroom',
    name: 'Storeroom',
    path: '/models/storeroom.ply',
    description: 'Default storeroom model'
  },
  {
    id: 'point_cloud',
    name: 'Point Cloud',
    path: '/models/point_cloud.ply',
    description: 'Basic point cloud visualization'
  },
  {
    id: 'point_cloud_1',
    name: 'Point Cloud Alternative',
    path: '/models/point_cloud_1.ply',
    description: 'Alternative point cloud dataset'
  },
  {
    id: 'seg_params',
    name: 'Segmentation Parameters',
    path: '/models/seg_params.ply',
    description: 'Segmentation parameters model'
  },
  {
    id: 'sgs_slam_seg_param',
    name: 'SGS SLAM Segmentation',
    path: '/models/sgs_slam_seg_param.ply',
    description: 'SLAM segmentation parameters'
  }
];

export const defaultModel = availableModels[0];