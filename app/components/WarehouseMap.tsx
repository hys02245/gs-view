'use client';

import { useState } from 'react';
import { MapNode } from '../config/map-models';
import { Package, Box, Archive, Truck, Container } from 'lucide-react';

interface WarehouseMapProps {
  nodes: MapNode[];
  selectedNodeId: string | null;
  onNodeClick: (node: MapNode) => void;
}

// Storage area components with different icons
const storageIcons = {
  'area-1': Package,
  'area-2': Box,
  'area-3': Archive,
  'area-4': Truck,
  'area-5': Container,
};

export default function WarehouseMap({ nodes, selectedNodeId, onNodeClick }: WarehouseMapProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  // Map nodes to storage areas
  const getNodeForArea = (areaId: string) => {
    return nodes.find(n => n.id.includes(areaId.split('-')[1]));
  };

  const handleAreaClick = (areaId: string) => {
    const node = getNodeForArea(areaId);
    if (node) {
      onNodeClick(node);
    }
  };

  const isAreaSelected = (areaId: string) => {
    const node = getNodeForArea(areaId);
    return node && node.id === selectedNodeId;
  };

  const StorageArea = ({ 
    id, 
    x, 
    y, 
    width, 
    height, 
    label,
    items 
  }: { 
    id: string; 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    label: string;
    items?: Array<{x: number; y: number}>;
  }) => {
    const isSelected = isAreaSelected(id);
    const isHovered = hoveredArea === id;
    const node = getNodeForArea(id);
    const Icon = storageIcons[id as keyof typeof storageIcons] || Package;

    return (
      <g
        onClick={() => handleAreaClick(id)}
        onMouseEnter={() => setHoveredArea(id)}
        onMouseLeave={() => setHoveredArea(null)}
        style={{ cursor: 'pointer' }}
      >
        {/* Area border */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isSelected ? '#3B82F6' : isHovered ? '#60A5FA' : 'transparent'}
          fillOpacity={isSelected ? 0.2 : isHovered ? 0.1 : 0}
          stroke={isSelected ? '#3B82F6' : '#EC4899'}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray="10,5"
          rx={8}
        />
        
        {/* Area label */}
        <text
          x={x + width/2}
          y={y + 30}
          fill="#EC4899"
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
        >
          {label}
        </text>

        {/* Storage items */}
        {items?.map((item, idx) => (
          <circle
            key={idx}
            cx={x + item.x}
            cy={y + item.y}
            r="15"
            fill={isSelected ? '#3B82F6' : '#60A5FA'}
            stroke={isSelected ? '#1E40AF' : '#3B82F6'}
            strokeWidth="2"
          />
        ))}

        {/* Icon in center */}
        <g transform={`translate(${x + width/2 - 20}, ${y + height/2 - 20})`}>
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            fill="white"
            rx="8"
            opacity="0.9"
          />
          <foreignObject x="0" y="0" width="40" height="40">
            <div className="flex items-center justify-center w-full h-full">
              <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
          </foreignObject>
        </g>

        {/* Model name */}
        {node && (
          <text
            x={x + width/2}
            y={y + height - 20}
            fill={isSelected ? '#3B82F6' : '#6B7280'}
            fontSize="14"
            textAnchor="middle"
            style={{ userSelect: 'none' }}
          >
            {node.modelConfig.name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden">
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1F2937" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="1000" height="600" fill="url(#grid)" />

        {/* Warehouse title */}
        <text
          x="500"
          y="40"
          fill="#EC4899"
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          倉庫
        </text>

        {/* Main warehouse boundary */}
        <rect
          x="50"
          y="70"
          width="900"
          height="480"
          fill="none"
          stroke="#EC4899"
          strokeWidth="3"
          strokeDasharray="20,10"
          rx={12}
        />

        {/* Storage Area 1 - Top left with vertical items */}
        <StorageArea
          id="area-1"
          x={100}
          y={120}
          width={200}
          height={180}
          label="存1"
          items={[
            {x: 50, y: 60},
            {x: 50, y: 100},
            {x: 50, y: 140},
            {x: 100, y: 60},
            {x: 100, y: 100},
            {x: 100, y: 140},
            {x: 150, y: 60},
            {x: 150, y: 100},
            {x: 150, y: 140},
          ]}
        />

        {/* Storage Area 2 - Top center */}
        <StorageArea
          id="area-2"
          x={400}
          y={120}
          width={200}
          height={150}
          label="存2"
          items={[
            {x: 50, y: 60},
            {x: 100, y: 60},
            {x: 150, y: 60},
            {x: 50, y: 100},
            {x: 100, y: 100},
            {x: 150, y: 100},
          ]}
        />

        {/* Storage Area 3 - Top right */}
        <StorageArea
          id="area-3"
          x={700}
          y={120}
          width={200}
          height={150}
          label="存3"
          items={[
            {x: 60, y: 60},
            {x: 140, y: 60},
            {x: 60, y: 100},
            {x: 140, y: 100},
            {x: 100, y: 80},
          ]}
        />

        {/* Storage Area 4 - Bottom left */}
        <StorageArea
          id="area-4"
          x={100}
          y={350}
          width={200}
          height={150}
          label="存4"
          items={[
            {x: 40, y: 100},
            {x: 80, y: 100},
            {x: 120, y: 100},
            {x: 40, y: 60},
            {x: 80, y: 60},
            {x: 120, y: 60},
            {x: 160, y: 60},
            {x: 160, y: 100},
          ]}
        />

        {/* Storage Area 5 - Bottom center */}
        <StorageArea
          id="area-5"
          x={400}
          y={350}
          width={200}
          height={150}
          label="存5"
          items={[
            {x: 70, y: 50},
            {x: 130, y: 50},
            {x: 50, y: 90},
            {x: 100, y: 90},
            {x: 150, y: 90},
            {x: 70, y: 130},
            {x: 130, y: 130},
          ]}
        />

        {/* Empty area - Bottom right */}
        <rect
          x={700}
          y={350}
          width={200}
          height={150}
          fill="none"
          stroke="#EC4899"
          strokeWidth="2"
          strokeDasharray="10,5"
          rx={8}
          opacity="0.3"
        />

        {/* Pathways/Aisles */}
        <line x1="350" y1="70" x2="350" y2="550" stroke="#F59E0B" strokeWidth="2" opacity="0.5" />
        <line x1="650" y1="70" x2="650" y2="550" stroke="#F59E0B" strokeWidth="2" opacity="0.5" />
        <line x1="50" y1="320" x2="950" y2="320" stroke="#F59E0B" strokeWidth="2" opacity="0.5" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-bold mb-2 text-gray-300">圖例</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">已選擇區域</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-pink-500 rounded-full"></div>
            <span className="text-gray-400">存儲區域</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-yellow-500"></div>
            <span className="text-gray-400">通道</span>
          </div>
        </div>
      </div>

      {/* Selected Area Info */}
      {selectedNodeId && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-300">當前查看</span>
          </div>
          <p className="text-sm font-bold text-white">
            {nodes.find(n => n.id === selectedNodeId)?.locationName}
          </p>
        </div>
      )}
    </div>
  );
}