import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  getRemotionEnvironment,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { studioConfig } from "../../studio.config";
import { fonts } from "../config/theme";
import { isVideoFile, resolveMedia } from "../lib/media";
import { useTheme } from "./ThemeContext";

/**
 * B-ROLL / PHOTO / VIDEO SLOT
 *  - Video file  → plays muted (or with sound if `withSound`)
 *  - Image file  → gentle Ken Burns zoom
 *  - Empty src   → elegant animated gold placeholder; in the Studio preview
 *                  it also shows which file to add (hidden in final renders).
 */
export const MediaFrame: React.FC<{
  src: string;
  label?: string;
  withSound?: boolean;
  /** Darkens the media so text on top stays readable (0–1). */
  overlay?: number;
  style?: React.CSSProperties;
  borderRadius?: number;
}> = ({ src, label = "B-roll", withSound = false, overlay = 0, style, borderRadius = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const url = resolveMedia(src);
  const zoom = interpolate(frame, [0, durationInFrames], [1, studioConfig.animation.kenBurnsZoom]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", borderRadius, ...style }}>
      {url === null ? (
        <MediaPlaceholder label={label} />
      ) : isVideoFile(url) ? (
        <OffthreadVideo src={url} muted={!withSound} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
      )}
      {overlay > 0 ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,${overlay * 0.6}) 0%, rgba(0,0,0,${overlay * 0.25}) 40%, rgba(0,0,0,${overlay}) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** Animated abstract backdrop shown when no media file is set. */
export const MediaPlaceholder: React.FC<{ label: string }> = ({ label }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { gold, goldLight, goldDeep, charcoal, black, sand, ivory } = studioConfig.colors;
  const t = frame / 90;
  const dark = theme.name === "dark";
  const base = dark ? `linear-gradient(160deg, ${charcoal} 0%, ${black} 100%)` : `linear-gradient(160deg, ${sand} 0%, ${ivory} 100%)`;
  const isStudio = getRemotionEnvironment().isStudio;

  return (
    <AbsoluteFill style={{ background: base }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(t) * 25}% ${35 + Math.cos(t * 0.8) * 15}%, ${gold}55 0%, transparent 42%),
                       radial-gradient(circle at ${40 - Math.sin(t * 0.7) * 20}% ${75 + Math.sin(t) * 10}%, ${goldLight}44 0%, transparent 38%),
                       radial-gradient(circle at ${80 + Math.cos(t * 0.6) * 10}% ${15 + Math.sin(t * 0.9) * 8}%, ${goldDeep}33 0%, transparent 30%)`,
        }}
      />
      {isStudio ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            padding: "18px 28px",
            border: `2px dashed ${gold}`,
            borderRadius: 14,
            fontFamily: fonts.body,
            fontSize: 26,
            color: dark ? goldLight : goldDeep,
            backgroundColor: dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)",
            textAlign: "center",
            maxWidth: 760,
          }}
        >
          {label}
          <br />
          <span style={{ fontSize: 20, opacity: 0.8 }}>Preview-only hint · add a file in /public and set its path</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
