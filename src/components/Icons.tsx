import React from "react";

/** Simple line icons drawn in code (no image files needed). */
type IconProps = { size?: number; color: string; strokeWidth?: number };

export const CheckIcon: React.FC<IconProps> = ({ size = 48, color, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="21" stroke={color} strokeWidth={strokeWidth} />
    <path d="M15 24.5l6 6 12-13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowIcon: React.FC<IconProps> = ({ size = 48, color, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M8 24h30M28 13l11 11-11 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CrossIcon: React.FC<IconProps> = ({ size = 48, color, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="21" stroke={color} strokeWidth={strokeWidth} />
    <path d="M17 17l14 14M31 17L17 31" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size = 48, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 4c1.6 9.4 10.6 18.4 20 20-9.4 1.6-18.4 10.6-20 20-1.6-9.4-10.6-18.4-20-20 9.4-1.6 18.4-10.6 20-20z" fill={color} />
  </svg>
);

export const BookmarkIcon: React.FC<IconProps> = ({ size = 48, color, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M13 6h22v36L24 34l-11 8V6z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </svg>
);

export const QuoteIcon: React.FC<IconProps> = ({ size = 72, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill={color}>
    <path d="M6 38V26c0-9 4-15 13-18l2 4c-5 2-7 5-7.5 10H20v16H6zm22 0V26c0-9 4-15 13-18l2 4c-5 2-7 5-7.5 10H42v16H28z" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 48, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill={color}>
    <rect x="12" y="9" width="8" height="30" rx="2" />
    <rect x="28" y="9" width="8" height="30" rx="2" />
  </svg>
);
