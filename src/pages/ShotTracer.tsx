import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import {
  Upload,
  Play,
  Pause,
  Trash2,
  Target,
  Ruler,
  Info,
  Settings2,
  ChevronRight,
  ChevronLeft,
  Check,
  MousePointer2,
  Gamepad2,
  Home,
  Download,
  User,
  UserRoundPen,
  Hash,
  Trophy,
} from "lucide-react";
import { SiArchicad } from "react-icons/si";
import TargetImg from "../assets/target.png"; // Ensure this path is correct
import LogoImg from "../assets/logo.png"; // Assuming you have a logo here

// --- HELPER: ASYNC IMAGE LOADER ---
// We need to preload images for the canvas export to work synchronously in the loop
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

// --- MATH & GEOMETRY ENGINE ---

const getRollerCoasterPoint = (
  p0: { x: number; y: number },
  c: { x: number; y: number },
  p1: { x: number; y: number },
  t: number
) => {
  // Calculate the CENTER between p0 and p1
  const centerX = (p0.x + p1.x) / 2;

  // Calculate how far left/right the user moved from center
  const xOffset = c.x - centerX;

  // Calculate the 85% point from the ORIGINAL p0 and p1 (not shifted)
  const apexX = p0.x + (p1.x - p0.x) * 0.85;

  // Apply the user's left/right adjustment to the apex
  const adjustedApexX = apexX + xOffset;

  // Use this as the control point X, keeping the same curve shape
  const forcedControl = {
    x: adjustedApexX, // Apex at 85% + user's left/right adjustment
    y: c.y - 300, // Same height adjustment
  };

  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * forcedControl.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * forcedControl.y + t * t * p1.y,
  };
};

const sampleRollerCoaster = (P0: any, C: any, P1: any, N = 200) => {
  const pts = [];
  for (let i = 0; i <= N; i++) {
    pts.push(getRollerCoasterPoint(P0, C, P1, i / N));
  }
  return pts;
};

// Exact Shadow Projection from React Native code
const projectSubsetToGroundUsingGlobal = (
  subsetPts: { x: number; y: number }[],
  startIndexInFull: number,
  fullCount: number,
  y0: number,
  y1: number
) => {
  if (subsetPts.length < 2 || fullCount <= 0) return subsetPts;

  const out = new Array(subsetPts.length);
  for (let i = 0; i < subsetPts.length; i++) {
    const globalIdx = startIndexInFull + i;
    const tGlobal = globalIdx / fullCount;
    // Ground line linear interpolation based on global index progress
    const y = y0 + (y1 - y0) * tGlobal;
    out[i] = { x: subsetPts[i].x, y };
  }
  return out;
};

const buildTaperedRibbonPath = (pts: any[], w0: number, w1: number) => {
  if (pts.length < 2) return "";

  const N = pts.length;
  const left = [];
  const right = [];
  const lens = [0];

  for (let i = 1; i < N; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    lens[i] = lens[i - 1] + Math.hypot(dx, dy);
  }
  const totalLen = Math.max(1e-6, lens[N - 1]);

  for (let i = 0; i < N; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = Math.min(N - 1, i + 1);
    const tx = pts[i1].x - pts[i0].x;
    const ty = pts[i1].y - pts[i0].y;
    const tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl;
    const ny = tx / tl;

    const t = lens[i] / totalLen;
    // Linear width interpolation
    const w = w0 + (w1 - w0) * t;
    const hx = w * 0.5 * nx;
    const hy = w * 0.5 * ny;

    left.push({ x: pts[i].x + hx, y: pts[i].y + hy });
    right.push({ x: pts[i].x - hx, y: pts[i].y - hy });
  }

  return [
    `M${left[0].x},${left[0].y}`,
    ...left.slice(1).map((p) => `L${p.x},${p.y}`),
    ...right
      .slice()
      .reverse()
      .map((p) => `L${p.x},${p.y}`),
    "Z",
  ].join(" ");
};

// --- SUB-COMPONENTS ---

const ControlNode = ({ x, y, color, label, onDragStart }: any) => (
  <div
    onPointerDown={(e) => onDragStart(e)}
    style={{ left: x, top: y }}
    className="absolute -ml-4 -mt-4 z-30 cursor-grab active:cursor-grabbing group touch-none"
  >
    <div
      className="w-8 h-8 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform"
      style={{ backgroundColor: color }}
    >
      {/* <div className="w-0.75 h-0.75  bg-white rounded-full" />  */}
    </div>
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 z-40">
      {label}
    </div>
  </div>
);

