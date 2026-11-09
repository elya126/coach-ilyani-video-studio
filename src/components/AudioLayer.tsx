import React from "react";
import { Html5Audio, Sequence, interpolate, useVideoConfig } from "remotion";
import { studioConfig } from "../../studio.config";
import { resolveMedia } from "../lib/media";
import type { AudioSettings } from "../lib/schemas";
import { sec } from "../lib/timing";

/**
 * BACKGROUND MUSIC + SOUND EFFECTS
 *  - Music loops, fades in at the start and out at the end.
 *  - `duckFrames`: optional frame ranges where music gets quieter (e.g. while
 *    someone is talking).
 *  - Transition sound plays at every scene change (`sceneStarts`).
 */
export const AudioLayer: React.FC<{
  audio: AudioSettings;
  sceneStarts?: number[];
  duck?: boolean;
}> = ({ audio, sceneStarts = [], duck = false }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const cfg = studioConfig.audio;
  const musicUrl = resolveMedia(audio.music.src);
  const baseVolume = (audio.music.volume ?? cfg.musicVolume) * (duck ? 0.45 : 1);
  const fadeIn = Math.max(1, sec(cfg.musicFadeInSeconds));
  const fadeOut = Math.max(1, sec(cfg.musicFadeOutSeconds));
  const transitionUrl = resolveMedia(audio.transitionSound);

  return (
    <>
      {musicUrl ? (
        <Html5Audio
          src={musicUrl}
          loop
          trimBefore={audio.music.startFromSecond ? Math.round(audio.music.startFromSecond * fps) : undefined}
          volume={(f) =>
            baseVolume *
            interpolate(f, [0, fadeIn, durationInFrames - fadeOut, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}

      {transitionUrl
        ? sceneStarts.slice(1).map((start, i) => (
            <Sequence key={`t-${i}`} from={start} durationInFrames={sec(2)} layout="none">
              <Html5Audio src={transitionUrl} volume={cfg.soundEffectVolume} />
            </Sequence>
          ))
        : null}

      {audio.soundEffects.map((fx, i) => {
        const url = resolveMedia(fx.src);
        if (!url) return null;
        return (
          <Sequence key={`fx-${i}`} from={Math.round(fx.atSecond * fps)} durationInFrames={sec(4)} layout="none">
            <Html5Audio src={url} volume={fx.volume ?? cfg.soundEffectVolume} />
          </Sequence>
        );
      })}
    </>
  );
};
