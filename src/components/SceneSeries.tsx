import React from "react";
import { linearTiming, TransitionSeries, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { studioConfig } from "../../studio.config";
import { sec, transitionFrames } from "../lib/timing";

export type Scene = {
  id: string;
  durationInSeconds: number;
  render: () => React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presentation = (): TransitionPresentation<any> => {
  switch (studioConfig.animation.transition) {
    case "slide":
      return slide({ direction: "from-bottom" }) as TransitionPresentation<any>;
    case "wipe":
      return wipe({ direction: "from-bottom-left" }) as TransitionPresentation<any>;
    default:
      return fade() as TransitionPresentation<any>;
  }
};

/**
 * Plays scenes one after another with smooth transitions between them.
 * Transition style + length: studio.config.ts → animation.
 */
export const SceneSeries: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
  const tFrames = transitionFrames();
  return (
    <TransitionSeries>
      {scenes.flatMap((scene, i) => {
        const items = [
          <TransitionSeries.Sequence key={scene.id} durationInFrames={sec(scene.durationInSeconds)}>
            {scene.render()}
          </TransitionSeries.Sequence>,
        ];
        if (i < scenes.length - 1 && tFrames > 0) {
          items.push(
            <TransitionSeries.Transition
              key={`${scene.id}-transition`}
              presentation={presentation()}
              timing={linearTiming({ durationInFrames: tFrames })}
            />,
          );
        }
        return items;
      })}
    </TransitionSeries>
  );
};