const DraggableWidget = React.memo(
  ({ children, x, y, visible, scale, onDragStart, id, setWidgetSize }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const prevSize = useRef({ w: 0, h: 0 });

    useEffect(() => {
      if (ref.current && visible) {
        const { offsetWidth: w, offsetHeight: h } = ref.current;
        if (w !== prevSize.current.w || h !== prevSize.current.h) {
          prevSize.current = { w, h };
          setWidgetSize(id, w, h);
        }
      }
    }, [visible, id, setWidgetSize, scale]);

    if (!visible) return null;
    return (
      <div
        ref={ref}
        onPointerDown={(e) => onDragStart(e)}
        style={{
          left: x,
          top: y,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute z-20 cursor-grab active:cursor-grabbing hover:ring-1 ring-white/30 rounded-lg touch-none select-none"
      >
        {children}
      </div>
    );
  }
);

const VirtualJoystick = ({
  onMove,
}: {
  onMove: (dx: number, dy: number) => void;
}) => {
  const stickRef = useRef(null);
  return (
    <div className="w-full aspect-square bg-zinc-900 rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
        <div className="border-r border-b border-white"></div>
        <div className="border-b border-white"></div>
        <div className="border-r border-white"></div>
        <div className=""></div>
      </div>
      <motion.div
        ref={stickRef}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={(_, info) => onMove(info.delta.x * 3, info.delta.y * 3)}
        className="w-12 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 cursor-move active:cursor-grabbing flex items-center justify-center"
      >
        <Gamepad2 size={20} className="text-black" />
      </motion.div>
      <span className="absolute bottom-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none">
        Curve Adjust
      </span>
    </div>
  );
};

// --- PRO TV GRAPHIC COMPONENT (DISPLAY ONLY) ---
const PlayerInfoGraphic = ({
  data,
  holeData,
  unit,
}: {
  data: { name: string; score: string; shot: string };
  holeData: { num: string; par: string; dist: string };
  unit: string;
}) => {
  // Logic for shot counter
  const par = parseInt(holeData.par) || 4;
  const currentShot = parseInt(data.shot) || 1;
  const maxSlots = par; // "Never be more numbers than hole par"

  // Calculate window
  // If shot is 6 on par 4, we want [3, 4, 5, 6]
  let endNum = Math.max(par, currentShot);
  let startNum = endNum - maxSlots + 1;

  const shots = [];
  for (let i = startNum; i <= endNum; i++) shots.push(i);

  return (
    <div
      style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.6)" }}
      className="flex flex-col w-[280px] rounded-lg overflow-hidden border border-white/20 font-sans"
    >
      {/* Upper Section */}
      <div className="bg-[#165B94] h-[45px] flex items-center px-3 justify-between relative">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-md flex items-center justify-center">
            <img
              src={LogoImg}
              alt="Logo"
              className="w-6 h-6 object-contain brightness-0 invert"
            />
          </div>
          <span
            style={{
              textShadow: "0px 1px 1px rgba(0, 0, 0, 1)",
              letterSpacing: 0.05,
            }}
            className="text-white font-bold text-lg uppercase tracking-tight truncate max-w-[140px]"
          >
            {data.name}
          </span>
        </div>
        <div className="w-10 h-8 bg-black/20 rounded flex items-center justify-center border border-white/10">
          <span
            style={{
              letterSpacing: 0.5,
              textShadow: "0px 1px 1px rgba(0, 0, 0, 1)",
            }}
            className="text-white font-bold text-lg"
          >
            {data.score}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-amber-500 w-full" />

      {/* Lower Section */}
      <div className="bg-white h-[35px] flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <span
            style={{ opacity: 0.8 }}
            className="text-black font-black text-xl mb-1"
          >
            {holeData.num}
          </span>
          <span className="text-gray-600 font-bold text-m">
            {holeData.dist}
            <span className="text-[12px]">{unit}</span>
          </span>
        </div>

        {/* Shot Counter */}
        <div className="flex items-center gap-1.5">
          {shots.map((num) => (
            <div
              key={num}
              style={{
                textShadow:
                  num === currentShot ? "0px 1px 1px rgba(0, 0, 0, 1)" : "",
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center
    ${num === currentShot ? "bg-[#165B94] text-white" : "text-gray-400"}
  `}
            >
              <span className="text-xs font-bold relative -top-[.25px]">
                {num}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ShotTracerWeb() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // State
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoDims, setVideoDims] = useState({ w: 0, h: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Playback
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Geometry
  const [impactPoint, setImpactPoint] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [landingPoint, setLandingPoint] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [controlPoint, setControlPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Widgets
  const [widgetPos, setWidgetPos] = useState({
    distance: { x: 20, y: 20 },
    target: { x: 150, y: 150 },
    holeInfo: { x: 20, y: 100 },
  });
  const [widgetSizes, setWidgetSizes] = useState<any>({});

  // Settings
  const [placingMode, setPlacingMode] = useState<"impact" | "landing" | null>(
    null
  );
  const [tracerMode, setTracerMode] = useState<"solid" | "comet" | "hybrid">(
    "solid"
  );
  const [tracerColor, setTracerColor] = useState("#ff0000");
  const [tracerOpacity, setTracerOpacity] = useState(0.7);
  const [tracerWidth, setTracerWidth] = useState(12);
  const [distanceScale, setDistanceScale] = useState(1.0);
  const [holeInfoScale, setHoleInfoScale] = useState(1.0);
  const [targetScale, setTargetScale] = useState(1.0);
  const [showShadow, setShowShadow] = useState(true);
  const [showTarget, setShowTarget] = useState(false);
  const [showDistance, setShowDistance] = useState(true);
  const [showHoleInfo, setShowHoleInfo] = useState(false);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false); // Toggle between basic hole info and Pro TV

  // Data
  const [yardage, setYardage] = useState("150");
  const [unit, setUnit] = useState<"yd" | "m">("yd");
  const [holeData, setHoleData] = useState({ num: "1", par: "4", dist: "420" });
  const [playerData, setPlayerData] = useState({
    name: "Tiger Woods",
    score: "-2",
    shot: "1",
  });

  // --- EXPORT LOGIC (CANVAS COMPOSITING) ---

  const handleExport = async () => {
    if (!videoRef.current || !containerRef.current) return;
    setIsExporting(true);
    setPlaying(false);
    setExportProgress(0);

    const video = videoRef.current;
    const originalTime = video.currentTime;
    const originalVolume = video.volume;

    const vidW = video.videoWidth;
    const vidH = video.videoHeight;

    // --- 1. DETECT FPS WITH FALLBACK ---
    let detectedFPS = 30;
    try {
      // Cast to 'any' because captureStream is not fully standardized in all TS libs yet
      const stream = (video as any).captureStream
        ? (video as any).captureStream()
        : (video as any).mozCaptureStream?.();
      if (stream) {
        const track = stream.getVideoTracks()[0];
        const settings = track?.getSettings();
        if (settings?.frameRate) {
          detectedFPS = settings.frameRate;
        }
      }
    } catch (e) {
      console.warn("Could not auto-detect FPS, defaulting to 30", e);
    }

    const originalFPS = detectedFPS;
    console.log(`Exporting at ${originalFPS} FPS`);

    const rect = containerRef.current.getBoundingClientRect();

    let targetImageObj: HTMLImageElement | null = null;
    let logoImageObj: HTMLImageElement | null = null;
    try {
      if (showTarget) targetImageObj = await loadImage(TargetImg);
      if (showPlayerInfo) logoImageObj = await loadImage(LogoImg);
    } catch (e) {
      console.warn("Could not load assets for export", e);
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context available");

      canvas.width = vidW;
      canvas.height = vidH;

      const target = new ArrayBufferTarget();

      const muxer = new Muxer({
        target,
        video: {
          codec: "avc",
          width: vidW,
          height: vidH,
        },
        fastStart: "in-memory",
      });

      if (typeof VideoEncoder === "undefined") {
        throw new Error(
          "WebCodecs API not supported. Use Chrome 94+, Edge 94+, or Opera 80+"
        );
      }

      // --- AUTO BITRATE & CODEC SELECTION ---
      const pixelCount = vidW * vidH;
      const bitrate = Math.max(25_000_000, Math.round(pixelCount * 10));

      const preferredCodecs = ["avc1.640033", "avc1.4d002a", "avc1.42001e"];
      let chosenCodec = "avc1.640033";

      for (const c of preferredCodecs) {
        if (VideoEncoder.isConfigSupported) {
          const support = await VideoEncoder.isConfigSupported({
            codec: c,
            width: vidW,
            height: vidH,
            bitrate,
            framerate: originalFPS,
          }).catch(() => null);
          if (support?.supported) {
            chosenCodec = c;
            break;
          }
        }
      }

      console.log("Chosen codec:", chosenCodec, "Bitrate:", bitrate);

      const encoder = new VideoEncoder({
        output: (chunk, meta) => {
          try {
            muxer.addVideoChunk(chunk, meta);
          } catch (e) {
            console.error("Error adding chunk to muxer:", e);
          }
        },
        error: (e) => {
          console.error("Encoder error:", e);
          alert(`Encoder error: ${e.message}`);
          setIsExporting(false);
        },
      });

      encoder.configure({
        codec: chosenCodec,
        width: vidW,
        height: vidH,
        bitrate,
        framerate: originalFPS,
        latencyMode: "quality",
        avc: { format: "annexb" },
      });

      video.currentTime = 0;
      video.volume = 0;

      // Ensure duration is valid
      const duration = video.duration || 1;
      const totalFrames = Math.ceil(duration * originalFPS);

      // *** FIX: Initialize currentFrame here ***
      let currentFrame = 0;

      const processFrame = async () => {
        if (currentFrame >= totalFrames) {
          try {
            await encoder.flush();
            muxer.finalize();

            const { buffer } = target;
            const blob = new Blob([buffer], { type: "video/mp4" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `MaxBogey_Tracer_${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => URL.revokeObjectURL(url), 100);

            setIsExporting(false);
            video.currentTime = originalTime;
            video.volume = originalVolume;
          } catch (e) {
            console.error("Finalization error:", e);
            setIsExporting(false);
            video.currentTime = originalTime;
            video.volume = originalVolume;
            alert("Export failed during finalization: " + (e as Error).message);
          }
          return;
        }

        try {
          const frameTime = currentFrame / originalFPS;
          video.currentTime = frameTime;

          await new Promise<void>((resolve) => {
            if (video.readyState >= 2) {
              resolve();
            } else {
              const onSeeked = () => {
                video.removeEventListener("seeked", onSeeked);
                resolve();
              };
              video.addEventListener("seeked", onSeeked, { once: true });
            }
          });

          ctx.clearRect(0, 0, vidW, vidH);
          ctx.drawImage(video, 0, 0, vidW, vidH);

          const t = video.currentTime;

          // Global opacity
          let globalOpacity = 1;
          if (landingPoint && t > landingPoint.time + 1.5) {
            const fadeProgress = (t - (landingPoint.time + 1.5)) / 0.5;
            globalOpacity = Math.max(0, 1 - fadeProgress);
          }

          // --- STEP 1: TARGET (behind everything) ---
          if (showTarget && targetImageObj) {
            const pointScale = vidW / rect.width;
            const tx = widgetPos.target.x * pointScale;
            const ty = widgetPos.target.y * pointScale;
            const ts = targetScale * pointScale;

            let targetOpacity = 1;
            if (impactPoint && landingPoint) {
              const totalDuration = Math.max(
                0.1,
                landingPoint.time - impactPoint.time
              );
              const rawProgress = (t - impactPoint.time) / totalDuration;
              const easedProgress = Math.pow(
                Math.max(0, Math.min(1, rawProgress)),
                0.4
              );
              if (easedProgress > 0.1) {
                targetOpacity = Math.max(0, 1 - (easedProgress - 0.4) / 0.2);
              }
            }

            const yOffset = Math.sin(t * Math.PI) * 10 * pointScale;

            ctx.save();
            ctx.globalAlpha = targetOpacity * globalOpacity;

            const targetW = 35 * ts;
            const ratio =
              targetImageObj.naturalHeight / targetImageObj.naturalWidth;
            const targetH = targetW * ratio;

            ctx.drawImage(targetImageObj, tx, ty + yOffset, targetW, targetH);
            ctx.restore();
          }

          // --- STEP 2: TRACER AND SHADOW ---
          if (impactPoint && landingPoint) {
            // DON'T scale the points - use them directly like the SVG does
            const scImp = {
              x: impactPoint.x + 0.8,
              y: impactPoint.y + 2.5, // Move down a few pixels
            };
            const scLand = {
              x: landingPoint.x + 0.7,
              y: landingPoint.y + 1.5, // Move down a few pixels
            };

            const cpRaw = controlPoint || {
              x: (impactPoint.x + landingPoint.x) / 2,
              y: Math.min(impactPoint.y, landingPoint.y) - 200,
            };
            const scCp = {
              x: cpRaw.x,
              y: cpRaw.y,
            };

            const totalDuration = Math.max(
              0.1,
              landingPoint.time - impactPoint.time
            );
            const rawProgress = (t - impactPoint.time) / totalDuration;
            const easedProgress = Math.pow(
              Math.max(0, Math.min(1, rawProgress)),
              0.4
            );

            if (easedProgress > 0) {
              const N = 240;
              const floatIdx = easedProgress * N;
              const fullCurve = sampleRollerCoaster(scImp, scCp, scLand, N);
              const endIdx = Math.floor(floatIdx);
              let visiblePts = fullCurve.slice(0, endIdx + 1);

              if (easedProgress < 1) {
                visiblePts.push(
                  getRollerCoasterPoint(scImp, scCp, scLand, easedProgress)
                );
              }
              const isLanded = t > landingPoint.time;
              let startIdx = 0;

              // Calculate fade factor for comet/hybrid when head reaches end
              let fadeOpacity = 1;
              let shadowFadeOpacity = 1;

              if (tracerMode === "comet" || tracerMode === "hybrid") {
                const cutStart =
                  tracerMode === "comet"
                    ? Math.floor(N * 0.3)
                    : Math.floor(N * 0.6);
                const maxTailEat = tracerMode === "comet" ? N * 0.875 : N * 0.8;

                if (endIdx > cutStart || isLanded) {
                  let rawStartIdx =
                    ((floatIdx - cutStart) / (N - cutStart)) * maxTailEat;

                  if (isLanded) {
                    const timeSinceLand = t - landingPoint.time;
                    const shrinkFactor = Math.min(1, timeSinceLand / 1.9);
                    rawStartIdx =
                      rawStartIdx + (N - rawStartIdx) * shrinkFactor;

                    // Calculate fade opacity based on time since landing
                    const fadeDuration = 1.5;
                    fadeOpacity = Math.max(0, 1 - timeSinceLand / fadeDuration);
                    shadowFadeOpacity = fadeOpacity;
                  }

                  rawStartIdx = Math.max(
                    0,
                    Math.min(rawStartIdx, visiblePts.length - 2)
                  );
                  const startIdxInt = Math.floor(rawStartIdx);
                  startIdx = startIdxInt;
                  const startFrac = rawStartIdx - startIdxInt;

                  const slicedPts = visiblePts.slice(startIdxInt);

                  // Fractional tail interpolation
                  if (slicedPts.length >= 2 && startFrac > 0) {
                    const p0 = visiblePts[startIdxInt];
                    const p1 = visiblePts[startIdxInt + 1];

                    slicedPts[0] = {
                      x: p0.x + (p1.x - p0.x) * startFrac,
                      y: p0.y + (p1.y - p0.y) * startFrac,
                    };
                  }

                  visiblePts = slicedPts;
                }
              }

              if (visiblePts.length > 1) {
                // Width factor helper functions

                const getTailWidthFactor = (mode, progress) => {
                  if (mode === "comet") {
                    if (progress <= 0.4) return 1.0;
                    if (progress <= 0.6)
                      return 1.0 - ((progress - 0.4) / 0.2) * 0.2;
                    return 0.8;
                  } else {
                    // hybrid - 0-60%: 100% width, 60-80%: smoothly reduces from 100% to 80% width, 80%+: 80% width
                    if (progress <= 0.6) return 1.0;
                    if (progress <= 0.8)
                      return 1.0 - ((progress - 0.6) / 0.2) * 0.2;
                    return 0.8;
                  }
                };

                const getHeadWidthFactor = (mode, progress) => {
                  if (mode === "comet") {
                    if (progress <= 0.4) return 1.0;
                    if (progress <= 0.6)
                      return 1.0 - ((progress - 0.4) / 0.2) * 0.6;
                    return 0.4;
                  } else {
                    // hybrid - 0-60%: 100% width, 60-80%: smoothly reduces from 100% to 40% width, 80%+: 40% width
                    if (progress <= 0.6) return 1.0;
                    if (progress <= 0.8)
                      return 1.0 - ((progress - 0.6) / 0.2) * 0.6;
                    return 0.4;
                  }
                };

                // Scale factor for canvas drawing
                const pointScale = vidW / rect.width;

                // Scale the visible points for canvas
                const scaledVisiblePts = visiblePts.map((pt) => ({
                  x: pt.x * pointScale,
                  y: pt.y * pointScale,
                }));

                // Scale startIdx and N for ground projection
                const scaledStartIdx = startIdx;
                const scaledN = N;
                const scaledScImpY = scImp.y * pointScale;
                const scaledScLandY = scLand.y * pointScale;

                // Shadow
                if (showShadow) {
                  const groundPts = projectSubsetToGroundUsingGlobal(
                    scaledVisiblePts,
                    scaledStartIdx,
                    scaledN,
                    scaledScImpY,
                    scaledScLandY
                  );

                  let dShadow;
                  if (tracerMode === "solid") {
                    dShadow = buildTaperedRibbonPath(
                      groundPts,
                      tracerWidth * pointScale * 0.65,
                      tracerWidth * pointScale * 0.25
                    );
                    const p = new Path2D(dShadow);

                    // Create gradient for shadow in solid mode
                    const gradient = ctx.createLinearGradient(
                      groundPts[0].x,
                      groundPts[0].y,
                      groundPts[groundPts.length - 1].x,
                      groundPts[groundPts.length - 1].y
                    );
                    gradient.addColorStop(0, "rgba(0,0,0,0)");
                    gradient.addColorStop(0.3, "rgba(0,0,0,0.2)");
                    gradient.addColorStop(0.6, "rgba(0,0,0,0.25)");
                    gradient.addColorStop(1, "rgba(0,0,0,0.25)");

                    ctx.fillStyle = gradient;
                    ctx.globalAlpha = globalOpacity;
                    ctx.fill(p);
                  } else {
                    // Comet/Hybrid mode shadow
                    const headWidthFactor = getHeadWidthFactor(
                      tracerMode,
                      easedProgress
                    );
                    const tailWidthFactor = getTailWidthFactor(
                      tracerMode,
                      easedProgress
                    );
                    const startWidth =
                      tracerWidth * pointScale * headWidthFactor;
                    const endWidth =
                      tracerWidth * pointScale * tailWidthFactor * 0.6;

                    dShadow = buildTaperedRibbonPath(
                      groundPts,
                      startWidth * 0.6,
                      endWidth * 0.2
                    );
                    const p = new Path2D(dShadow);
                    ctx.fillStyle = "rgba(0,0,0,0.25)";
                    ctx.globalAlpha = shadowFadeOpacity * globalOpacity;
                    ctx.fill(p);
                  }
                  ctx.globalAlpha = 1.0;
                }

                // Main line
                let dMain;
                let pMain;

                if (tracerMode === "solid") {
                  dMain = buildTaperedRibbonPath(
                    scaledVisiblePts,
                    tracerWidth * pointScale,
                    tracerWidth * pointScale * 0.275
                  );
                  pMain = new Path2D(dMain);

                  const g = ctx.createLinearGradient(
                    scaledVisiblePts[0].x,
                    scaledVisiblePts[0].y,
                    scaledVisiblePts[scaledVisiblePts.length - 1].x,
                    scaledVisiblePts[scaledVisiblePts.length - 1].y
                  );
                  g.addColorStop(0, `${tracerColor}00`);
                  g.addColorStop(0.3, `${tracerColor}80`);
                  g.addColorStop(1, tracerColor);
                  ctx.fillStyle = g;

                  let tracerOpacityValue = tracerOpacity;
                  if (isLanded && t > landingPoint.time + 1.5) {
                    const fade = Math.max(
                      0,
                      1 - (t - (landingPoint.time + 1.5)) / 0.5
                    );
                    tracerOpacityValue *= fade;
                  }
                  ctx.globalAlpha = tracerOpacityValue * globalOpacity;
                } else {
                  // Comet/Hybrid mode
                  const headWidthFactor = getHeadWidthFactor(
                    tracerMode,
                    easedProgress
                  );
                  const tailWidthFactor = getTailWidthFactor(
                    tracerMode,
                    easedProgress
                  );
                  const startWidth = tracerWidth * pointScale * headWidthFactor;
                  const endWidth =
                    tracerWidth * pointScale * tailWidthFactor * 0.6;

                  dMain = buildTaperedRibbonPath(
                    scaledVisiblePts,
                    startWidth * 0.7,
                    endWidth * 0.45
                  );
                  pMain = new Path2D(dMain);
                  ctx.fillStyle = tracerColor;
                  ctx.globalAlpha = tracerOpacity * fadeOpacity * globalOpacity;
                }

                ctx.shadowColor = "rgba(0,0,0,0.65)";
                ctx.shadowBlur = 4 * pointScale;
                ctx.shadowOffsetY = 2 * pointScale;
                ctx.fill(pMain);
                ctx.shadowColor = "transparent";
                ctx.globalAlpha = 1.0;
              }
            }
          }

          // --- STEP 3: WIDGETS (on top) ---

          // 1. DISTANCE WIDGET - PERFECTED
          if (showDistance && impactPoint && landingPoint) {
            const pointScale = vidW / rect.width;
            const totalDuration = Math.max(
              0.1,
              landingPoint.time - impactPoint.time
            );
            const effTime = Math.min(t, landingPoint.time);
            let distVal = 0;

            if (effTime >= impactPoint.time) {
              const rp = (effTime - impactPoint.time) / totalDuration;
              const ep = Math.pow(Math.max(0, Math.min(1, rp)), 0.4);
              distVal = Math.round(ep * parseInt(yardage));
            }

            const wx = widgetPos.distance.x * pointScale;
            const wy = widgetPos.distance.y * pointScale;
            const ws = distanceScale * pointScale;

            ctx.save();
            ctx.globalAlpha = globalOpacity;

            // Widget dimensions
            const widgetWidth = 88 * ws;
            const widgetHeight = 53 * ws;

            // Background with shadow (outside only)
            ctx.shadowColor = "rgba(0, 0, 0, 1)";
            ctx.shadowBlur = 2 * ws;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2 * ws;

            ctx.beginPath();
            ctx.roundRect(wx, wy, widgetWidth, widgetHeight, 12 * ws);
            ctx.fillStyle = "#165B94";
            ctx.fill();

            // Reset shadow before border/text
            ctx.shadowColor = "transparent";

            // Border
            ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
            ctx.lineWidth = 2 * ws;
            ctx.stroke();

            // Text settings
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic"; // IMPORTANT: shared baseline

            const distanceText = distVal.toString();
            const unitText = unit;

            // Measure widths
            ctx.font = `600 ${24 * ws}px sans-serif`;
            const distanceWidth = ctx.measureText(distanceText).width;

            ctx.font = `bold ${14 * ws}px sans-serif`;
            const unitWidth = ctx.measureText(unitText).width;

            const totalTextWidth = distanceWidth + unitWidth;
            const textStartX = wx + (widgetWidth - totalTextWidth) / 2;

            // ---- BASELINE CENTERING ----
            ctx.font = `600 ${24 * ws}px sans-serif`;
            const metrics = ctx.measureText("0");
            const textHeight =
              metrics.actualBoundingBoxAscent +
              metrics.actualBoundingBoxDescent;

            const baselineY =
              wy +
              (widgetHeight + textHeight) / 2 -
              metrics.actualBoundingBoxDescent;
            // ----------------------------

            // Draw number
            ctx.shadowColor = "rgba(0, 0, 0, 1)";
            ctx.shadowBlur = 2 * ws;
            ctx.shadowOffsetY = 1 * ws;
            ctx.fillText(
              distanceText,
              textStartX + distanceWidth / 2,
              baselineY
            );

            // Draw unit (same baseline, smaller font)
            ctx.shadowColor = "rgba(0, 0, 0, 1)";
            ctx.shadowBlur = 2 * ws;
            ctx.shadowOffsetY = 1 * ws;
            ctx.font = `bold ${14 * ws}px sans-serif`;
            ctx.fillText(
              unitText,
              textStartX + distanceWidth + unitWidth / 2,
              baselineY
            );

            ctx.restore();
          }

          // 2. HOLE INFO WIDGET - PERFECTED
          if (showHoleInfo) {
            const pointScale = vidW / rect.width;
            const hx = widgetPos.holeInfo.x * pointScale;
            const hy = widgetPos.holeInfo.y * pointScale;
            const hs = holeInfoScale * pointScale;

            ctx.save();
            ctx.globalAlpha = globalOpacity;

            if (showPlayerInfo && logoImageObj) {
              // PRO TV GRAPHIC - PERFECTED
              const widgetWidth = 280 * hs;
              const topHeight = 45 * hs;
              const dividerHeight = 2 * hs;
              const bottomHeight = 35 * hs;
              const totalHeight = topHeight + dividerHeight + bottomHeight;

              // Main container with box-shadow
              ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
              ctx.shadowBlur = 2 * hs;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 2 * hs;

              ctx.beginPath();
              ctx.roundRect(hx, hy, widgetWidth, totalHeight, 8 * hs);
              ctx.fillStyle = "white";
              ctx.fill();

              // Border
              ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
              ctx.lineWidth = 2 * hs;
              ctx.stroke();

              ctx.shadowColor = "transparent";

              // ─── UPPER SECTION ─────────────────────
              ctx.fillStyle = "#165B94";
              ctx.beginPath();
              ctx.roundRect(hx, hy, widgetWidth, topHeight, [
                8 * hs,
                8 * hs,
                0,
                0,
              ]);
              ctx.fill();

              // Logo — moved slightly RIGHT
              const logoSize = 23 * hs;
              const logoX = hx + 16 * hs; // CHANGED: was 12 * hs
              const logoY = hy + (topHeight - logoSize) / 2;

              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = logoImageObj.width;
              tempCanvas.height = logoImageObj.height;
              const tempCtx = tempCanvas.getContext("2d");
              if (tempCtx) {
                tempCtx.filter = "brightness(0) invert(1)";
                tempCtx.drawImage(logoImageObj, 0, 0);
                ctx.drawImage(tempCanvas, logoX, logoY, logoSize, logoSize);
              }

              // Player Name — moved DOWN slightly
              ctx.fillStyle = "white";
              ctx.font = `bold ${17 * hs}px sans-serif`;
              ctx.letterSpacing = ".5";
              ctx.shadowColor = "rgba(0, 0, 0, .8)";
              ctx.shadowBlur = 1.75 * hs;
              ctx.shadowOffsetY = 0.85 * hs;
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";

              const name = playerData.name.toUpperCase();
              const nameX = logoX + logoSize + 16 * hs;
              const nameY = hy + topHeight / 2 + 2 * hs; // CHANGED: move name down slightly
              const maxNameWidth = 140 * hs;

              let displayName = name;
              if (ctx.measureText(name).width > maxNameWidth) {
                for (let i = name.length; i > 0; i--) {
                  const testName = name.substring(0, i) + "...";
                  if (ctx.measureText(testName).width <= maxNameWidth) {
                    displayName = testName;
                    break;
                  }
                }
              }
              ctx.fillText(displayName, nameX, nameY);

              // Score Box
              const scoreBoxWidth = 40 * hs;
              const scoreBoxHeight = 30 * hs;
              const scoreBoxX = hx + widgetWidth - (12 * hs + scoreBoxWidth);
              const scoreBoxY = hy + (topHeight - scoreBoxHeight) / 2;

              ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
              ctx.beginPath();
              ctx.roundRect(
                scoreBoxX,
                scoreBoxY,
                scoreBoxWidth,
                scoreBoxHeight,
                4 * hs
              );
              ctx.fill();

              ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
              ctx.lineWidth = 1 * hs;
              ctx.stroke();

              // Score Text — moved DOWN slightly
              ctx.fillStyle = "white";
              ctx.font = `bold ${18 * hs}px sans-serif`;
              ctx.shadowColor = "rgba(0, 0, 0, 1)";
              ctx.shadowBlur = 2 * hs;
              ctx.shadowOffsetY = 1 * hs;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(
                playerData.score,
                scoreBoxX + scoreBoxWidth / 2,
                scoreBoxY + scoreBoxHeight / 2 + 1 * hs // CHANGED
              );

              // Divider
              const dividerY = hy + topHeight;
              ctx.fillStyle = "#fe9a00";
              ctx.fillRect(hx, dividerY, widgetWidth, dividerHeight);

              // ─── LOWER SECTION ─────────────────────
              const lowerY = dividerY + dividerHeight;
              ctx.fillStyle = "white";
              ctx.beginPath();
              ctx.roundRect(hx, lowerY, widgetWidth, bottomHeight, [
                0,
                0,
                8 * hs,
                8 * hs,
              ]);
              ctx.fill();

              // Hole Number
              ctx.fillStyle = "#000000e0";
              ctx.font = `800 ${20 * hs}px sans-serif`;
              ctx.shadowColor = "transparent";

              ctx.textAlign = "left";
              ctx.textBaseline = "middle";

              const holeNumX = hx + 16 * hs;
              const holeNumY = lowerY + bottomHeight / 2 + 2;
              ctx.fillText(holeData.num, holeNumX, holeNumY);

              ctx.fillStyle = "#4b5563";
              ctx.textBaseline = "middle";

              const yardFontSize = 15 * hs;
              const unitFontSize = 10 * hs;
              const unitGap = 0.75 * hs; // small gap

              // Measure yardage width
              ctx.font = `600 ${yardFontSize}px sans-serif`;
              const yardWidth = ctx.measureText(holeData.dist).width;

              // X-position: distance from hole number
              const distanceX =
                holeNumX + ctx.measureText(holeData.num).width + 20 * hs;
              const centerY = lowerY + bottomHeight / 2 + 3;

              // Draw yardage
              ctx.fillText(holeData.dist, distanceX, centerY);

              // Draw unit immediately after yardage with small gap
              // Adjust Y so smaller font visually lines up with larger font
              ctx.font = `700 ${unitFontSize}px sans-serif`;
              ctx.shadowColor = "transparent";

              const unitY = centerY + (yardFontSize - unitFontSize) * 0.15; // tweak factor if needed
              ctx.fillText(unit, distanceX + yardWidth + unitGap, unitY);

              // ─── SHOT COUNTER ──────────────────────
              const par = parseInt(holeData.par) || 4;
              const currentShot = parseInt(playerData.shot) || 1;
              const maxSlots = par;

              const endNum = Math.max(par, currentShot);
              const startNum = endNum - maxSlots + 1;

              const shots = [];
              for (let i = startNum; i <= endNum; i++) shots.push(i);

              const circleRadius = 12 * hs;
              const circleSpacing = 30 * hs; // CHANGED: bigger gap between shots
              const rightPadding = 16 * hs;

              const startX =
                hx +
                widgetWidth -
                rightPadding -
                circleRadius -
                (shots.length - 1) * circleSpacing;

              const circleY = lowerY + bottomHeight / 2;

              shots.forEach((num, idx) => {
                const circleX = startX + idx * circleSpacing;
                const isCurrent = num === currentShot;

                if (isCurrent) {
                  ctx.fillStyle = "#165B94";
                  ctx.beginPath();
                  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.fillStyle = "white";
                  ctx.font = `bold ${12 * hs}px sans-serif`;
                  ctx.shadowColor = "rgba(0, 0, 0, 1)";
                  ctx.shadowBlur = 2 * hs;
                  ctx.shadowOffsetY = 1 * hs;
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  ctx.fillText(num.toString(), circleX, circleY + 0.5 * hs);
                } else {
                  ctx.fillStyle = "#9ca3af";
                  ctx.font = `bold ${12 * hs}px sans-serif`;
                  ctx.shadowColor = "transparent";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  ctx.fillText(num.toString(), circleX, circleY);
                }
              });
            } else {
              // SIMPLE HOLE INFO - BALANCED & REFINED
              const widgetWidth = 68 * hs;
              const topHeight = 50 * hs;
              const dividerHeight = 3 * hs;
              const bottomHeight = 62 * hs;
              const totalHeight = topHeight + dividerHeight + bottomHeight;

              // Outer container shadow
              ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
              ctx.shadowBlur = 2 * hs;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 2 * hs;

              ctx.beginPath();
              ctx.roundRect(hx, hy, widgetWidth, totalHeight, 8 * hs);
              ctx.fillStyle = "white";
              ctx.fill();

              // Outer subtle border (border-white/20)
              ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
              ctx.lineWidth = 2 * hs;
              ctx.stroke();

              ctx.shadowColor = "transparent";

              // ─── TOP SECTION ───────────────────────
              ctx.fillStyle = "#165B94";
              ctx.beginPath();
              ctx.roundRect(hx, hy, widgetWidth, topHeight, [
                8 * hs,
                8 * hs,
                0,
                0,
              ]);
              ctx.fill();

              // Hole number
              ctx.fillStyle = "white";
              ctx.font = `bold ${30 * hs}px sans-serif`;
              ctx.shadowColor = "rgba(0, 0, 0, 1)";
              ctx.shadowBlur = 2 * hs;
              ctx.shadowOffsetY = 1 * hs;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(
                holeData.num,
                hx + widgetWidth / 2,
                hy + topHeight / 2 + 3 * hs
              );

              // ─── DIVIDER ───────────────────────────
              const dividerY = hy + topHeight;
              ctx.fillStyle = "#fe9A00";
              ctx.shadowColor = "transparent";
              ctx.fillRect(hx, dividerY, widgetWidth, dividerHeight);

              // ─── BOTTOM SECTION ────────────────────
              const bottomY = dividerY + dividerHeight;
              ctx.fillStyle = "white";
              ctx.shadowColor = "transparent";
              ctx.beginPath();
              ctx.roundRect(hx, bottomY, widgetWidth, bottomHeight, [
                0,
                0,
                8 * hs,
                8 * hs,
              ]);
              ctx.fill();

              ctx.textAlign = "center";
              ctx.textBaseline = "alphabetic";

              // ─── MEASURE TEXT HEIGHTS ──────────────
              ctx.font = `900 ${16 * hs}px sans-serif`;
              const parMetrics = ctx.measureText("Par");
              const parHeight =
                parMetrics.actualBoundingBoxAscent +
                parMetrics.actualBoundingBoxDescent;

              ctx.font = `700 ${16 * hs}px sans-serif`;
              const yardMetrics = ctx.measureText("0");
              const yardHeight =
                yardMetrics.actualBoundingBoxAscent +
                yardMetrics.actualBoundingBoxDescent;

              // Remaining empty space split evenly (top / middle / bottom)
              const freeSpace = bottomHeight - parHeight - yardHeight;
              const gap = freeSpace / 3;

              // ─── PAR TEXT ──────────────────────────
              ctx.fillStyle = "#374151";
              ctx.font = `bold ${16 * hs}px sans-serif`;

              const parBaselineY =
                bottomY + gap + parMetrics.actualBoundingBoxAscent;

              ctx.fillText(
                `Par ${holeData.par}`,
                hx + widgetWidth / 2,
                parBaselineY
              );

              // ─── YARDAGE + UNIT ────────────────────
              const yardFontSize = 14 * hs;
              const unitFontSize = 10 * hs;

              ctx.font = `bold ${yardFontSize}px sans-serif`;
              const yardWidth = ctx.measureText(holeData.dist).width;

              ctx.font = `bold ${unitFontSize}px sans-serif`;
              const unitWidth = ctx.measureText(unit).width;

              const totalTextWidth = yardWidth + unitWidth;
              const startX = hx + (widgetWidth - totalTextWidth) / 2;

              // Tighten center spacing slightly
              const centerTighten = 2 * hs;

              const yardBaselineY =
                parBaselineY + parHeight + (gap - centerTighten);

              ctx.fillStyle = "#6b7280";

              const unitGap = 0.9 * hs; // subtle, intentional spacing

              // Yardage
              ctx.font = `bold ${yardFontSize}px sans-serif`;
              ctx.fillText(
                holeData.dist,
                startX + yardWidth / 2,
                yardBaselineY
              );

              // Unit — small gap from yardage
              ctx.font = `bold ${unitFontSize}px sans-serif`;
              ctx.fillText(
                unit,
                startX + yardWidth + unitGap + unitWidth / 2,
                yardBaselineY
              );
            }

            ctx.restore();
          }

          // Encode frame
          const frame = new VideoFrame(canvas, {
            timestamp: currentFrame * (1_000_000 / originalFPS),
            duration: 1_000_000 / originalFPS,
          });

          encoder.encode(frame, {
            keyFrame: currentFrame % originalFPS === 0 || currentFrame === 0,
          });

          frame.close();

          currentFrame++;
          setExportProgress(Math.round((currentFrame / totalFrames) * 100));

          setTimeout(processFrame, 0);
        } catch (frameError) {
          console.error("Frame processing error:", frameError);
          currentFrame++;
          setExportProgress(Math.round((currentFrame / totalFrames) * 100));
          setTimeout(processFrame, 0);
        }
      };

      processFrame();
    } catch (e) {
      console.error("Export setup error:", e);
      setIsExporting(false);
      video.currentTime = originalTime;
      video.volume = originalVolume;
      alert("Export failed: " + (e as Error).message);
    }
  };

  // --- DRAG LOGIC ---
  const draggingRef = useRef<{
    type: string;
    startX: number;
    startY: number;
    initialPos: { x: number; y: number };
  } | null>(null);

  const startDrag = (
    e: React.PointerEvent,
    type: string,
    currentPos: { x: number; y: number }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    draggingRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      initialPos: { ...currentPos },
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !containerRef.current) return;
    const { type, startX, startY, initialPos } = draggingRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    let newX = initialPos.x + deltaX;
    let newY = initialPos.y + deltaY;

    // Clamping
    const rect = containerRef.current.getBoundingClientRect();
    let objW = 0,
      objH = 0;
    if (["distance", "target", "holeInfo"].includes(type)) {
      const size = widgetSizes[type];
      if (size) {
        objW = size.w;
        objH = size.h;
      }
    }
    newX = Math.max(0, Math.min(rect.width - objW, newX));
    newY = Math.max(0, Math.min(rect.height - objH, newY));

    if (type === "impact" && impactPoint)
      setImpactPoint({ ...impactPoint, x: newX, y: newY });
    else if (type === "landing" && landingPoint)
      setLandingPoint({ ...landingPoint, x: newX, y: newY });
    else if (type === "control" && controlPoint)
      setControlPoint({ x: newX, y: newY });
    else if (["distance", "target", "holeInfo"].includes(type)) {
      setWidgetPos((prev) => ({ ...prev, [type]: { x: newX, y: newY } }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      draggingRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const updateWidgetSize = useCallback((id: string, w: number, h: number) => {
    setWidgetSizes((prev: any) => {
      if (prev[id]?.w === w && prev[id]?.h === h) return prev;
      return { ...prev, [id]: { w, h } };
    });
  }, []);

  // --- FILE HANDLING ---
  const onFileChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setImpactPoint(null);
    setLandingPoint(null);
    setControlPoint(null);
    setPlaying(false);
    setCurrentTime(0);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current && containerRef.current) {
      setDuration(videoRef.current.duration);
      setVideoDims({
        w: videoRef.current.videoWidth,
        h: videoRef.current.videoHeight,
      });
    }
  };

  useEffect(() => {
    let handle: number;
    const loop = () => {
      if (videoRef.current && !videoRef.current.paused) {
        setCurrentTime(videoRef.current.currentTime);
        if (videoRef.current.ended) setPlaying(false);
      }
      handle = requestAnimationFrame(loop);
    };
    handle = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(handle);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setPlaying((prev) => {
      if (prev) {
        video.pause();
      } else {
        if (video.currentTime >= duration) {
          video.currentTime = 0;
        }
        video.play();
      }
      return !prev;
    });
  }, [duration]);

  const skipFrame = useCallback(
    (direction: "fwd" | "back") => {
      const video = videoRef.current;
      if (!video) return;

      const frameTime = 1 / 30;

      const newTime =
        direction === "fwd"
          ? Math.min(duration, video.currentTime + frameTime)
          : Math.max(0, video.currentTime - frameTime);

      video.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowUp":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowDown":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipFrame("back");
          break;
        case "ArrowRight":
          e.preventDefault();
          skipFrame("fwd");
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, skipFrame]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!placingMode || !containerRef.current || !videoRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const time = videoRef.current.currentTime;
    const pt = { x, y, time };

    if (placingMode === "impact") {
      setImpactPoint(pt);
      if (landingPoint) {
        setControlPoint({
          x: (x + landingPoint.x) / 2,
          y: Math.min(y, landingPoint.y) - rect.height * 0.3,
        });
      }
    } else {
      setLandingPoint(pt);
      if (impactPoint) {
        setControlPoint({
          x: (impactPoint.x + x) / 2,
          y: Math.min(impactPoint.y, y) - rect.height * 0.3,
        });
      }
    }
    setPlacingMode(null);
  };

  const tracerData = useMemo(() => {
    if (!impactPoint || !landingPoint) return null;

    const cp = controlPoint || {
      x: (impactPoint.x + landingPoint.x) / 2,
      y: Math.min(impactPoint.y, landingPoint.y) - 200,
    };

    const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
    const rawProgress = (currentTime - impactPoint.time) / totalDuration;
    const easedProgress = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);

    if (easedProgress <= 0) return null;

    const N = 240;
    const floatIdx = easedProgress * N;

    const fullCurve = sampleRollerCoaster(impactPoint, cp, landingPoint, N);

    const endIdx = Math.floor(floatIdx);
    let visiblePts = fullCurve.slice(0, endIdx + 1);

    // Sub-pixel head interpolation
    if (easedProgress < 1) {
      const exactTip = getRollerCoasterPoint(
        impactPoint,
        cp,
        landingPoint,
        easedProgress
      );
      visiblePts.push(exactTip);
    }

    const isLanded = currentTime > landingPoint.time;
    let startIdx = 0;

    // Calculate fade factor for comet/hybrid when head reaches end
    let fadeOpacity = 1;
    let shadowFadeOpacity = 1;

    // --------------------------------------------------
    // COMET + HYBRID (FRACTIONAL, SMOOTH TAIL SHRINK + FADE)
    // --------------------------------------------------

    if (tracerMode === "comet" || tracerMode === "hybrid") {
      const cutStart =
        tracerMode === "comet" ? Math.floor(N * 0.3) : Math.floor(N * 0.6);

      // 🔑 DIFFERENCE BETWEEN MODES
      const maxTailEat = tracerMode === "comet" ? N * 0.875 : N * 0.8;

      if (endIdx > cutStart || isLanded) {
        let rawStartIdx = ((floatIdx - cutStart) / (N - cutStart)) * maxTailEat;

        if (isLanded) {
          const timeSinceLand = currentTime - landingPoint.time;
          const shrinkFactor = Math.min(1, timeSinceLand / 1.9);
          rawStartIdx = rawStartIdx + (N - rawStartIdx) * shrinkFactor;

          // Calculate fade opacity based on time since landing
          // Start fading immediately when head reaches end, finish before tail reaches end
          const fadeDuration = 1.4; // seconds to fully fade out
          fadeOpacity = Math.max(0, 1 - timeSinceLand / fadeDuration);
          shadowFadeOpacity = fadeOpacity; // Shadow fades at same rate
        }

        rawStartIdx = Math.max(0, Math.min(rawStartIdx, visiblePts.length - 2));

        const startIdxInt = Math.floor(rawStartIdx);
        const startFrac = rawStartIdx - startIdxInt;

        // Store the start index for shadow projection
        startIdx = startIdxInt;

        const slicedPts = visiblePts.slice(startIdxInt);

        // Fractional tail interpolation
        if (slicedPts.length >= 2 && startFrac > 0) {
          const p0 = visiblePts[startIdxInt];
          const p1 = visiblePts[startIdxInt + 1];

          slicedPts[0] = {
            x: p0.x + (p1.x - p0.x) * startFrac,
            y: p0.y + (p1.y - p0.y) * startFrac,
          };
        }

        visiblePts = slicedPts;
      }
    }

    if (visiblePts.length < 2) return null;

    // --------------------------------------------------
    // PATH BUILDING
    // --------------------------------------------------

    let dMain = "";
    let dShadow = "";
    let shadowGradientVector = null;

    const getTailWidthFactor = (mode, progress) => {
      if (mode === "comet") {
        if (progress <= 0.4) return 1.0;
        if (progress <= 0.6) return 1.0 - ((progress - 0.4) / 0.2) * 0.2; // Changed from 0.4 to 0.2 (100% → 80%)
        return 0.8; // Changed from 0.6 to 0.8
      } else {
        // hybrid
        if (progress <= 0.5) return 1.0;
        if (progress <= 0.8) return 1.0 - ((progress - 0.5) / 0.3) * 0.2; // Changed from 0.4 to 0.2 (100% → 80%)
        return 0.8; // Changed from 0.6 to 0.8
      }
    };

    const getHeadWidthFactor = (mode, progress) => {
      if (mode === "comet") {
        if (progress <= 0.4) return 1.0;
        if (progress <= 0.6) return 1.0 - ((progress - 0.4) / 0.2) * 0.6; // Changed from 0.5 to 0.6 (100% → 40%)
        return 0.4; // Changed from 0.5 to 0.4
      } else {
        // hybrid
        if (progress <= 0.5) return 1.0;
        if (progress <= 0.8) return 1.0 - ((progress - 0.5) / 0.3) * 0.5;
        return 0.5;
      }
    };

    if (tracerMode === "comet" || tracerMode === "hybrid") {
      const headWidthFactor = getHeadWidthFactor(tracerMode, easedProgress);
      const tailWidthFactor = getTailWidthFactor(tracerMode, easedProgress);

      const startWidth = tracerWidth * headWidthFactor;
      const endWidth = tracerWidth * tailWidthFactor * 0.6;

      dMain = buildTaperedRibbonPath(
        visiblePts,
        startWidth * 0.7,
        endWidth * 0.45
      );

      if (showShadow) {
        const groundPts = projectSubsetToGroundUsingGlobal(
          visiblePts,
          startIdx,
          N,
          impactPoint.y,
          landingPoint.y
        );
        dShadow = buildTaperedRibbonPath(
          groundPts,
          startWidth * 0.6,
          endWidth * 0.2
        );

        // Create gradient vector for shadow fade
        if (groundPts.length >= 2) {
          shadowGradientVector = {
            x1: groundPts[0].x,
            y1: groundPts[0].y,
            x2: groundPts[groundPts.length - 1].x,
            y2: groundPts[groundPts.length - 1].y,
          };
        }
      }
    } else {
      // SOLID
      dMain = buildTaperedRibbonPath(
        visiblePts,
        tracerWidth,
        tracerWidth * 0.275
      );

      if (showShadow) {
        const groundPts = projectSubsetToGroundUsingGlobal(
          visiblePts,
          startIdx,
          N,
          impactPoint.y,
          landingPoint.y
        );
        dShadow = buildTaperedRibbonPath(
          groundPts,
          tracerWidth * 0.65,
          tracerWidth * 0.25
        );

        // Create gradient vector for shadow fade
        if (groundPts.length >= 2) {
          shadowGradientVector = {
            x1: groundPts[0].x,
            y1: groundPts[0].y,
            x2: groundPts[groundPts.length - 1].x,
            y2: groundPts[groundPts.length - 1].y,
          };
        }
      }
    }

    let gradientVector = null;
    if (tracerMode === "solid" && visiblePts.length >= 2) {
      gradientVector = {
        x1: visiblePts[0].x,
        y1: visiblePts[0].y,
        x2: visiblePts[visiblePts.length - 1].x,
        y2: visiblePts[visiblePts.length - 1].y,
      };
    }

    return {
      dMain,
      dShadow,
      easedProgress,
      gradientVector,
      shadowGradientVector,
      fadeOpacity,
      shadowFadeOpacity,
      visiblePts,
    };
  }, [
    impactPoint,
    landingPoint,
    controlPoint,
    currentTime,
    tracerMode,
    showShadow,
    tracerWidth,
  ]);

  const globalOpacity = useMemo(() => {
    if (!landingPoint) return 1;
    if (currentTime > landingPoint.time + 1.5) {
      // 1.5s shrink
      const fadeProgress = (currentTime - (landingPoint.time + 1.5)) / 0.5;
      return Math.max(0, 1 - fadeProgress);
    }
    return 1;
  }, [currentTime, landingPoint]);

  const targetOpacity = useMemo(() => {
    if (!showTarget) return 0;
    if (!tracerData) return 1;
    if (tracerData.easedProgress > 0.1)
      return Math.max(0, 1 - (tracerData.easedProgress - 0.4) / 0.2);
    return 1;
  }, [tracerData, showTarget]);

  const distDisplay = useMemo(() => {
    if (!impactPoint || !landingPoint) return 0;
    const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
    const effectiveTime = Math.min(currentTime, landingPoint.time);
    if (effectiveTime < impactPoint.time) return 0;
    const rawProgress = (effectiveTime - impactPoint.time) / totalDuration;
    const eased = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);
    return Math.round(eased * parseInt(yardage));
  }, [currentTime, impactPoint, landingPoint, yardage]);

  // --- RENDER ---

  if (!videoSrc) {
    return (
      <div
        className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files?.[0]) onFileChange(e.dataTransfer.files[0]);
        }}
      >
        <Link to="/">
          <button className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Home size={24} /> <span className="font-bold">Home</span>
          </button>
        </Link>

        <div
          className={`max-w-md w-full bg-zinc-900 border-2 border-dashed rounded-3xl p-10 text-center shadow-2xl transition-all ${
            isDragOver ? "border-amber-500 bg-amber-500/10" : "border-white/10"
          }`}
        >
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <Upload size={32} className="text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Shot Tracer Studio</h1>
          <p className="text-gray-400 mb-8">
            Drag & drop or select a video to start.
          </p>
          <label className="block w-full cursor-pointer group">
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                e.target.files?.[0] && onFileChange(e.target.files[0])
              }
              className="hidden"
            />
            <div className="w-full bg-amber-500 group-hover:bg-white text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Select Video
            </div>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col lg:flex-row overflow-hidden select-none"
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {/* EXPORT OVERLAY */}
      {isExporting && (
        <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            Rendering Video...
          </h2>
          <p className="text-gray-400">
            Frame processing: {Math.round(exportProgress)}%
          </p>
          <p className="text-gray-600 text-sm mt-4">Do not close this tab.</p>
        </div>
      )}

      {/* LEFT: VIDEO STUDIO */}
      <div className="flex-1 flex flex-col h-[calc(100vh)] lg:h-screen relative">
        <div className="flex-1 relative flex items-center justify-center bg-zinc-950/50 p-4">
          <div
            ref={containerRef}
            className="relative shadow-2xl shadow-black border border-white/10 rounded-lg overflow-hidden max-h-[80vh] w-auto touch-none"
            style={{
              aspectRatio: videoDims.w
                ? `${videoDims.w}/${videoDims.h}`
                : "auto",
              cursor: placingMode ? "crosshair" : "default",
            }}
            onMouseDown={handleContainerClick}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              onLoadedMetadata={onLoadedMetadata}
              className="w-full h-full object-contain pointer-events-none block"
              playsInline
              muted
              crossOrigin="anonymous"
            />

            {placingMode && !isExporting && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold px-6 py-2 rounded-full shadow-xl z-50 animate-pulse pointer-events-none border-2 border-white whitespace-nowrap">
                Click to place {placingMode === "impact" ? "Start" : "End"}{" "}
                Point
              </div>
            )}

            <motion.div
              className="absolute inset-0 pointer-events-none z-5"
              animate={{ opacity: globalOpacity }}
              transition={{ duration: 0.2 }}
            >
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full overflow-visible"
              >
                <defs>
                  <filter
                    id="tracerDropShadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx=".5"
                      dy="2.5"
                      stdDeviation="1.5"
                      floodColor="#000"
                      floodOpacity=".65"
                    />
                  </filter>
                  <mask id="startMask" maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {impactPoint && (
                      <radialGradient id="fadeGrad">
                        <stop offset="0%" stopColor="black" />
                        <stop offset="50px" stopColor="white" />
                      </radialGradient>
                    )}
                    {impactPoint && (
                      <circle
                        cx={impactPoint.x}
                        cy={impactPoint.y}
                        r="60"
                        fill="url(#fadeGrad)"
                      />
                    )}
                  </mask>

                  {/* Tracer Gradient */}
                  {tracerData &&
                    tracerMode === "solid" &&
                    tracerData.gradientVector && (
                      <linearGradient
                        id="tracerGradient"
                        x1={tracerData.gradientVector.x1}
                        y1={tracerData.gradientVector.y1}
                        x2={tracerData.gradientVector.x2}
                        y2={tracerData.gradientVector.y2}
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          offset="0%"
                          stopColor={tracerColor}
                          stopOpacity="0"
                        />
                        <stop
                          offset="10%"
                          stopColor={tracerColor}
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="30%"
                          stopColor={tracerColor}
                          stopOpacity="0.5"
                        />
                        <stop
                          offset="100%"
                          stopColor={tracerColor}
                          stopOpacity={tracerOpacity}
                        />
                      </linearGradient>
                    )}

                  {/* Shadow Gradient */}
                  {tracerData && tracerData.shadowGradientVector && (
                    <linearGradient
                      id="shadowGradient"
                      x1={tracerData.shadowGradientVector.x1}
                      y1={tracerData.shadowGradientVector.y1}
                      x2={tracerData.shadowGradientVector.x2}
                      y2={tracerData.shadowGradientVector.y2}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#000" stopOpacity="0" />
                      <stop offset="30%" stopColor="#000" stopOpacity="0.2" />
                      <stop offset="60%" stopColor="#000" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
                    </linearGradient>
                  )}
                </defs>

                {tracerData && (
                  <>
                    {showShadow && (
                      <path
                        d={tracerData.dShadow}
                        fill={
                          tracerMode === "solid"
                            ? "url(#shadowGradient)"
                            : "#000"
                        }
                        fillOpacity={
                          tracerMode === "solid"
                            ? 1
                            : 0.25 * tracerData.shadowFadeOpacity
                        }
                        opacity={
                          tracerMode === "solid"
                            ? 1
                            : tracerData.shadowFadeOpacity
                        }
                      />
                    )}
                    <path
                      d={tracerData.dMain}
                      fill={
                        tracerMode === "solid"
                          ? "url(#tracerGradient)"
                          : tracerColor
                      }
                      fillOpacity={
                        tracerMode === "solid"
                          ? 1
                          : tracerOpacity * tracerData.fadeOpacity
                      }
                      filter="url(#tracerDropShadow)"
                      mask="url(#startMask)"
                    />
                  </>
                )}
              </svg>

              <DraggableWidget
                id="distance"
                x={widgetPos.distance.x}
                y={widgetPos.distance.y}
                visible={showDistance && impactPoint && landingPoint}
                scale={distanceScale}
                onDragStart={(e: any) =>
                  startDrag(e, "distance", widgetPos.distance)
                }
                setWidgetSize={updateWidgetSize}
              >
                <div
                  style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)" }}
                  className="bg-[#165B94] border-[2px] border-white/85 rounded-xl px-4 py-2 w-[90px] h-[55px] text-center backdrop-blur-sm pointer-events-auto flex items-baseline justify-center"
                >
                  <span
                    style={{
                      textShadow: "0px 1px 1px rgba(0, 0, 0, 1)",
                    }}
                    className="text-2xl font-medium text-white leading-none drop-shadow-md mt-1"
                  >
                    {distDisplay}
                  </span>
                  <span
                    style={{
                      textShadow: "0px 1px 1px rgba(0, 0, 0, 1)",
                    }}
                    className="text-[16px] font-bold text-white-900"
                  >
                    {unit}
                  </span>
                </div>
              </DraggableWidget>

              <DraggableWidget
                id="holeInfo"
                x={widgetPos.holeInfo.x}
                y={widgetPos.holeInfo.y}
                visible={showHoleInfo}
                scale={holeInfoScale}
                onDragStart={(e: any) =>
                  startDrag(e, "holeInfo", widgetPos.holeInfo)
                }
                setWidgetSize={updateWidgetSize}
              >
                {showPlayerInfo ? (
                  // PRO TV GRAPHIC
                  <div className="pointer-events-auto">
                    <PlayerInfoGraphic
                      data={playerData}
                      holeData={holeData}
                      unit={unit}
                    />
                  </div>
                ) : (
                  // SIMPLE HOLE INFO
                  <div
                    style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.6)" }}
                    className="flex flex-col w-[70px] rounded-lg overflow-hidden border border-white/20 font-sans pointer-events-auto"
                  >
                    <div className="bg-[#165B94] h-[50px] flex items-center justify-center px-2 relative">
                      <span
                        style={{
                          textShadow: "0px 1.5px 1.5px rgba(0, 0, 0, 1)",
                        }}
                        className="text-white font-bold text-3xl"
                      >
                        {holeData.num}
                      </span>
                    </div>

                    <div className="h-[3px] bg-amber-500 w-full" />

                    <div className="bg-white px-2  py-2 pt-[7px] flex flex-col items-center">
                      <span className="text-gray-700 font-bold text-md">
                        Par {holeData.par}
                      </span>

                      <span className="text-gray-500 font-bold text-[14px] pt-[.5px]">
                        {holeData.dist}
                        <span className="text-[10px] ml-[.5px]">{unit}</span>
                      </span>
                    </div>
                  </div>
                )}
              </DraggableWidget>
            </motion.div>

            <motion.div
              className="absolute inset-0 pointer-events-none z-1"
              animate={{ opacity: globalOpacity }}
              transition={{ duration: 0.2 }}
            >
              <DraggableWidget
                id="target"
                x={widgetPos.target.x}
                y={widgetPos.target.y}
                visible={showTarget}
                scale={targetScale}
                onDragStart={(e: any) =>
                  startDrag(e, "target", widgetPos.target)
                }
                setWidgetSize={updateWidgetSize}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: targetOpacity }}
                  transition={{
                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    opacity: { duration: 0.3 },
                  }}
                  className="filter drop-shadow-lg pointer-events-auto"
                >
                  <img style={{ width: 35 }} src={TargetImg} alt="Target" />
                </motion.div>
              </DraggableWidget>
            </motion.div>

            {/* CONTROL POINTS (Hidden during export) */}
            {!isExporting && impactPoint && (
              <ControlNode
                x={impactPoint.x}
                y={impactPoint.y}
                color="#ef444450"
                label="Start"
                onDragStart={(e: any) => startDrag(e, "impact", impactPoint)}
              />
            )}
            {!isExporting && landingPoint && (
              <ControlNode
                x={landingPoint.x}
                y={landingPoint.y}
                color="#3b83f650"
                label="End"
                onDragStart={(e: any) => startDrag(e, "landing", landingPoint)}
              />
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="h-24 bg-black border-t border-white/10 px-4 md:px-8 flex items-center gap-6 z-20 shrink-0">
          <button
            onClick={togglePlay}
            disabled={isExporting}
            className={`w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors shrink-0 ${
              isExporting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {playing ? (
              <Pause fill="currentColor" size={20} />
            ) : (
              <Play fill="currentColor" size={20} className="ml-1" />
            )}
          </button>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => skipFrame("back")}
              disabled={isExporting}
              className="p-2 hover:text-amber-500 text-gray-400 disabled:opacity-50"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => skipFrame("fwd")}
              disabled={isExporting}
              className="p-2 hover:text-amber-500 text-gray-400 disabled:opacity-50"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.01}
              value={currentTime}
              disabled={isExporting}
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                setCurrentTime(t);
                if (videoRef.current) videoRef.current.currentTime = t;
              }}
              onKeyDown={(e) => {
                if (
                  e.code === "Space" ||
                  e.code === "ArrowUp" ||
                  e.code === "ArrowDown"
                ) {
                  e.preventDefault();
                  togglePlay();
                } else if (e.code === "ArrowLeft") {
                  e.preventDefault();
                  skipFrame("back");
                } else if (e.code === "ArrowRight") {
                  e.preventDefault();
                  skipFrame("fwd");
                }
              }}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* RIGHT: TOOLS SIDEBAR */}
      <div className="w-full lg:w-80 bg-[#0a0a0a] border-l border-white/10 flex flex-col h-[40vh] lg:h-screen overflow-y-scroll shrink-0 z-99">
        <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-999">
          <div className="flex items-center gap-2">
            <Link to="/">
              <button className="hover:bg-white/10 p-2 rounded transition-colors">
                <Home size={18} className="text-amber-500" />
              </button>
            </Link>
            <h2 className="text-base font-bold text-white tracking-wide">
              Studio Tools
            </h2>
          </div>
          <button
            onClick={() => setVideoSrc(null)}
            className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {controlPoint && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Gamepad2 size={12} /> Adjust Curve
              </div>
              <VirtualJoystick
                onMove={(dx, dy) => {
                  if (controlPoint) {
                    setControlPoint({
                      x: controlPoint.x + dx,
                      y: controlPoint.y + dy,
                    });
                  }
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setPlacingMode("impact");
                setImpactPoint(null);
              }}
              className={`py-3 rounded-lg border text-xs font-bold transition-all ${
                placingMode === "impact"
                  ? "bg-amber-500 border-amber-500 text-black"
                  : "bg-zinc-900 border-white/10 text-gray-300"
              }`}
            >
              Set Start
            </button>
            <button
              onClick={() => {
                setPlacingMode("landing");
                setLandingPoint(null);
              }}
              className={`py-3 rounded-lg border text-xs font-bold transition-all ${
                placingMode === "landing"
                  ? "bg-amber-500 border-amber-500 text-black"
                  : "bg-zinc-900 border-white/10 text-gray-300"
              }`}
            >
              Set End
            </button>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="space-y-4">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <SiArchicad size={12} className="text-amber-500" />
              <span> Tracer Style</span>
            </div>
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
              {["solid", "comet", "hybrid"].map((m) => (
                <button
                  key={m}
                  onClick={() => setTracerMode(m as any)}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
                    tracerMode === m
                      ? "bg-amber-500 text-black"
                      : "text-gray-500"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-8 mb-8">
              {/* Custom color (color wheel) */}
              <div className="relative w-7 h-7 rounded-full cursor-pointer">
                {/* Color input MUST be on top */}
                <input
                  type="color"
                  value={tracerColor}
                  onChange={(e) => setTracerColor(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Visual layer */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center relative pointer-events-none">
                  {/* Color wheel */}
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background:
                        "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                    }}
                  />

                  {/* Center dot */}
                  <div
                    className="absolute w-5 h-5 rounded-full border-4"
                    style={{
                      backgroundColor: tracerColor,
                      boxShadow: `0 0 4px ${tracerColor}`,
                      borderColor: "black",
                    }}
                  />
                </div>
              </div>

              {/* Preset colors */}
              {["#ff0000", "#fe9a00", "#165B94", "#ffffff"].map((c) => (
                <button
                  key={c}
                  onClick={() => setTracerColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    tracerColor === c
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Opacity & Width Sliders */}
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Opacity</span>
                <span>{Math.round(tracerOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={tracerOpacity}
                onChange={(e) => setTracerOpacity(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Width</span>
                <span>{tracerWidth}px</span>
              </div>
              <input
                type="range"
                min={8}
                max={20}
                value={tracerWidth}
                onChange={(e) => setTracerWidth(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
              />
            </div>
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* WIDGETS CONFIG */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Graphics</span>
            </div>
            {[
              {
                label: "Target",
                icon: Target,
                val: showTarget,
                set: setShowTarget,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-white/5 flex-col gap-3"
              >
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-300 mr-6">
                    <item.icon size={14} className="text-amber-500" />{" "}
                    {item.label}
                  </div>

                  <button
                    onClick={() => item.set(!item.val)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ml-6 ${
                      item.val
                        ? "bg-amber-500 border-amber-500"
                        : "border-gray-600 bg-transparent"
                    }`}
                  >
                    {item.val && (
                      <Check size={10} className="text-black" strokeWidth={4} />
                    )}
                  </button>
                </div>

                {showTarget && (
                  <div className="pb-3 animate-in slide-in-from-top-2 w-full border-t border-white/10">
                    {/* Target widget scale slider */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Size</span>
                        <span className="text-[9px]">
                          {targetScale.toFixed(1)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.3}
                        max={2.0}
                        step={0.1}
                        value={targetScale}
                        onChange={(e) => setTargetScale(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg accent-amber-500 mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setShowDistance(!showDistance)}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <Ruler size={14} className="text-amber-500" /> Distance
                </div>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    showDistance
                      ? "bg-amber-500 border-amber-500"
                      : "border-gray-600 bg-transparent"
                  }`}
                >
                  {showDistance && (
                    <Check size={10} className="text-black" strokeWidth={4} />
                  )}
                </div>
              </div>
              {showDistance && (
                <div className="px-3 pb-3 flex gap-2 animate-in slide-in-from-top-2 align-center justify-center">
                  <div className="flex gap-2 items-end mr-2">
                    <input
                      value={yardage}
                      onChange={(e) => setYardage(e.target.value)}
                      className="bg-black border border-white/20 rounded px-2 py-1.5 text-xs text-white w-16 h-8"
                      placeholder="Distance"
                    />
                    <button
                      onClick={() => setUnit(unit === "yd" ? "m" : "yd")}
                      className="bg-[#165B94] px-2 py-1 rounded text-[10px] font-bold border border-white/20 w-10 h-8"
                    >
                      {unit}
                    </button>
                  </div>

                  {/* Distance widget scale slider */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>Size</span>
                      <span className="text-[9px]">
                        {distanceScale.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      value={distanceScale}
                      onChange={(e) => setDistanceScale(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg accent-amber-500 mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setShowHoleInfo(!showHoleInfo)}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <Info size={14} className="text-amber-500" /> Hole Info
                </div>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    showHoleInfo
                      ? "bg-amber-500 border-amber-500"
                      : "border-gray-600 bg-transparent"
                  }`}
                >
                  {showHoleInfo && (
                    <Check size={10} className="text-black" strokeWidth={4} />
                  )}
                </div>
              </div>
              {showHoleInfo && (
                <div className="px-3 pb-3 space-y-3 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      value={holeData.num}
                      onChange={(e) =>
                        setHoleData({ ...holeData, num: e.target.value })
                      }
                      placeholder="#"
                      className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center col-span-1"
                    />
                    <input
                      value={holeData.par}
                      onChange={(e) =>
                        setHoleData({ ...holeData, par: e.target.value })
                      }
                      placeholder="Par"
                      className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center col-span-1"
                    />
                    <input
                      value={holeData.dist}
                      onChange={(e) =>
                        setHoleData({ ...holeData, dist: e.target.value })
                      }
                      placeholder="Dist"
                      className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center flex-1"
                    />
                    <button
                      onClick={() => setUnit(unit === "yd" ? "m" : "yd")}
                      className="bg-[#165B94] px-1 rounded text-[9px] font-bold border border-white/20 w-8"
                    >
                      {unit}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                        <UserRoundPen size={14} className="text-amber-500" />{" "}
                        Player Info
                      </div>
                      <button
                        onClick={() => setShowPlayerInfo(!showPlayerInfo)}
                        className={`w-8 h-4 rounded-full relative transition-colors ${
                          showPlayerInfo ? "bg-amber-500" : "bg-gray-700"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                            showPlayerInfo ? "left-4.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    {showPlayerInfo && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10">
                          <User size={12} className="text-gray-500" />
                          <input
                            value={playerData.name}
                            onChange={(e) =>
                              setPlayerData({
                                ...playerData,
                                name: e.target.value,
                              })
                            }
                            className="bg-transparent text-xs text-white w-full outline-none"
                            placeholder="Player Name"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10 flex-1">
                            <Trophy size={12} className="text-gray-500" />
                            <input
                              value={playerData.score}
                              onChange={(e) =>
                                setPlayerData({
                                  ...playerData,
                                  score: e.target.value,
                                })
                              }
                              className="bg-transparent text-xs text-white w-full outline-none"
                              placeholder="Score"
                            />
                          </div>
                          <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10 flex-1">
                            <Hash size={12} className="text-gray-500" />
                            <input
                              value={playerData.shot}
                              onChange={(e) =>
                                setPlayerData({
                                  ...playerData,
                                  shot: e.target.value,
                                })
                              }
                              className="bg-transparent text-xs text-white w-full outline-none"
                              placeholder="Shot"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>Size</span>
                      <span className="text-[9px]">
                        {holeInfoScale.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      value={holeInfoScale}
                      onChange={(e) => setHoleInfoScale(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg accent-amber-500 mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {[
              {
                label: "Shadow",
                icon: MousePointer2,
                val: showShadow,
                set: setShowShadow,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-white/5 flex-col gap-3"
              >
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-300 mr-6">
                    <item.icon size={14} className="text-amber-500" />{" "}
                    {item.label}
                  </div>

                  <button
                    onClick={() => item.set(!item.val)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ml-6 ${
                      item.val
                        ? "bg-amber-500 border-amber-500"
                        : "border-gray-600 bg-transparent"
                    }`}
                  >
                    {item.val && (
                      <Check size={10} className="text-black" strokeWidth={4} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-white/5" />

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-[#165B94] bg-amber-500 hover:bg-white text-black font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              "Rendering Video..."
            ) : (
              <>
                <Download size={18} /> Export Video
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
