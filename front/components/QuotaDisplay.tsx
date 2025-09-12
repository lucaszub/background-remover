import React from "react";

interface QuotaDisplayProps {
  usage: number;
  limit: number;
  isAuthenticated: boolean;
}

export const QuotaDisplay: React.FC<QuotaDisplayProps> = ({
  usage,
  limit,
  isAuthenticated,
}) => {
  const percent = Math.min(100, Math.round((usage / limit) * 100));
  let color = "bg-green-400";
  if (percent >= 80) color = "bg-red-400";
  else if (percent >= 50) color = "bg-orange-400";

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between text-xs mb-1">
        <span>
          {isAuthenticated ? "Premium" : "Gratuit"}: {usage}/{limit} images
        </span>
        <span className="font-mono">{percent}%</span>
      </div>
      <div className="relative h-2 rounded bg-neutral-200 overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-2 rounded ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      
      <div className="mt-2">
        {!isAuthenticated ? (
          <p className="text-xs text-neutral-400">
            Connectez-vous pour 20 images gratuites
          </p>
        ) : (
          <p className="text-xs text-neutral-400">
            Contactez-moi pour plus de fonctionnalités
          </p>
        )}
      </div>
    </div>
  );
};
