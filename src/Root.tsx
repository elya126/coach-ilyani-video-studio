/**
 * Registers every video template with Remotion.
 * Each <Composition> appears in the Studio sidebar and can be rendered
 * with `npx remotion render <id>`.
 *
 * To add a new video based on an existing template, copy one
 * <Composition>, give it a new `id`, and point `defaultProps` to a new
 * content file (see README → "Make a new video from a template").
 */
import React from "react";
import { Composition, Folder } from "remotion";
import "./fonts";
import { VIDEO } from "./config/video";

import { EducationalReel, calculateEducationalMetadata, educationalSchema } from "./templates/EducationalReel";
import { TalkingHeadReel, calculateTalkingHeadMetadata, talkingHeadSchema } from "./templates/TalkingHeadReel";
import { NutritionTips, calculateNutritionMetadata, nutritionSchema } from "./templates/NutritionTips";
import { LifestyleReel, calculateLifestyleMetadata, lifestyleSchema } from "./templates/LifestyleReel";
import {
  ClientTransformation,
  calculateTransformationMetadata,
  transformationSchema,
} from "./templates/ClientTransformation";
import { ProductEducation, calculateProductMetadata, productSchema } from "./templates/ProductEducation";
import { CoachReel, calculateCoachReelMetadata, coachReelSchema } from "./templates/CoachReel";

import { educationalContent } from "./content/educational";
import { talkingHeadContent } from "./content/talkingHead";
import { nutritionTipsContent } from "./content/nutritionTips";
import { lifestyleContent } from "./content/lifestyle";
import { transformationContent } from "./content/transformation";
import { productEducationContent } from "./content/productEducation";
import { reel01Content } from "./content/reels/reel01-program-coaching";

const common = {
  width: VIDEO.width,
  height: VIDEO.height,
  fps: VIDEO.fps,
  // Placeholder only — the real length is calculated from the content.
  durationInFrames: 30 * VIDEO.fps,
};

export const RemotionRoot: React.FC = () => (
  <>
  {/* Reel bercakap Coach — satu <Composition> untuk setiap reel */}
  <Folder name="Coach-Reels">
    <Composition
      id="Reel01-ProgramCoaching"
      component={CoachReel}
      schema={coachReelSchema}
      defaultProps={reel01Content}
      calculateMetadata={calculateCoachReelMetadata}
      {...common}
    />
  </Folder>
  <Folder name="Coach-Ilyani">
    <Composition
      id="EducationalReel"
      component={EducationalReel}
      schema={educationalSchema}
      defaultProps={educationalContent}
      calculateMetadata={calculateEducationalMetadata}
      {...common}
    />
    <Composition
      id="TalkingHeadReel"
      component={TalkingHeadReel}
      schema={talkingHeadSchema}
      defaultProps={talkingHeadContent}
      calculateMetadata={calculateTalkingHeadMetadata}
      {...common}
    />
    <Composition
      id="NutritionTips"
      component={NutritionTips}
      schema={nutritionSchema}
      defaultProps={nutritionTipsContent}
      calculateMetadata={calculateNutritionMetadata}
      {...common}
    />
    <Composition
      id="LifestyleReel"
      component={LifestyleReel}
      schema={lifestyleSchema}
      defaultProps={lifestyleContent}
      calculateMetadata={calculateLifestyleMetadata}
      {...common}
    />
    <Composition
      id="ClientTransformation"
      component={ClientTransformation}
      schema={transformationSchema}
      defaultProps={transformationContent}
      calculateMetadata={calculateTransformationMetadata}
      {...common}
    />
    <Composition
      id="ProductEducation"
      component={ProductEducation}
      schema={productSchema}
      defaultProps={productEducationContent}
      calculateMetadata={calculateProductMetadata}
      {...common}
    />
  </Folder>
  </>
);
