/**
 * Embedded tutorial video.
 *
 * Uses the privacy-friendly youtube-nocookie.com domain, which does not set
 * tracking cookies until the visitor actually presses play. The 16:9 frame is
 * built with the classic padding-bottom ratio box so it renders correctly in
 * every browser (no reliance on the CSS `aspect-ratio` property).
 */
interface TutorialVideoProps {
  className?: string;
  title?: string;
}

// youtu.be/9f6Q3E6_IRs
const YOUTUBE_ID = "9f6Q3E6_IRs";

export default function TutorialVideo({
  className = "",
  title = "How to add shot tracers to your golf videos",
}: TutorialVideoProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ${className}`}
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
