"use client";

import { TooltipData } from "@/app/page";

interface PixelTooltipProps {
  data: TooltipData;
}

export default function PixelTooltip({ data }: PixelTooltipProps) {
  if (!data.visible) return null;

  // Position tooltip near cursor
  const style = {
    left: `${data.clientX + 15}px`,
    top: `${data.clientY + 15}px`,
  };

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={style}
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border-2 border-white shadow-md"
              style={{ backgroundColor: data.hex }}
            />
            <div>
              <div className="font-mono font-bold">{data.hex.toUpperCase()}</div>
              <div className="text-xs text-gray-300">
                X: {data.x}, Y: {data.y}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-1 text-xs">
            <div className="flex gap-3">
              <span className="text-red-400">R: {data.r}</span>
              <span className="text-green-400">G: {data.g}</span>
              <span className="text-blue-400">B: {data.b}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
