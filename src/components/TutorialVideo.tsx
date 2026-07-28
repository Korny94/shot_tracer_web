import { Clapperboard } from "lucide-react";

/**
 * Embedded tutorial video.
 *
 * Uses the privacy-friendly youtube-nocookie.com domain, which does not set
 * tracking cookies until the visitor actually presses play. The 16:9 frame is
 * built with the classic padding-bottom ratio box so it renders correctly in
 * every browser (no reliance on the CSS `aspect-ratio` property).
 *
 * Pass `videoId={null}` to render a styled "coming soon" placeholder instead
 * of a broken embed (used for the TracerStudio tutorial until it's uploaded).
 */
interface TutorialVideoProps {
  className?: string;
  title?: string;
  videoId?: string | null;
}

// Shot Tracer (web tool) tutorial — youtu.be/9f6Q3E6_IRs
export const SHOT_TRACER_TUTORIAL_ID = "9f6Q3E6_IRs";

// TracerStudio tutorial — TEMPORARY: reuses the Shot Tracer video until the
// dedicated TracerStudio tutorial is uploaded. Swap in its YouTube ID here.
// (Set to null to show a styled "coming soon" card instead.)
export const TRACERSTUDIO_TUTORIAL_ID: string | null = "8ymNn1FVIWA";

export default function TutorialVideo({
  className = "",
  title = "How to add shot tracers to your golf videos",
  videoId = SHOT_TRACER_TUTORIAL_ID,
}: TutorialVideoProps) {
  if (!videoId) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-dashed border-amber-500/40 bg-zinc-900/60 ${className}`}
        style={{ paddingBottom: "56.25%" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Clapperboard size={26} />
          </div>
          <p className="text-white font-bold text-lg">
            Video tutorial coming soon
          </p>
          <p className="text-gray-400 text-sm max-w-md">
            We're filming it right now. In the meantime, TracerStudio's built-in
            step-by-step guide walks you through everything — from your first
            tracer to the final export.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ${className}`}
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
