'use client';

import { ChevronDown } from 'lucide-react';
import { availableModels, ModelConfig } from '../config/models';

interface ModelSelectorProps {
  currentModel: ModelConfig;
  onModelChange: (model: ModelConfig) => void;
  disabled?: boolean;
}

export default function ModelSelector({ currentModel, onModelChange, disabled = false }: ModelSelectorProps) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <label className="block text-xs text-gray-400 mb-2">Select Model</label>
        <div className="relative">
          <select
            value={currentModel.id}
            onChange={(e) => {
              const model = availableModels.find(m => m.id === e.target.value);
              if (model) onModelChange(model);
            }}
            disabled={disabled}
            className="appearance-none bg-gray-700 text-white rounded-md px-3 py-2 pr-8 cursor-pointer hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[200px]"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {currentModel.description && (
          <p className="text-xs text-gray-500 mt-2">{currentModel.description}</p>
        )}
      </div>
    </div>
  );
}