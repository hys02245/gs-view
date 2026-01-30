'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const GaussianSplatViewer = dynamic(
  () => import('../components/GaussianSplatViewer'),
  { ssr: false }
);

export default function ViewPage() {
  const searchParams = useSearchParams();
  const pathParam = searchParams.get('path');
  const modelParam = searchParams.get('model');

  const modelUrl = useMemo(() => {
    if (modelParam) {
      return modelParam;
    }
    if (pathParam) {
      return `/api/ply?path=${encodeURIComponent(pathParam)}`;
    }
    return '';
  }, [modelParam, pathParam]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 bg-gray-900">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 sm:mb-6 md:mb-8">
          Gaussian Splat Viewer
        </h1>

        <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-black rounded-lg overflow-hidden shadow-2xl">
          {modelUrl ? (
            <GaussianSplatViewer modelUrl={modelUrl} className="w-full h-full" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-300">
              Provide ?path=/abs/path/to/file.ply or ?model=/models/file.ply
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
