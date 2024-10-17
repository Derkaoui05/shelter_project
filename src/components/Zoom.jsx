import { Minus, Plus, ZoomIn } from 'lucide-react';
import React from 'react';

export const Zoom = ({ zoom, onZoomIn, onZoomOut }) => {
  return (
    <div className="flex items-center justify-center">
      <span className="bg-gray-300 opacity-35 cursor-pointer" onClick={onZoomOut}>
        <Minus />
      </span>
      <span className="bg-gray-100 opacity-50">
        <ZoomIn />
      </span>
      <span className="bg-gray-300 opacity-35 cursor-pointer" onClick={onZoomIn}>
        <Plus />
      </span>
    </div>
  );
};
