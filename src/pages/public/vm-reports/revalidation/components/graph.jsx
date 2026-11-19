"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function EnhancedGauge({
  value = 6.1,
  max = 10,
  label = "Severity Rating",
  size = 200,
  thickness = 12,
  strokeColor = "#3498db",
  textColor = "#ffffff",
}) {
  const [progress, setProgress] = useState(0);
  const center = size / 2;
  const radius = center - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / max) * circumference;

  useEffect(() => {
    setProgress(value);
  }, [value]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#34495e"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="text-2xl font-bold"
          style={{ color: textColor }}
        >
          {value.toFixed(1)}
        </span>
        <span className="text-sm mt-2 text-gray-300">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function Component({ value, isLoading }) {
  const getSeverityDetails = (value) => {
    if ((value >= 9.0 && value <= 10.0) || (value >= 90 && value <= 100)) {
      return {
        label: <p className="font-medium text-[#ff5724]">Critical</p>,
        color: "#e74c3c",
        textColor: "#e74c3c",
      };
    } else if ((value >= 7.0 && value < 9.0) || (value >= 70 && value < 90)) {
      return {
        label: <p className="font-medium text-error">High</p>,
        color: "#ff5724",
        textColor: "#ff5724",
      };
    } else if ((value >= 4.0 && value < 7.0) || (value >= 40 && value < 70)) {
      return {
        label: <p className="font-medium text-warning">Medium</p>,
        color: "#ff9800",
        textColor: "#ff9800",
      };
    } else if ((value >= 0.1 && value < 4.0) || (value >= 10 && value < 40)) {
      return {
        label: <p className="font-medium text-info">Low</p>,
        color: "#0ea5e9",
        textColor: "#0ea5e9",
      };
    } else if (value === 0) {
      return {
        label: <p className="font-medium text-default">Info</p>,
        color: "#d6d9dc",
        textColor: "#d6d9dc",
      };
    }
    return {
      label: "Unknown",
      color: "#d6d9dc",
      textColor: "#d6d9dc",
    };
  };

  const { label, color, textColor } = getSeverityDetails(value);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-5">
        <Skeleton className="w-28 h-28 rounded-full" />
      </div>
    );
  }


  return (
    <div className="px-4 py-2 mb-4">
      <EnhancedGauge
        value={value}
        max={10}
        label={label}
        size={120}
        thickness={8}
        strokeColor={color}
        textColor={textColor}
      />
    </div>
  );
}
