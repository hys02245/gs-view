'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { defaultModel, ModelConfig, availableModels } from './config/models';
import ModelSelector from './components/ModelSelector';

const GaussianSplatViewer = dynamic(
  () => import('./components/GaussianSplatViewer'),
  { ssr: false }
);

export default function Home() {
  const [currentModel, setCurrentModel] = useState<ModelConfig>(() => {
    // Check if there's an env variable for default model
    const envModelUrl = process.env.NEXT_PUBLIC_GAUSSIAN_MODEL_URL;
    if (envModelUrl) {
      // Find matching model or use default
      const matchingModel = availableModels.find(
        (m: ModelConfig) => m.path === envModelUrl
      );
      return matchingModel || defaultModel;
    }
    return defaultModel;
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleModelChange = (model: ModelConfig) => {
    setIsLoading(true);
    setCurrentModel(model);
    // Loading state will be cleared when the viewer finishes loading
    setTimeout(() => setIsLoading(false), 100);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 bg-gray-900">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 sm:mb-6 md:mb-8">
          41號碼頭倉儲貨物模擬GS
        </h1>
        
        <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-black rounded-lg overflow-hidden shadow-2xl relative">
          <ModelSelector
            currentModel={currentModel}
            onModelChange={handleModelChange}
            disabled={isLoading}
          />
          <GaussianSplatViewer 
            key={currentModel.id} // Force remount when model changes
            modelUrl={currentModel.path}
            className="w-full h-full"
          />
        </div>

      </div>
    </main>
  );
}