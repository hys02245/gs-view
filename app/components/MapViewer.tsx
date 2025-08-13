'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MapNode, mapNodes } from '../config/map-models';
import { ChevronLeft, ChevronRight, Map, Maximize2, Home } from 'lucide-react';

// Dynamic imports to avoid SSR issues
const WarehouseMap = dynamic(() => import('./WarehouseMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-800">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">載入倉庫地圖...</p>
      </div>
    </div>
  ),
});

const GaussianSplatViewer = dynamic(() => import('./GaussianSplatViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <p className="text-gray-400">Select a location on the map to view 3D model</p>
    </div>
  ),
});

export default function MapViewer() {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleNodeClick = (node: MapNode) => {
    setSelectedNode(node);
    // On mobile, automatically collapse the map panel when a node is selected
    if (window.innerWidth < 768) {
      setIsPanelCollapsed(true);
    }
  };

  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full h-screen flex bg-gray-900 relative overflow-hidden">
      {/* Left Panel - Map */}
      <div 
        className={`
          ${isPanelCollapsed ? 'w-0 md:w-16' : 'w-full md:w-2/5 lg:w-1/3'}
          transition-all duration-300 ease-in-out
          h-full relative border-r border-gray-700
          ${isPanelCollapsed ? 'overflow-hidden' : ''}
        `}
      >
        {!isPanelCollapsed && (
          <div className="w-full h-full">
            <WarehouseMap
              nodes={mapNodes}
              selectedNodeId={selectedNode?.id || null}
              onNodeClick={handleNodeClick}
            />
          </div>
        )}
        
        {/* Panel Toggle Button */}
        <button
          onClick={togglePanel}
          className="absolute top-1/2 -right-6 transform -translate-y-1/2 translate-x-1/2 z-[1001]
                     bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg
                     transition-all duration-200 hover:scale-110"
          title={isPanelCollapsed ? '顯示倉庫地圖' : '隱藏倉庫地圖'}
        >
          {isPanelCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Right Panel - 3D Viewer */}
      <div className="flex-1 h-full relative bg-black">
        {/* Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPanelCollapsed && (
                <button
                  onClick={togglePanel}
                  className="bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg p-2 
                           transition-all duration-200 hover:scale-105"
                  title="顯示倉庫地圖"
                >
                  <Map className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-white text-lg font-bold">
                  {selectedNode ? selectedNode.locationName : '3D Model Viewer'}
                </h2>
                {selectedNode && (
                  <p className="text-gray-400 text-sm">
                    {selectedNode.modelConfig.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="bg-gray-700/80 hover:bg-gray-600 text-white rounded-lg p-2 
                         transition-all duration-200 hover:scale-105"
                title="Back to Home"
              >
                <Home className="w-5 h-5" />
              </Link>
              <button
                onClick={toggleFullscreen}
                className="bg-gray-700/80 hover:bg-gray-600 text-white rounded-lg p-2 
                         transition-all duration-200 hover:scale-105"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Viewer Content */}
        <div className="w-full h-full">
          {selectedNode ? (
            <GaussianSplatViewer
              key={selectedNode.id}
              modelUrl={selectedNode.modelConfig.path}
              className="w-full h-full"
              showControls={true}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Map className="w-16 h-16 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">未選擇儲存區</h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                點擊倉庫地圖上的儲存區域以載入並查看該區域的3D模型
              </p>
            </div>
          )}
        </div>

        {/* Info Panel */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm z-10">
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-400">位置:</span>
                <p className="text-sm text-white font-semibold">{selectedNode.locationName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">模型:</span>
                <p className="text-sm text-white">{selectedNode.modelConfig.name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">描述:</span>
                <p className="text-sm text-white">
                  {selectedNode.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}