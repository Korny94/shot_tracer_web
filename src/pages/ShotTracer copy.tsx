// ------------------------------------------ WITHOUT FADE OPACITY GRADIENT ----------------------------------------------------

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import { motion } from "framer-motion";
// import {
//   Upload,
//   Play,
//   Pause,
//   Trash2,
//   Target,
//   Ruler,
//   Info,
//   Settings2,
//   ChevronRight,
//   ChevronLeft,
//   Check,
//   MousePointer2,
//   Move,
// } from "lucide-react";
// import TargetImg from "../assets/target.png";

// // --- MATH & GEOMETRY ENGINE ---

// const getRollerCoasterPoint = (
//   p0: { x: number; y: number },
//   c: { x: number; y: number },
//   p1: { x: number; y: number },
//   t: number
// ) => {
//   // Calculate the CENTER between p0 and p1
//   const centerX = (p0.x + p1.x) / 2;

//   // Calculate how far left/right the user moved from center
//   const xOffset = c.x - centerX;

//   // Calculate the 85% point from the ORIGINAL p0 and p1 (not shifted)
//   const apexX = p0.x + (p1.x - p0.x) * 0.85;

//   // Apply the user's left/right adjustment to the apex
//   const adjustedApexX = apexX + xOffset;

//   // Use this as the control point X, keeping the same curve shape
//   const forcedControl = {
//     x: adjustedApexX, // Apex at 85% + user's left/right adjustment
//     y: c.y - 300, // Same height adjustment
//   };

//   const u = 1 - t;
//   return {
//     x: u * u * p0.x + 2 * u * t * forcedControl.x + t * t * p1.x,
//     y: u * u * p0.y + 2 * u * t * forcedControl.y + t * t * p1.y,
//   };
// };

// const sampleRollerCoaster = (P0: any, C: any, P1: any, N = 200) => {
//   const pts = [];
//   for (let i = 0; i <= N; i++) {
//     pts.push(getRollerCoasterPoint(P0, C, P1, i / N));
//   }
//   return pts;
// };

// // Exact Shadow Projection from React Native code
// const projectSubsetToGroundUsingGlobal = (
//   subsetPts: { x: number; y: number }[],
//   startIndexInFull: number,
//   fullCount: number,
//   y0: number,
//   y1: number
// ) => {
//   if (subsetPts.length < 2 || fullCount <= 0) return subsetPts;

//   const out = new Array(subsetPts.length);
//   for (let i = 0; i < subsetPts.length; i++) {
//     const globalIdx = startIndexInFull + i;
//     const tGlobal = globalIdx / fullCount;
//     // Ground line linear interpolation based on global index progress
//     const y = y0 + (y1 - y0) * tGlobal;
//     out[i] = { x: subsetPts[i].x, y };
//   }
//   return out;
// };

// const buildTaperedRibbonPath = (pts: any[], w0: number, w1: number) => {
//   if (pts.length < 2) return "";

//   const N = pts.length;
//   const left = [];
//   const right = [];
//   const lens = [0];

//   for (let i = 1; i < N; i++) {
//     const dx = pts[i].x - pts[i - 1].x;
//     const dy = pts[i].y - pts[i - 1].y;
//     lens[i] = lens[i - 1] + Math.hypot(dx, dy);
//   }
//   const totalLen = Math.max(1e-6, lens[N - 1]);

//   for (let i = 0; i < N; i++) {
//     const i0 = Math.max(0, i - 1);
//     const i1 = Math.min(N - 1, i + 1);
//     const tx = pts[i1].x - pts[i0].x;
//     const ty = pts[i1].y - pts[i0].y;
//     const tl = Math.hypot(tx, ty) || 1;
//     const nx = -ty / tl;
//     const ny = tx / tl;

//     const t = lens[i] / totalLen;
//     // Linear width interpolation
//     const w = w0 + (w1 - w0) * t;
//     const hx = w * 0.5 * nx;
//     const hy = w * 0.5 * ny;

//     left.push({ x: pts[i].x + hx, y: pts[i].y + hy });
//     right.push({ x: pts[i].x - hx, y: pts[i].y - hy });
//   }

//   return [
//     `M${left[0].x},${left[0].y}`,
//     ...left.slice(1).map((p) => `L${p.x},${p.y}`),
//     ...right
//       .slice()
//       .reverse()
//       .map((p) => `L${p.x},${p.y}`),
//     "Z",
//   ].join(" ");
// };

// // --- SUB-COMPONENTS ---

// const ControlNode = ({ x, y, color, label, onDragStart }: any) => (
//   <div
//     onPointerDown={(e) => onDragStart(e)}
//     style={{ left: x, top: y }}
//     className="absolute -ml-3 -mt-3 z-30 cursor-grab active:cursor-grabbing group touch-none"
//   >
//     <div
//       className="w-6 h-6 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform group-hover:scale-125"
//       style={{ backgroundColor: color }}
//     >
//       <div className="w-1.5 h-1.5 bg-white rounded-full" />
//     </div>
//     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 z-40">
//       {label}
//     </div>
//   </div>
// );

// const DraggableWidget = React.memo(
//   ({ children, x, y, visible, scale, onDragStart, id, setWidgetSize }: any) => {
//     const ref = useRef<HTMLDivElement>(null);
//     const prevSize = useRef({ w: 0, h: 0 });

//     useEffect(() => {
//       if (ref.current && visible) {
//         const { offsetWidth: w, offsetHeight: h } = ref.current;

//         // Only call setWidgetSize if size actually changed
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [visible, id, setWidgetSize]); // Removed scale from dependencies

//     // Also handle scale changes separately
//     useEffect(() => {
//       if (ref.current && visible) {
//         // When scale changes, we need to remeasure
//         const { offsetWidth: w, offsetHeight: h } = ref.current;
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [scale, visible, id, setWidgetSize]);

//     if (!visible) return null;

//     return (
//       <div
//         ref={ref}
//         onPointerDown={(e) => onDragStart(e)}
//         style={{
//           left: x,
//           top: y,
//           transform: `scale(${scale})`,
//           transformOrigin: "top left",
//         }}
//         className="absolute z-20 cursor-grab active:cursor-grabbing hover:ring-1 ring-white/30 rounded-lg touch-none select-none"
//       >
//         {children}
//       </div>
//     );
//   }
// );

// const VirtualJoystick = ({
//   onMove,
// }: {
//   onMove: (dx: number, dy: number) => void;
// }) => {
//   const stickRef = useRef(null);
//   return (
//     <div className="w-full aspect-square bg-zinc-900 rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
//       <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
//         <div className="border-r border-b border-white"></div>
//         <div className="border-b border-white"></div>
//         <div className="border-r border-white"></div>
//         <div className=""></div>
//       </div>
//       <motion.div
//         ref={stickRef}
//         drag
//         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//         dragElastic={0.1}
//         onDrag={(_, info) => onMove(info.delta.x * 3, info.delta.y * 3)}
//         className="w-12 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 cursor-move active:cursor-grabbing flex items-center justify-center"
//       >
//         <Move size={20} className="text-black" />
//       </motion.div>
//       <span className="absolute bottom-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none">
//         Curve Adjust
//       </span>
//     </div>
//   );
// };

// export default function ShotTracerWeb() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [videoSrc, setVideoSrc] = useState<string | null>(null);
//   const [videoDims, setVideoDims] = useState({ w: 0, h: 0 });

//   // Playback
//   const [playing, setPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   // Geometry
//   const [impactPoint, setImpactPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [landingPoint, setLandingPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [controlPoint, setControlPoint] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   // Widget Positions & Sizes
//   const [widgetPos, setWidgetPos] = useState({
//     distance: { x: 20, y: 20 },
//     target: { x: 150, y: 150 },
//     holeInfo: { x: 20, y: 100 },
//   });
//   const [widgetSizes, setWidgetSizes] = useState({
//     distance: { w: 100, h: 50 },
//     target: { w: 60, h: 60 },
//     holeInfo: { w: 80, h: 80 },
//   });

//   // Settings
//   const [placingMode, setPlacingMode] = useState<"impact" | "landing" | null>(
//     null
//   );
//   const [tracerMode, setTracerMode] = useState<"solid" | "comet" | "hybrid">(
//     "solid"
//   );
//   const [tracerColor, setTracerColor] = useState("#ff0000");
//   const [tracerOpacity, setTracerOpacity] = useState(0.8);

//   const [tracerWidth, setTracerWidth] = useState(12);
//   const [widgetScale, setWidgetScale] = useState(1);
//   const [showShadow, setShowShadow] = useState(true);
//   const [showTarget, setShowTarget] = useState(false);
//   const [showDistance, setShowDistance] = useState(true);
//   const [showHoleInfo, setShowHoleInfo] = useState(false);

//   // Data
//   const [yardage, setYardage] = useState("150");
//   const [unit, setUnit] = useState<"yd" | "m">("yd");
//   const [holeData, setHoleData] = useState({ num: "1", par: "4", dist: "420" });

//   // --- DRAG LOGIC ---
//   const draggingRef = useRef<{
//     type: string;
//     startX: number;
//     startY: number;
//     initialPos: { x: number; y: number };
//   } | null>(null);

//   const startDrag = (
//     e: React.PointerEvent,
//     type: string,
//     currentPos: { x: number; y: number }
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const target = e.currentTarget as HTMLElement;
//     target.setPointerCapture(e.pointerId);
//     draggingRef.current = {
//       type,
//       startX: e.clientX,
//       startY: e.clientY,
//       initialPos: { ...currentPos },
//     };
//   };

//   const onPointerMove = (e: React.PointerEvent) => {
//     if (!draggingRef.current || !containerRef.current) return;

//     const { type, startX, startY, initialPos } = draggingRef.current;
//     const deltaX = e.clientX - startX;
//     const deltaY = e.clientY - startY;
//     let newX = initialPos.x + deltaX;
//     let newY = initialPos.y + deltaY;

//     // Strict Clamping
//     const rect = containerRef.current.getBoundingClientRect();

//     // Determine object size for right/bottom clamping
//     let objW = 0,
//       objH = 0;

//     if (["distance", "target", "holeInfo"].includes(type)) {
//       const size = widgetSizes[type as keyof typeof widgetSizes];
//       objW = size.w * widgetScale;
//       objH = size.h * widgetScale;
//     } else {
//       // Control points are small
//       objW = 0;
//       objH = 0;
//     }

//     newX = Math.max(0, Math.min(rect.width - objW, newX));
//     newY = Math.max(0, Math.min(rect.height - objH, newY));

//     if (type === "impact" && impactPoint)
//       setImpactPoint({ ...impactPoint, x: newX, y: newY });
//     else if (type === "landing" && landingPoint)
//       setLandingPoint({ ...landingPoint, x: newX, y: newY });
//     else if (type === "control" && controlPoint)
//       setControlPoint({ x: newX, y: newY });
//     else if (["distance", "target", "holeInfo"].includes(type)) {
//       setWidgetPos((prev) => ({ ...prev, [type]: { x: newX, y: newY } }));
//     }
//   };

//   const onPointerUp = (e: React.PointerEvent) => {
//     if (draggingRef.current) {
//       draggingRef.current = null;
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     }
//   };

//   const updateWidgetSize = useCallback((id: string, w: number, h: number) => {
//     setWidgetSizes((prev) => {
//       // Only update if the size actually changed
//       if (prev[id]?.w === w && prev[id]?.h === h) {
//         return prev;
//       }
//       return { ...prev, [id]: { w, h } };
//     });
//   }, []);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setVideoSrc(url);
//       setImpactPoint(null);
//       setLandingPoint(null);
//       setControlPoint(null);
//       setPlaying(false);
//       setCurrentTime(0);
//     }
//   };

//   const onLoadedMetadata = () => {
//     if (videoRef.current && containerRef.current) {
//       setDuration(videoRef.current.duration);
//       setVideoDims({
//         w: videoRef.current.videoWidth,
//         h: videoRef.current.videoHeight,
//       });
//     }
//   };

//   useEffect(() => {
//     let handle: number;
//     const loop = () => {
//       if (videoRef.current && !videoRef.current.paused) {
//         setCurrentTime(videoRef.current.currentTime);
//         if (videoRef.current.ended) setPlaying(false);
//       }
//       handle = requestAnimationFrame(loop);
//     };
//     handle = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(handle);
//   }, []);

//   const togglePlay = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     setPlaying((prev) => {
//       if (prev) {
//         video.pause();
//       } else {
//         if (video.currentTime >= duration) {
//           video.currentTime = 0;
//         }
//         video.play();
//       }
//       return !prev;
//     });
//   }, [duration]);

//   const skipFrame = useCallback(
//     (direction: "fwd" | "back") => {
//       const video = videoRef.current;
//       if (!video) return;

//       const frameTime = 1 / 30;

//       const newTime =
//         direction === "fwd"
//           ? Math.min(duration, video.currentTime + frameTime)
//           : Math.max(0, video.currentTime - frameTime);

//       video.currentTime = newTime;
//       setCurrentTime(newTime);
//     },
//     [duration]
//   );

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
//         return;

//       switch (e.code) {
//         case "Space":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowDown":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowLeft":
//           e.preventDefault();
//           skipFrame("back");
//           break;
//         case "ArrowRight":
//           e.preventDefault();
//           skipFrame("fwd");
//           break;
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [togglePlay, skipFrame]);

//   const handleContainerClick = (e: React.MouseEvent) => {
//     if (!placingMode || !containerRef.current || !videoRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const time = videoRef.current.currentTime;
//     const pt = { x, y, time };

//     if (placingMode === "impact") {
//       setImpactPoint(pt);
//       if (landingPoint) {
//         setControlPoint({
//           x: (x + landingPoint.x) / 2,
//           y: Math.min(y, landingPoint.y) - rect.height * 0.3,
//         });
//       }
//     } else {
//       setLandingPoint(pt);
//       if (impactPoint) {
//         setControlPoint({
//           x: (impactPoint.x + x) / 2,
//           y: Math.min(impactPoint.y, y) - rect.height * 0.3,
//         });
//       }
//     }
//     setPlacingMode(null);
//   };

//   const tracerData = useMemo(() => {
//     if (!impactPoint || !landingPoint) return null;

//     const cp = controlPoint || {
//       x: (impactPoint.x + landingPoint.x) / 2,
//       y: Math.min(impactPoint.y, landingPoint.y) - 200,
//     };

//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const rawProgress = (currentTime - impactPoint.time) / totalDuration;
//     const easedProgress = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);

//     if (easedProgress <= 0) return null;

//     const N = 240;
//     const floatIdx = easedProgress * N;

//     // USE THE NEW ROLLER COASTER CURVE HERE
//     const fullCurve = sampleRollerCoaster(impactPoint, cp, landingPoint, N);

//     // Basic visible slice
//     const endIdx = Math.floor(floatIdx);
//     let visiblePts = fullCurve.slice(0, endIdx + 1);

//     // Sub-pixel tip accuracy
//     if (easedProgress < 1) {
//       // USE THE NEW ROLLER COASTER POINT FUNCTION HERE
//       const exactTip = getRollerCoasterPoint(
//         impactPoint,
//         cp,
//         landingPoint,
//         easedProgress
//       );
//       visiblePts.push(exactTip);
//     }

//     const isLanded = currentTime > landingPoint.time;
//     let startIdx = 0;

//     // --- MODE LOGIC ---

//     if (tracerMode === "comet") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.3); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx - 15);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     } else if (tracerMode === "hybrid") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.6); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     }

//     if (visiblePts.length < 2) return null;

//     // Generate Path - DIFFERENT APPROACH FOR COMET MODE
//     let dMain = "";
//     let dShadow = "";

//     if (tracerMode === "comet" || tracerMode === "hybrid") {
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth * 0.5,
//         tracerWidth * 0.3
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         // Shadow also uses constant width (80% of main width)
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.5,
//           tracerWidth * 0.3
//         );
//       }
//     } else {
//       // SOLID Use tapered width
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth,
//         tracerWidth * 0.275
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.8,
//           tracerWidth * 0.3
//         );
//       }
//     }

//     return { dMain, dShadow, easedProgress };
//   }, [
//     impactPoint,
//     landingPoint,
//     controlPoint,
//     currentTime,
//     tracerMode,
//     showShadow,
//     tracerWidth,
//   ]);

//   const globalOpacity = useMemo(() => {
//     if (!landingPoint) return 1;
//     if (currentTime > landingPoint.time + 1.0) {
//       const fadeProgress = (currentTime - (landingPoint.time + 1.0)) / 0.5;
//       return Math.max(0, 1 - fadeProgress);
//     }
//     return 1;
//   }, [currentTime, landingPoint]);

//   const targetOpacity = useMemo(() => {
//     if (!showTarget) return 0;
//     if (!tracerData) return 1; // Show initially
//     if (tracerData.easedProgress > 0.1) {
//       return Math.max(0, 1 - (tracerData.easedProgress - 0.4) / 0.2);
//     }
//     return 1;
//   }, [tracerData, showTarget]);

//   // Distance: Don't reset
//   const distDisplay = useMemo(() => {
//     if (!impactPoint || !landingPoint) return 0;
//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const effectiveTime = Math.min(currentTime, landingPoint.time);

//     if (effectiveTime < impactPoint.time) return 0;

//     const rawProgress = (effectiveTime - impactPoint.time) / totalDuration;
//     const eased = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);
//     return Math.round(eased * parseInt(yardage));
//   }, [currentTime, impactPoint, landingPoint, yardage]);

//   // --- RENDER ---

//   if (!videoSrc) {
//     return (
//       <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
//         <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
//           <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
//             <Upload size={32} className="text-amber-500" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Shot Tracer Studio</h1>
//           <p className="text-gray-400 mb-8">Upload a video to start editing.</p>
//           <label className="block w-full cursor-pointer group">
//             <input
//               type="file"
//               accept="video/*"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//             <div className="w-full bg-amber-500 group-hover:bg-white text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
//               Select Video
//             </div>
//           </label>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col lg:flex-row overflow-hidden select-none"
//       onPointerUp={onPointerUp}
//       onPointerMove={onPointerMove}
//     >
//       {/* === LEFT AREA: VIDEO STUDIO === */}
//       <div className="flex-1 flex flex-col h-[calc(100vh)] lg:h-screen relative">
//         <div className="flex-1 relative flex items-center justify-center bg-zinc-950/50 p-4">
//           <div
//             ref={containerRef}
//             className="relative shadow-2xl shadow-black border border-white/10 rounded-lg overflow-hidden max-h-[80vh] w-auto touch-none"
//             style={{
//               aspectRatio: videoDims.w
//                 ? `${videoDims.w}/${videoDims.h}`
//                 : "auto",
//               cursor: placingMode ? "crosshair" : "default",
//             }}
//             onMouseDown={handleContainerClick}
//           >
//             <video
//               ref={videoRef}
//               src={videoSrc}
//               onLoadedMetadata={onLoadedMetadata}
//               className="w-full h-full object-contain pointer-events-none block"
//               playsInline
//               muted
//             />

//             {placingMode && (
//               <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold px-6 py-2 rounded-full shadow-xl z-50 animate-pulse pointer-events-none border-2 border-white whitespace-nowrap">
//                 Click to place {placingMode === "impact" ? "Start" : "End"}{" "}
//                 Point
//               </div>
//             )}

//             <motion.div
//               className="absolute inset-0 pointer-events-none"
//               animate={{ opacity: globalOpacity }}
//               transition={{ duration: 0.2 }}
//             >
//               <svg className="absolute inset-0 w-full h-full overflow-visible z-22">
//                 <defs>
//                   <filter
//                     id="tracerDropShadow"
//                     x="-50%"
//                     y="-50%"
//                     width="200%"
//                     height="200%"
//                   >
//                     <feDropShadow
//                       dx=".5"
//                       dy="2.5"
//                       stdDeviation="1.5"
//                       floodColor="#000"
//                       floodOpacity=".65"
//                     />
//                   </filter>
//                 </defs>

//                 {tracerData && (
//                   <>
//                     {showShadow && (
//                       <path
//                         d={tracerData.dShadow}
//                         fill="black"
//                         opacity="0.25"
//                       />
//                     )}
//                     <path
//                       d={tracerData.dMain}
//                       fill={tracerColor}
//                       fillOpacity={tracerOpacity}
//                       filter="url(#tracerDropShadow)"
//                     />
//                   </>
//                 )}
//               </svg>

//               {/* Widgets */}
//               <DraggableWidget
//                 id="distance"
//                 x={widgetPos.distance.x}
//                 y={widgetPos.distance.y}
//                 visible={showDistance && impactPoint && landingPoint}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "distance", widgetPos.distance)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{
//                     boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)",
//                   }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl px-4 py-2 w-[90px] h-[55px] text-center backdrop-blur-sm pointer-events-auto flex items-baseline justify-center"
//                 >
//                   <span className="text-2xl font-medium text-white leading-none drop-shadow-md mt-1">
//                     {distDisplay}
//                   </span>
//                   <span className="text-[16px] font-bold text-white-900">
//                     {unit}
//                   </span>
//                 </div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="target"
//                 x={widgetPos.target.x}
//                 y={widgetPos.target.y}
//                 visible={showTarget}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "target", widgetPos.target)
//                 }
//                 setWidgetSize={updateWidgetSize}
//                 style={{ zIndex: 1 }}
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0], opacity: targetOpacity }}
//                   transition={{
//                     y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
//                     opacity: { duration: 0.3 },
//                   }}
//                   className="filter drop-shadow-lg pointer-events-auto"
//                 >
//                   {/* <Target size={60} className="text-red-500" strokeWidth={2} /> */}
//                   <img
//                     style={{
//                       width: 35,
//                     }}
//                     src={TargetImg}
//                     alt="Target"
//                   />
//                 </motion.div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="holeInfo"
//                 x={widgetPos.holeInfo.x}
//                 y={widgetPos.holeInfo.y}
//                 visible={showHoleInfo}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "holeInfo", widgetPos.holeInfo)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{
//                     boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)",
//                   }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl p-2 w-[75px] flex flex-col items-center backdrop-blur-sm pointer-events-auto"
//                 >
//                   <div
//                     style={{
//                       boxShadow: "0px 1.5px 1.5px 0px rgba(0,0,0,.9)",
//                     }}
//                     className="bg-white rounded-full w-12.5 h-12.5 flex items-center justify-center mb-1 shadow-inner border border-gray-200"
//                   >
//                     <span className="text-black font-black text-2xl mb-1">
//                       {holeData.num}
//                     </span>
//                   </div>
//                   <div className="text-white text-s font-bold leading-tight">
//                     Par {holeData.par}
//                   </div>
//                   <div className="flex items-center gap-1 opacity-90">
//                     <span className="text-white text-[13px]">
//                       {holeData.dist}
//                       {unit}
//                     </span>
//                   </div>
//                 </div>
//               </DraggableWidget>
//             </motion.div>

//             {/* Control Points */}
//             {impactPoint && (
//               <ControlNode
//                 x={impactPoint.x}
//                 y={impactPoint.y}
//                 color="#ef4444"
//                 label="Start"
//                 onDragStart={(e: any) => startDrag(e, "impact", impactPoint)}
//               />
//             )}
//             {landingPoint && (
//               <ControlNode
//                 x={landingPoint.x}
//                 y={landingPoint.y}
//                 color="#3b82f6"
//                 label="End"
//                 onDragStart={(e: any) => startDrag(e, "landing", landingPoint)}
//               />
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="h-24 bg-black border-t border-white/10 px-4 md:px-8 flex items-center gap-6 z-20 shrink-0">
//           <button
//             onClick={togglePlay}
//             className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors shrink-0"
//           >
//             {playing ? (
//               <Pause fill="currentColor" size={20} />
//             ) : (
//               <Play fill="currentColor" size={20} className="ml-1" />
//             )}
//           </button>

//           <div className="flex gap-2 shrink-0">
//             <button
//               onClick={() => skipFrame("back")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <button
//               onClick={() => skipFrame("fwd")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>
//           <div className="flex-1 flex flex-col justify-center gap-1">
//             <input
//               type="range"
//               min={0}
//               max={duration || 100}
//               step={0.01}
//               value={currentTime}
//               onChange={(e) => {
//                 const t = parseFloat(e.target.value);
//                 setCurrentTime(t);
//                 if (videoRef.current) videoRef.current.currentTime = t;
//               }}
//               onKeyDown={(e) => {
//                 if (
//                   e.code === "Space" ||
//                   e.code === "ArrowUp" ||
//                   e.code === "ArrowDown"
//                 ) {
//                   e.preventDefault();
//                   togglePlay();
//                 } else if (e.code === "ArrowLeft") {
//                   e.preventDefault();
//                   skipFrame("back");
//                 } else if (e.code === "ArrowRight") {
//                   e.preventDefault();
//                   skipFrame("fwd");
//                 }
//               }}
//               className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
//             />
//           </div>
//         </div>
//       </div>

//       {/* === RIGHT AREA: TOOLS SIDEBAR === */}
//       <div className="w-full lg:w-80 bg-[#0a0a0a] border-l border-white/10 flex flex-col h-[40vh] lg:h-screen overflow-y-auto shrink-0">
//         <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
//           <h2 className="text-base font-bold text-white tracking-wide">
//             Studio Tools
//           </h2>
//           <button
//             onClick={() => setVideoSrc(null)}
//             className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="p-5 space-y-6">
//           {/* JOYSTICK */}
//           {controlPoint && (
//             <div className="space-y-2">
//               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
//                 <Move size={12} /> Adjust Curve
//               </div>
//               <VirtualJoystick
//                 onMove={(dx, dy) => {
//                   if (controlPoint) {
//                     const newX = controlPoint.x + dx;
//                     const newY = controlPoint.y + dy;
//                     setControlPoint({ x: newX, y: newY });
//                   }
//                 }}
//               />
//             </div>
//           )}

//           {/* PLACEMENT */}
//           <div className="grid grid-cols-2 gap-2">
//             <button
//               onClick={() => {
//                 setPlacingMode("impact");
//                 setImpactPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "impact"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set Start
//             </button>
//             <button
//               onClick={() => {
//                 setPlacingMode("landing");
//                 setLandingPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "landing"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set End
//             </button>
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           {/* TRACER SETTINGS */}
//           <div className="space-y-4">
//             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <Settings2 size={12} className="inline mr-1" /> Style
//             </div>
//             <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
//               {["solid", "comet", "hybrid"].map((m) => (
//                 <button
//                   key={m}
//                   onClick={() => setTracerMode(m as any)}
//                   className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
//                     tracerMode === m
//                       ? "bg-amber-500 text-black"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {m}
//                 </button>
//               ))}
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex gap-1.5">
//                 <input
//                   type="color"
//                   value={tracerColor}
//                   onChange={(e) => setTracerColor(e.target.value)}
//                   className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer p-0"
//                 />
//                 {["#ff0000", "#3b82f6", "#eab308", "#ffffff"].map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => setTracerColor(c)}
//                     className={`w-6 h-6 rounded-full border-2 ${
//                       tracerColor === c
//                         ? "border-white scale-110"
//                         : "border-transparent"
//                     }`}
//                     style={{ backgroundColor: c }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* OPACITY SLIDER */}
//             <div className="space-y-1 mt-2">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Opacity</span>
//                 <span>{Math.round(tracerOpacity * 100)}%</span>
//               </div>
//               <input
//                 type="range"
//                 min={0}
//                 max={1}
//                 step={0.01}
//                 value={tracerOpacity}
//                 onChange={(e) => setTracerOpacity(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>

//             {/* WIDTH SLIDER */}
//             <div className="space-y-1">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Width</span>
//                 <span>{tracerWidth}px</span>
//               </div>
//               <input
//                 type="range"
//                 min={8}
//                 max={20}
//                 value={tracerWidth}
//                 onChange={(e) => setTracerWidth(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>
//           </div>

//           <div className="w-full h-px bg-white/5" />
//           <div className="space-y-3">
//             <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <span>Widgets</span>
//               <div className="flex items-center gap-2">
//                 <span className="text-[9px]">Scale</span>
//                 <input
//                   type="range"
//                   min={0.5}
//                   max={1.5}
//                   step={0.1}
//                   value={widgetScale}
//                   onChange={(e) => setWidgetScale(Number(e.target.value))}
//                   className="w-16 h-1 bg-zinc-800 rounded-lg accent-amber-500"
//                 />
//               </div>
//             </div>

//             {[
//               {
//                 label: "Distance",
//                 icon: Ruler,
//                 val: showDistance,
//                 set: setShowDistance,
//               },
//               {
//                 label: "Target",
//                 icon: Target,
//                 val: showTarget,
//                 set: setShowTarget,
//               },
//               {
//                 label: "Hole Info",
//                 icon: Info,
//                 val: showHoleInfo,
//                 set: setShowHoleInfo,
//               },
//               {
//                 label: "Shadow",
//                 icon: MousePointer2,
//                 val: showShadow,
//                 set: setShowShadow,
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-lg border border-white/5"
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <item.icon size={14} className="text-gray-500" /> {item.label}
//                 </div>
//                 <button
//                   onClick={() => item.set(!item.val)}
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     item.val
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {item.val && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </button>
//               </div>
//             ))}

//             {/* Unit toggle (shown when either Distance or Hole Info is enabled) */}
//             {(showDistance || showHoleInfo) && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Unit</div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setUnit("yd")}
//                     className={`flex-1 py-2 text-xs font-bold uppercase rounded ${
//                       unit === "yd"
//                         ? "bg-amber-500 text-black"
//                         : "bg-zinc-800 text-gray-400"
//                     }`}
//                   >
//                     Yards
//                   </button>
//                   <button
//                     onClick={() => setUnit("m")}
//                     className={`flex-1 py-2 text-xs font-bold uppercase rounded ${
//                       unit === "m"
//                         ? "bg-amber-500 text-black"
//                         : "bg-zinc-800 text-gray-400"
//                     }`}
//                   >
//                     Meters
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Distance Settings (only show when Distance is enabled) */}
//             {showDistance && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Distance</div>
//                 <input
//                   type="number"
//                   value={yardage}
//                   onChange={(e) => setYardage(e.target.value)}
//                   className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white"
//                   placeholder="Total Distance"
//                 />
//               </div>
//             )}

//             {/* Hole Info Settings (only show when Hole Info is enabled) */}
//             {showHoleInfo && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Hole Info</div>
//                 <div className="grid grid-cols-3 gap-2">
//                   <input
//                     value={holeData.num}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, num: e.target.value })
//                     }
//                     placeholder="#"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                   <input
//                     value={holeData.par}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, par: e.target.value })
//                     }
//                     placeholder="Par"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                   <input
//                     value={holeData.dist}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, dist: e.target.value })
//                     }
//                     placeholder="Dist"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ------------------------------------------ WITH FADE OPACITY GRADIENT ON SOLID TRACER ----------------------------------------------------

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import { motion } from "framer-motion";
// import {
//   Upload,
//   Play,
//   Pause,
//   Trash2,
//   Target,
//   Ruler,
//   Info,
//   Settings2,
//   ChevronRight,
//   ChevronLeft,
//   Check,
//   MousePointer2,
//   Move,
// } from "lucide-react";
// import TargetImg from "../assets/target.png";

// // --- MATH & GEOMETRY ENGINE ---

// const getRollerCoasterPoint = (
//   p0: { x: number; y: number },
//   c: { x: number; y: number },
//   p1: { x: number; y: number },
//   t: number
// ) => {
//   // Calculate the CENTER between p0 and p1
//   const centerX = (p0.x + p1.x) / 2;

//   // Calculate how far left/right the user moved from center
//   const xOffset = c.x - centerX;

//   // Calculate the 85% point from the ORIGINAL p0 and p1 (not shifted)
//   const apexX = p0.x + (p1.x - p0.x) * 0.85;

//   // Apply the user's left/right adjustment to the apex
//   const adjustedApexX = apexX + xOffset;

//   // Use this as the control point X, keeping the same curve shape
//   const forcedControl = {
//     x: adjustedApexX, // Apex at 85% + user's left/right adjustment
//     y: c.y - 300, // Same height adjustment
//   };

//   const u = 1 - t;
//   return {
//     x: u * u * p0.x + 2 * u * t * forcedControl.x + t * t * p1.x,
//     y: u * u * p0.y + 2 * u * t * forcedControl.y + t * t * p1.y,
//   };
// };

// const sampleRollerCoaster = (P0: any, C: any, P1: any, N = 200) => {
//   const pts = [];
//   for (let i = 0; i <= N; i++) {
//     pts.push(getRollerCoasterPoint(P0, C, P1, i / N));
//   }
//   return pts;
// };

// // Exact Shadow Projection from React Native code
// const projectSubsetToGroundUsingGlobal = (
//   subsetPts: { x: number; y: number }[],
//   startIndexInFull: number,
//   fullCount: number,
//   y0: number,
//   y1: number
// ) => {
//   if (subsetPts.length < 2 || fullCount <= 0) return subsetPts;

//   const out = new Array(subsetPts.length);
//   for (let i = 0; i < subsetPts.length; i++) {
//     const globalIdx = startIndexInFull + i;
//     const tGlobal = globalIdx / fullCount;
//     // Ground line linear interpolation based on global index progress
//     const y = y0 + (y1 - y0) * tGlobal;
//     out[i] = { x: subsetPts[i].x, y };
//   }
//   return out;
// };

// const buildTaperedRibbonPath = (pts: any[], w0: number, w1: number) => {
//   if (pts.length < 2) return "";

//   const N = pts.length;
//   const left = [];
//   const right = [];
//   const lens = [0];

//   for (let i = 1; i < N; i++) {
//     const dx = pts[i].x - pts[i - 1].x;
//     const dy = pts[i].y - pts[i - 1].y;
//     lens[i] = lens[i - 1] + Math.hypot(dx, dy);
//   }
//   const totalLen = Math.max(1e-6, lens[N - 1]);

//   for (let i = 0; i < N; i++) {
//     const i0 = Math.max(0, i - 1);
//     const i1 = Math.min(N - 1, i + 1);
//     const tx = pts[i1].x - pts[i0].x;
//     const ty = pts[i1].y - pts[i0].y;
//     const tl = Math.hypot(tx, ty) || 1;
//     const nx = -ty / tl;
//     const ny = tx / tl;

//     const t = lens[i] / totalLen;
//     // Linear width interpolation
//     const w = w0 + (w1 - w0) * t;
//     const hx = w * 0.5 * nx;
//     const hy = w * 0.5 * ny;

//     left.push({ x: pts[i].x + hx, y: pts[i].y + hy });
//     right.push({ x: pts[i].x - hx, y: pts[i].y - hy });
//   }

//   return [
//     `M${left[0].x},${left[0].y}`,
//     ...left.slice(1).map((p) => `L${p.x},${p.y}`),
//     ...right
//       .slice()
//       .reverse()
//       .map((p) => `L${p.x},${p.y}`),
//     "Z",
//   ].join(" ");
// };

// // --- SUB-COMPONENTS ---

// const ControlNode = ({ x, y, color, label, onDragStart }: any) => (
//   <div
//     onPointerDown={(e) => onDragStart(e)}
//     style={{ left: x, top: y }}
//     className="absolute -ml-3 -mt-3 z-30 cursor-grab active:cursor-grabbing group touch-none"
//   >
//     <div
//       className="w-6 h-6 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform group-hover:scale-125"
//       style={{ backgroundColor: color }}
//     >
//       <div className="w-1.5 h-1.5 bg-white rounded-full" />
//     </div>
//     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 z-40">
//       {label}
//     </div>
//   </div>
// );

// const DraggableWidget = React.memo(
//   ({ children, x, y, visible, scale, onDragStart, id, setWidgetSize }: any) => {
//     const ref = useRef<HTMLDivElement>(null);
//     const prevSize = useRef({ w: 0, h: 0 });

//     useEffect(() => {
//       if (ref.current && visible) {
//         const { offsetWidth: w, offsetHeight: h } = ref.current;

//         // Only call setWidgetSize if size actually changed
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [visible, id, setWidgetSize]); // Removed scale from dependencies

//     // Also handle scale changes separately
//     useEffect(() => {
//       if (ref.current && visible) {
//         // When scale changes, we need to remeasure
//         const { offsetWidth: w, offsetHeight: h } = ref.current;
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [scale, visible, id, setWidgetSize]);

//     if (!visible) return null;

//     return (
//       <div
//         ref={ref}
//         onPointerDown={(e) => onDragStart(e)}
//         style={{
//           left: x,
//           top: y,
//           transform: `scale(${scale})`,
//           transformOrigin: "top left",
//         }}
//         className="absolute z-20 cursor-grab active:cursor-grabbing hover:ring-1 ring-white/30 rounded-lg touch-none select-none"
//       >
//         {children}
//       </div>
//     );
//   }
// );

// const VirtualJoystick = ({
//   onMove,
// }: {
//   onMove: (dx: number, dy: number) => void;
// }) => {
//   const stickRef = useRef(null);
//   return (
//     <div className="w-full aspect-square bg-zinc-900 rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
//       <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
//         <div className="border-r border-b border-white"></div>
//         <div className="border-b border-white"></div>
//         <div className="border-r border-white"></div>
//         <div className=""></div>
//       </div>
//       <motion.div
//         ref={stickRef}
//         drag
//         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//         dragElastic={0.1}
//         onDrag={(_, info) => onMove(info.delta.x * 3, info.delta.y * 3)}
//         className="w-12 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 cursor-move active:cursor-grabbing flex items-center justify-center"
//       >
//         <Move size={20} className="text-black" />
//       </motion.div>
//       <span className="absolute bottom-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none">
//         Curve Adjust
//       </span>
//     </div>
//   );
// };

// export default function ShotTracerWeb() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [videoSrc, setVideoSrc] = useState<string | null>(null);
//   const [videoDims, setVideoDims] = useState({ w: 0, h: 0 });

//   // Playback
//   const [playing, setPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   // Geometry
//   const [impactPoint, setImpactPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [landingPoint, setLandingPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [controlPoint, setControlPoint] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   // Widget Positions & Sizes
//   const [widgetPos, setWidgetPos] = useState({
//     distance: { x: 20, y: 20 },
//     target: { x: 150, y: 150 },
//     holeInfo: { x: 20, y: 100 },
//   });
//   const [widgetSizes, setWidgetSizes] = useState({
//     distance: { w: 100, h: 50 },
//     target: { w: 60, h: 60 },
//     holeInfo: { w: 80, h: 80 },
//   });

//   // Settings
//   const [placingMode, setPlacingMode] = useState<"impact" | "landing" | null>(
//     null
//   );
//   const [tracerMode, setTracerMode] = useState<"solid" | "comet" | "hybrid">(
//     "solid"
//   );
//   const [tracerColor, setTracerColor] = useState("#ff0000");
//   const [tracerOpacity, setTracerOpacity] = useState(0.8);

//   const [tracerWidth, setTracerWidth] = useState(12);
//   const [widgetScale, setWidgetScale] = useState(1);
//   const [showShadow, setShowShadow] = useState(true);
//   const [showTarget, setShowTarget] = useState(false);
//   const [showDistance, setShowDistance] = useState(true);
//   const [showHoleInfo, setShowHoleInfo] = useState(false);

//   // Data
//   const [yardage, setYardage] = useState("150");
//   const [unit, setUnit] = useState<"yd" | "m">("yd");
//   const [holeData, setHoleData] = useState({ num: "1", par: "4", dist: "420" });

//   // --- DRAG LOGIC ---
//   const draggingRef = useRef<{
//     type: string;
//     startX: number;
//     startY: number;
//     initialPos: { x: number; y: number };
//   } | null>(null);

//   const startDrag = (
//     e: React.PointerEvent,
//     type: string,
//     currentPos: { x: number; y: number }
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const target = e.currentTarget as HTMLElement;
//     target.setPointerCapture(e.pointerId);
//     draggingRef.current = {
//       type,
//       startX: e.clientX,
//       startY: e.clientY,
//       initialPos: { ...currentPos },
//     };
//   };

//   const onPointerMove = (e: React.PointerEvent) => {
//     if (!draggingRef.current || !containerRef.current) return;

//     const { type, startX, startY, initialPos } = draggingRef.current;
//     const deltaX = e.clientX - startX;
//     const deltaY = e.clientY - startY;
//     let newX = initialPos.x + deltaX;
//     let newY = initialPos.y + deltaY;

//     // Strict Clamping
//     const rect = containerRef.current.getBoundingClientRect();

//     // Determine object size for right/bottom clamping
//     let objW = 0,
//       objH = 0;

//     if (["distance", "target", "holeInfo"].includes(type)) {
//       const size = widgetSizes[type as keyof typeof widgetSizes];
//       objW = size.w * widgetScale;
//       objH = size.h * widgetScale;
//     } else {
//       // Control points are small
//       objW = 0;
//       objH = 0;
//     }

//     newX = Math.max(0, Math.min(rect.width - objW, newX));
//     newY = Math.max(0, Math.min(rect.height - objH, newY));

//     if (type === "impact" && impactPoint)
//       setImpactPoint({ ...impactPoint, x: newX, y: newY });
//     else if (type === "landing" && landingPoint)
//       setLandingPoint({ ...landingPoint, x: newX, y: newY });
//     else if (type === "control" && controlPoint)
//       setControlPoint({ x: newX, y: newY });
//     else if (["distance", "target", "holeInfo"].includes(type)) {
//       setWidgetPos((prev) => ({ ...prev, [type]: { x: newX, y: newY } }));
//     }
//   };

//   const onPointerUp = (e: React.PointerEvent) => {
//     if (draggingRef.current) {
//       draggingRef.current = null;
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     }
//   };

//   const updateWidgetSize = useCallback((id: string, w: number, h: number) => {
//     setWidgetSizes((prev) => {
//       // Only update if the size actually changed
//       if (prev[id]?.w === w && prev[id]?.h === h) {
//         return prev;
//       }
//       return { ...prev, [id]: { w, h } };
//     });
//   }, []);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setVideoSrc(url);
//       setImpactPoint(null);
//       setLandingPoint(null);
//       setControlPoint(null);
//       setPlaying(false);
//       setCurrentTime(0);
//     }
//   };

//   const onLoadedMetadata = () => {
//     if (videoRef.current && containerRef.current) {
//       setDuration(videoRef.current.duration);
//       setVideoDims({
//         w: videoRef.current.videoWidth,
//         h: videoRef.current.videoHeight,
//       });
//     }
//   };

//   useEffect(() => {
//     let handle: number;
//     const loop = () => {
//       if (videoRef.current && !videoRef.current.paused) {
//         setCurrentTime(videoRef.current.currentTime);
//         if (videoRef.current.ended) setPlaying(false);
//       }
//       handle = requestAnimationFrame(loop);
//     };
//     handle = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(handle);
//   }, []);

//   const togglePlay = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     setPlaying((prev) => {
//       if (prev) {
//         video.pause();
//       } else {
//         if (video.currentTime >= duration) {
//           video.currentTime = 0;
//         }
//         video.play();
//       }
//       return !prev;
//     });
//   }, [duration]);

//   const skipFrame = useCallback(
//     (direction: "fwd" | "back") => {
//       const video = videoRef.current;
//       if (!video) return;

//       const frameTime = 1 / 30;

//       const newTime =
//         direction === "fwd"
//           ? Math.min(duration, video.currentTime + frameTime)
//           : Math.max(0, video.currentTime - frameTime);

//       video.currentTime = newTime;
//       setCurrentTime(newTime);
//     },
//     [duration]
//   );

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
//         return;

//       switch (e.code) {
//         case "Space":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowDown":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowLeft":
//           e.preventDefault();
//           skipFrame("back");
//           break;
//         case "ArrowRight":
//           e.preventDefault();
//           skipFrame("fwd");
//           break;
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [togglePlay, skipFrame]);

//   const handleContainerClick = (e: React.MouseEvent) => {
//     if (!placingMode || !containerRef.current || !videoRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const time = videoRef.current.currentTime;
//     const pt = { x, y, time };

//     if (placingMode === "impact") {
//       setImpactPoint(pt);
//       if (landingPoint) {
//         setControlPoint({
//           x: (x + landingPoint.x) / 2,
//           y: Math.min(y, landingPoint.y) - rect.height * 0.3,
//         });
//       }
//     } else {
//       setLandingPoint(pt);
//       if (impactPoint) {
//         setControlPoint({
//           x: (impactPoint.x + x) / 2,
//           y: Math.min(impactPoint.y, y) - rect.height * 0.3,
//         });
//       }
//     }
//     setPlacingMode(null);
//   };

//   // const tracerData = useMemo(() => {
//   //   if (!impactPoint || !landingPoint) return null;

//   //   const cp = controlPoint || {
//   //     x: (impactPoint.x + landingPoint.x) / 2,
//   //     y: Math.min(impactPoint.y, landingPoint.y) - 200,
//   //   };

//   //   const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//   //   const rawProgress = (currentTime - impactPoint.time) / totalDuration;
//   //   const easedProgress = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);

//   //   if (easedProgress <= 0) return null;

//   //   const N = 240;
//   //   const floatIdx = easedProgress * N;

//   //   // USE THE NEW ROLLER COASTER CURVE HERE
//   //   const fullCurve = sampleRollerCoaster(impactPoint, cp, landingPoint, N);

//   //   // Basic visible slice
//   //   const endIdx = Math.floor(floatIdx);
//   //   let visiblePts = fullCurve.slice(0, endIdx + 1);

//   //   // Sub-pixel tip accuracy
//   //   if (easedProgress < 1) {
//   //     // USE THE NEW ROLLER COASTER POINT FUNCTION HERE
//   //     const exactTip = getRollerCoasterPoint(
//   //       impactPoint,
//   //       cp,
//   //       landingPoint,
//   //       easedProgress
//   //     );
//   //     visiblePts.push(exactTip);
//   //   }

//   //   const isLanded = currentTime > landingPoint.time;
//   //   let startIdx = 0;

//   //   // --- MODE LOGIC ---

//   //   if (tracerMode === "comet") {
//   //     // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//   //     const hybridCutStartIdx = Math.floor(N * 0.3); // 60% instead of apexIdx

//   //     // Start shrinking tail after hybridCutStartIdx (60%)
//   //     if (endIdx > hybridCutStartIdx || isLanded) {
//   //       // Shrink logic
//   //       const progressPastCutStart =
//   //         (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx - 15);
//   //       startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//   //       if (isLanded) {
//   //         // Slow shrink at end (1.5s)
//   //         const timeSinceLand = currentTime - landingPoint.time;
//   //         const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//   //         startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//   //       }

//   //       if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//   //       visiblePts = visiblePts.slice(startIdx);
//   //     }
//   //   } else if (tracerMode === "hybrid") {
//   //     // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//   //     const hybridCutStartIdx = Math.floor(N * 0.6); // 60% instead of apexIdx

//   //     // Start shrinking tail after hybridCutStartIdx (60%)
//   //     if (endIdx > hybridCutStartIdx || isLanded) {
//   //       // Shrink logic
//   //       const progressPastCutStart =
//   //         (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx);
//   //       startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//   //       if (isLanded) {
//   //         // Slow shrink at end (1.5s)
//   //         const timeSinceLand = currentTime - landingPoint.time;
//   //         const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//   //         startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//   //       }

//   //       if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//   //       visiblePts = visiblePts.slice(startIdx);
//   //     }
//   //   }

//   //   if (visiblePts.length < 2) return null;

//   //   // Generate Path - DIFFERENT APPROACH FOR COMET MODE
//   //   let dMain = "";
//   //   let dShadow = "";

//   //   if (tracerMode === "comet" || tracerMode === "hybrid") {
//   //     dMain = buildTaperedRibbonPath(
//   //       visiblePts,
//   //       tracerWidth * 0.5,
//   //       tracerWidth * 0.3
//   //     );

//   //     if (showShadow) {
//   //       const groundPts = projectSubsetToGroundUsingGlobal(
//   //         visiblePts,
//   //         startIdx,
//   //         N,
//   //         impactPoint.y,
//   //         landingPoint.y
//   //       );
//   //       // Shadow also uses constant width (80% of main width)
//   //       dShadow = buildTaperedRibbonPath(
//   //         groundPts,
//   //         tracerWidth * 0.5,
//   //         tracerWidth * 0.3
//   //       );
//   //     }
//   //   } else {
//   //     // SOLID Use tapered width
//   //     dMain = buildTaperedRibbonPath(
//   //       visiblePts,
//   //       tracerWidth,
//   //       tracerWidth * 0.275
//   //     );

//   //     if (showShadow) {
//   //       const groundPts = projectSubsetToGroundUsingGlobal(
//   //         visiblePts,
//   //         startIdx,
//   //         N,
//   //         impactPoint.y,
//   //         landingPoint.y
//   //       );
//   //       dShadow = buildTaperedRibbonPath(
//   //         groundPts,
//   //         tracerWidth * 0.8,
//   //         tracerWidth * 0.3
//   //       );
//   //     }
//   //   }

//   //   return { dMain, dShadow, easedProgress };
//   // }, [
//   //   impactPoint,
//   //   landingPoint,
//   //   controlPoint,
//   //   currentTime,
//   //   tracerMode,
//   //   showShadow,
//   //   tracerWidth,
//   // ]);

//   const tracerData = useMemo(() => {
//     if (!impactPoint || !landingPoint) return null;

//     const cp = controlPoint || {
//       x: (impactPoint.x + landingPoint.x) / 2,
//       y: Math.min(impactPoint.y, landingPoint.y) - 200,
//     };

//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const rawProgress = (currentTime - impactPoint.time) / totalDuration;
//     const easedProgress = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);

//     if (easedProgress <= 0) return null;

//     const N = 240;
//     const floatIdx = easedProgress * N;

//     // USE THE NEW ROLLER COASTER CURVE HERE
//     const fullCurve = sampleRollerCoaster(impactPoint, cp, landingPoint, N);

//     // Basic visible slice
//     const endIdx = Math.floor(floatIdx);
//     let visiblePts = fullCurve.slice(0, endIdx + 1);

//     // Sub-pixel tip accuracy
//     if (easedProgress < 1) {
//       // USE THE NEW ROLLER COASTER POINT FUNCTION HERE
//       const exactTip = getRollerCoasterPoint(
//         impactPoint,
//         cp,
//         landingPoint,
//         easedProgress
//       );
//       visiblePts.push(exactTip);
//     }

//     const isLanded = currentTime > landingPoint.time;
//     let startIdx = 0;

//     // --- MODE LOGIC ---

//     if (tracerMode === "comet") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.3); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx - 15);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     } else if (tracerMode === "hybrid") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.6); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     }

//     if (visiblePts.length < 2) return null;

//     // Generate Path - DIFFERENT APPROACH FOR COMET MODE
//     let dMain = "";
//     let dShadow = "";

//     if (tracerMode === "comet" || tracerMode === "hybrid") {
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth * 0.5,
//         tracerWidth * 0.3
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         // Shadow also uses constant width (80% of main width)
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.5,
//           tracerWidth * 0.3
//         );
//       }
//     } else {
//       // SOLID Use tapered width
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth,
//         tracerWidth * 0.275
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.8,
//           tracerWidth * 0.3
//         );
//       }
//     }

//     // Calculate gradient vector for solid mode (from tail to head)
//     let gradientVector = null;
//     if (tracerMode === "solid" && visiblePts.length >= 2) {
//       gradientVector = {
//         x1: visiblePts[0].x,
//         y1: visiblePts[0].y,
//         x2: visiblePts[visiblePts.length - 1].x,
//         y2: visiblePts[visiblePts.length - 1].y,
//       };
//     }

//     return { dMain, dShadow, easedProgress, gradientVector, visiblePts };
//   }, [
//     impactPoint,
//     landingPoint,
//     controlPoint,
//     currentTime,
//     tracerMode,
//     showShadow,
//     tracerWidth,
//   ]);

//   const globalOpacity = useMemo(() => {
//     if (!landingPoint) return 1;
//     if (currentTime > landingPoint.time + 1.0) {
//       const fadeProgress = (currentTime - (landingPoint.time + 1.0)) / 0.5;
//       return Math.max(0, 1 - fadeProgress);
//     }
//     return 1;
//   }, [currentTime, landingPoint]);

//   const targetOpacity = useMemo(() => {
//     if (!showTarget) return 0;
//     if (!tracerData) return 1; // Show initially
//     if (tracerData.easedProgress > 0.1) {
//       return Math.max(0, 1 - (tracerData.easedProgress - 0.4) / 0.2);
//     }
//     return 1;
//   }, [tracerData, showTarget]);

//   // Distance: Don't reset
//   const distDisplay = useMemo(() => {
//     if (!impactPoint || !landingPoint) return 0;
//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const effectiveTime = Math.min(currentTime, landingPoint.time);

//     if (effectiveTime < impactPoint.time) return 0;

//     const rawProgress = (effectiveTime - impactPoint.time) / totalDuration;
//     const eased = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);
//     return Math.round(eased * parseInt(yardage));
//   }, [currentTime, impactPoint, landingPoint, yardage]);

//   // --- RENDER ---

//   if (!videoSrc) {
//     return (
//       <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
//         <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
//           <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
//             <Upload size={32} className="text-amber-500" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Shot Tracer Studio</h1>
//           <p className="text-gray-400 mb-8">Upload a video to start editing.</p>
//           <label className="block w-full cursor-pointer group">
//             <input
//               type="file"
//               accept="video/*"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//             <div className="w-full bg-amber-500 group-hover:bg-white text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
//               Select Video
//             </div>
//           </label>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col lg:flex-row overflow-hidden select-none"
//       onPointerUp={onPointerUp}
//       onPointerMove={onPointerMove}
//     >
//       {/* === LEFT AREA: VIDEO STUDIO === */}
//       <div className="flex-1 flex flex-col h-[calc(100vh)] lg:h-screen relative">
//         <div className="flex-1 relative flex items-center justify-center bg-zinc-950/50 p-4">
//           <div
//             ref={containerRef}
//             className="relative shadow-2xl shadow-black border border-white/10 rounded-lg overflow-hidden max-h-[80vh] w-auto touch-none"
//             style={{
//               aspectRatio: videoDims.w
//                 ? `${videoDims.w}/${videoDims.h}`
//                 : "auto",
//               cursor: placingMode ? "crosshair" : "default",
//             }}
//             onMouseDown={handleContainerClick}
//           >
//             <video
//               ref={videoRef}
//               src={videoSrc}
//               onLoadedMetadata={onLoadedMetadata}
//               className="w-full h-full object-contain pointer-events-none block"
//               playsInline
//               muted
//             />

//             {placingMode && (
//               <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold px-6 py-2 rounded-full shadow-xl z-50 animate-pulse pointer-events-none border-2 border-white whitespace-nowrap">
//                 Click to place {placingMode === "impact" ? "Start" : "End"}{" "}
//                 Point
//               </div>
//             )}

//             <motion.div
//               className="absolute inset-0 pointer-events-none"
//               animate={{ opacity: globalOpacity }}
//               transition={{ duration: 0.2 }}
//             >
//               {/* <svg className="absolute inset-0 w-full h-full overflow-visible z-22">
//                 <defs>
//                   <filter
//                     id="tracerDropShadow"
//                     x="-50%"
//                     y="-50%"
//                     width="200%"
//                     height="200%"
//                   >
//                     <feDropShadow
//                       dx=".5"
//                       dy="2.5"
//                       stdDeviation="1.5"
//                       floodColor="#000"
//                       floodOpacity=".65"
//                     />
//                   </filter>
//                 </defs>

//                 {tracerData && (
//                   <>
//                     {showShadow && (
//                       <path
//                         d={tracerData.dShadow}
//                         fill="black"
//                         opacity="0.25"
//                       />
//                     )}
//                     <path
//                       d={tracerData.dMain}
//                       fill={tracerColor}
//                       fillOpacity={tracerOpacity}
//                       filter="url(#tracerDropShadow)"
//                     />
//                   </>
//                 )}
//               </svg> */}

//               <svg className="absolute inset-0 w-full h-full overflow-visible z-22">
//                 <defs>
//                   <filter
//                     id="tracerDropShadow"
//                     x="-50%"
//                     y="-50%"
//                     width="200%"
//                     height="200%"
//                   >
//                     <feDropShadow
//                       dx=".5"
//                       dy="2.5"
//                       stdDeviation="1.5"
//                       floodColor="#000"
//                       floodOpacity=".65"
//                     />
//                   </filter>

//                   {/* Gradient for solid mode - only define when needed */}
//                   {tracerData &&
//                     tracerMode === "solid" &&
//                     tracerData.gradientVector && (
//                       <linearGradient
//                         id="tracerGradient"
//                         x1={tracerData.gradientVector.x1}
//                         y1={tracerData.gradientVector.y1}
//                         x2={tracerData.gradientVector.x2}
//                         y2={tracerData.gradientVector.y2}
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop
//                           offset="0%"
//                           stopColor={tracerColor}
//                           stopOpacity="0"
//                         />
//                         <stop
//                           offset="25%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.2"
//                         />
//                         <stop
//                           offset="70%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.5"
//                         />
//                         <stop
//                           offset="100%"
//                           stopColor={tracerColor}
//                           stopOpacity={tracerOpacity}
//                         />
//                       </linearGradient>
//                     )}
//                 </defs>

//                 {tracerData && (
//                   <>
//                     {showShadow && (
//                       <path
//                         d={tracerData.dShadow}
//                         fill="black"
//                         opacity="0.25"
//                       />
//                     )}
//                     <path
//                       d={tracerData.dMain}
//                       fill={
//                         tracerMode === "solid"
//                           ? "url(#tracerGradient)"
//                           : tracerColor
//                       }
//                       fillOpacity={tracerMode === "solid" ? 1 : tracerOpacity}
//                       filter="url(#tracerDropShadow)"
//                     />
//                   </>
//                 )}
//               </svg>

//               {/* Widgets */}
//               <DraggableWidget
//                 id="distance"
//                 x={widgetPos.distance.x}
//                 y={widgetPos.distance.y}
//                 visible={showDistance && impactPoint && landingPoint}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "distance", widgetPos.distance)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{
//                     boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)",
//                   }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl px-4 py-2 w-[90px] h-[55px] text-center backdrop-blur-sm pointer-events-auto flex items-baseline justify-center"
//                 >
//                   <span className="text-2xl font-medium text-white leading-none drop-shadow-md mt-1">
//                     {distDisplay}
//                   </span>
//                   <span className="text-[16px] font-bold text-white-900">
//                     {unit}
//                   </span>
//                 </div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="target"
//                 x={widgetPos.target.x}
//                 y={widgetPos.target.y}
//                 visible={showTarget}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "target", widgetPos.target)
//                 }
//                 setWidgetSize={updateWidgetSize}
//                 style={{ zIndex: 1 }}
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0], opacity: targetOpacity }}
//                   transition={{
//                     y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
//                     opacity: { duration: 0.3 },
//                   }}
//                   className="filter drop-shadow-lg pointer-events-auto"
//                 >
//                   {/* <Target size={60} className="text-red-500" strokeWidth={2} /> */}
//                   <img
//                     style={{
//                       width: 35,
//                     }}
//                     src={TargetImg}
//                     alt="Target"
//                   />
//                 </motion.div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="holeInfo"
//                 x={widgetPos.holeInfo.x}
//                 y={widgetPos.holeInfo.y}
//                 visible={showHoleInfo}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "holeInfo", widgetPos.holeInfo)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{
//                     boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)",
//                   }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl p-2 w-[75px] flex flex-col items-center backdrop-blur-sm pointer-events-auto"
//                 >
//                   <div
//                     style={{
//                       boxShadow: "0px 1.5px 1.5px 0px rgba(0,0,0,.9)",
//                     }}
//                     className="bg-white rounded-full w-12.5 h-12.5 flex items-center justify-center mb-1 shadow-inner border border-gray-200"
//                   >
//                     <span className="text-black font-black text-2xl mb-1">
//                       {holeData.num}
//                     </span>
//                   </div>
//                   <div className="text-white text-s font-bold leading-tight">
//                     Par {holeData.par}
//                   </div>
//                   <div className="flex items-center gap-1 opacity-90">
//                     <span className="text-white text-[13px]">
//                       {holeData.dist}
//                       {unit}
//                     </span>
//                   </div>
//                 </div>
//               </DraggableWidget>
//             </motion.div>

//             {/* Control Points */}
//             {impactPoint && (
//               <ControlNode
//                 x={impactPoint.x}
//                 y={impactPoint.y}
//                 color="#ef4444"
//                 label="Start"
//                 onDragStart={(e: any) => startDrag(e, "impact", impactPoint)}
//               />
//             )}
//             {landingPoint && (
//               <ControlNode
//                 x={landingPoint.x}
//                 y={landingPoint.y}
//                 color="#3b82f6"
//                 label="End"
//                 onDragStart={(e: any) => startDrag(e, "landing", landingPoint)}
//               />
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="h-24 bg-black border-t border-white/10 px-4 md:px-8 flex items-center gap-6 z-20 shrink-0">
//           <button
//             onClick={togglePlay}
//             className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors shrink-0"
//           >
//             {playing ? (
//               <Pause fill="currentColor" size={20} />
//             ) : (
//               <Play fill="currentColor" size={20} className="ml-1" />
//             )}
//           </button>

//           <div className="flex gap-2 shrink-0">
//             <button
//               onClick={() => skipFrame("back")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <button
//               onClick={() => skipFrame("fwd")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>
//           <div className="flex-1 flex flex-col justify-center gap-1">
//             <input
//               type="range"
//               min={0}
//               max={duration || 100}
//               step={0.01}
//               value={currentTime}
//               onChange={(e) => {
//                 const t = parseFloat(e.target.value);
//                 setCurrentTime(t);
//                 if (videoRef.current) videoRef.current.currentTime = t;
//               }}
//               onKeyDown={(e) => {
//                 if (
//                   e.code === "Space" ||
//                   e.code === "ArrowUp" ||
//                   e.code === "ArrowDown"
//                 ) {
//                   e.preventDefault();
//                   togglePlay();
//                 } else if (e.code === "ArrowLeft") {
//                   e.preventDefault();
//                   skipFrame("back");
//                 } else if (e.code === "ArrowRight") {
//                   e.preventDefault();
//                   skipFrame("fwd");
//                 }
//               }}
//               className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
//             />
//           </div>
//         </div>
//       </div>

//       {/* === RIGHT AREA: TOOLS SIDEBAR === */}
//       <div className="w-full lg:w-80 bg-[#0a0a0a] border-l border-white/10 flex flex-col h-[40vh] lg:h-screen overflow-y-auto shrink-0">
//         <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
//           <h2 className="text-base font-bold text-white tracking-wide">
//             Studio Tools
//           </h2>
//           <button
//             onClick={() => setVideoSrc(null)}
//             className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="p-5 space-y-6">
//           {/* JOYSTICK */}
//           {controlPoint && (
//             <div className="space-y-2">
//               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
//                 <Move size={12} /> Adjust Curve
//               </div>
//               <VirtualJoystick
//                 onMove={(dx, dy) => {
//                   if (controlPoint) {
//                     const newX = controlPoint.x + dx;
//                     const newY = controlPoint.y + dy;
//                     setControlPoint({ x: newX, y: newY });
//                   }
//                 }}
//               />
//             </div>
//           )}

//           {/* PLACEMENT */}
//           <div className="grid grid-cols-2 gap-2">
//             <button
//               onClick={() => {
//                 setPlacingMode("impact");
//                 setImpactPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "impact"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set Start
//             </button>
//             <button
//               onClick={() => {
//                 setPlacingMode("landing");
//                 setLandingPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "landing"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set End
//             </button>
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           {/* TRACER SETTINGS */}
//           <div className="space-y-4">
//             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <Settings2 size={12} className="inline mr-1" /> Style
//             </div>
//             <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
//               {["solid", "comet", "hybrid"].map((m) => (
//                 <button
//                   key={m}
//                   onClick={() => setTracerMode(m as any)}
//                   className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
//                     tracerMode === m
//                       ? "bg-amber-500 text-black"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {m}
//                 </button>
//               ))}
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex gap-1.5">
//                 <input
//                   type="color"
//                   value={tracerColor}
//                   onChange={(e) => setTracerColor(e.target.value)}
//                   className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer p-0"
//                 />
//                 {["#ff0000", "#3b82f6", "#eab308", "#ffffff"].map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => setTracerColor(c)}
//                     className={`w-6 h-6 rounded-full border-2 ${
//                       tracerColor === c
//                         ? "border-white scale-110"
//                         : "border-transparent"
//                     }`}
//                     style={{ backgroundColor: c }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* OPACITY SLIDER */}
//             <div className="space-y-1 mt-2">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Opacity</span>
//                 <span>{Math.round(tracerOpacity * 100)}%</span>
//               </div>
//               <input
//                 type="range"
//                 min={0}
//                 max={1}
//                 step={0.01}
//                 value={tracerOpacity}
//                 onChange={(e) => setTracerOpacity(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>

//             {/* WIDTH SLIDER */}
//             <div className="space-y-1">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Width</span>
//                 <span>{tracerWidth}px</span>
//               </div>
//               <input
//                 type="range"
//                 min={8}
//                 max={20}
//                 value={tracerWidth}
//                 onChange={(e) => setTracerWidth(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>
//           </div>

//           <div className="w-full h-px bg-white/5" />
//           <div className="space-y-3">
//             <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <span>Widgets</span>
//               <div className="flex items-center gap-2">
//                 <span className="text-[9px]">Scale</span>
//                 <input
//                   type="range"
//                   min={0.5}
//                   max={1.5}
//                   step={0.1}
//                   value={widgetScale}
//                   onChange={(e) => setWidgetScale(Number(e.target.value))}
//                   className="w-16 h-1 bg-zinc-800 rounded-lg accent-amber-500"
//                 />
//               </div>
//             </div>

//             {[
//               {
//                 label: "Distance",
//                 icon: Ruler,
//                 val: showDistance,
//                 set: setShowDistance,
//               },
//               {
//                 label: "Target",
//                 icon: Target,
//                 val: showTarget,
//                 set: setShowTarget,
//               },
//               {
//                 label: "Hole Info",
//                 icon: Info,
//                 val: showHoleInfo,
//                 set: setShowHoleInfo,
//               },
//               {
//                 label: "Shadow",
//                 icon: MousePointer2,
//                 val: showShadow,
//                 set: setShowShadow,
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-lg border border-white/5"
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <item.icon size={14} className="text-gray-500" /> {item.label}
//                 </div>
//                 <button
//                   onClick={() => item.set(!item.val)}
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     item.val
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {item.val && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </button>
//               </div>
//             ))}

//             {/* Unit toggle (shown when either Distance or Hole Info is enabled) */}
//             {(showDistance || showHoleInfo) && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Unit</div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setUnit("yd")}
//                     className={`flex-1 py-2 text-xs font-bold uppercase rounded ${
//                       unit === "yd"
//                         ? "bg-amber-500 text-black"
//                         : "bg-zinc-800 text-gray-400"
//                     }`}
//                   >
//                     Yards
//                   </button>
//                   <button
//                     onClick={() => setUnit("m")}
//                     className={`flex-1 py-2 text-xs font-bold uppercase rounded ${
//                       unit === "m"
//                         ? "bg-amber-500 text-black"
//                         : "bg-zinc-800 text-gray-400"
//                     }`}
//                   >
//                     Meters
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Distance Settings (only show when Distance is enabled) */}
//             {showDistance && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Distance</div>
//                 <input
//                   type="number"
//                   value={yardage}
//                   onChange={(e) => setYardage(e.target.value)}
//                   className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white"
//                   placeholder="Total Distance"
//                 />
//               </div>
//             )}

//             {/* Hole Info Settings (only show when Hole Info is enabled) */}
//             {showHoleInfo && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Hole Info</div>
//                 <div className="grid grid-cols-3 gap-2">
//                   <input
//                     value={holeData.num}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, num: e.target.value })
//                     }
//                     placeholder="#"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                   <input
//                     value={holeData.par}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, par: e.target.value })
//                     }
//                     placeholder="Par"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                   <input
//                     value={holeData.dist}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, dist: e.target.value })
//                     }
//                     placeholder="Dist"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ---------------------------------------------------------------------------------------------------------------------------------

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import { motion } from "framer-motion";
// import {
//   Upload,
//   Play,
//   Pause,
//   Trash2,
//   Target,
//   Ruler,
//   Info,
//   Settings2,
//   ChevronRight,
//   ChevronLeft,
//   Check,
//   MousePointer2,
//   Move,
// } from "lucide-react";
// import TargetImg from "../assets/target.png";

// // --- MATH & GEOMETRY ENGINE ---

// const getRollerCoasterPoint = (
//   p0: { x: number; y: number },
//   c: { x: number; y: number },
//   p1: { x: number; y: number },
//   t: number
// ) => {
//   // Calculate the CENTER between p0 and p1
//   const centerX = (p0.x + p1.x) / 2;

//   // Calculate how far left/right the user moved from center
//   const xOffset = c.x - centerX;

//   // Calculate the 85% point from the ORIGINAL p0 and p1 (not shifted)
//   const apexX = p0.x + (p1.x - p0.x) * 0.85;

//   // Apply the user's left/right adjustment to the apex
//   const adjustedApexX = apexX + xOffset;

//   // Use this as the control point X, keeping the same curve shape
//   const forcedControl = {
//     x: adjustedApexX, // Apex at 85% + user's left/right adjustment
//     y: c.y - 300, // Same height adjustment
//   };

//   const u = 1 - t;
//   return {
//     x: u * u * p0.x + 2 * u * t * forcedControl.x + t * t * p1.x,
//     y: u * u * p0.y + 2 * u * t * forcedControl.y + t * t * p1.y,
//   };
// };

// const sampleRollerCoaster = (P0: any, C: any, P1: any, N = 200) => {
//   const pts = [];
//   for (let i = 0; i <= N; i++) {
//     pts.push(getRollerCoasterPoint(P0, C, P1, i / N));
//   }
//   return pts;
// };

// // Exact Shadow Projection from React Native code
// const projectSubsetToGroundUsingGlobal = (
//   subsetPts: { x: number; y: number }[],
//   startIndexInFull: number,
//   fullCount: number,
//   y0: number,
//   y1: number
// ) => {
//   if (subsetPts.length < 2 || fullCount <= 0) return subsetPts;

//   const out = new Array(subsetPts.length);
//   for (let i = 0; i < subsetPts.length; i++) {
//     const globalIdx = startIndexInFull + i;
//     const tGlobal = globalIdx / fullCount;
//     // Ground line linear interpolation based on global index progress
//     const y = y0 + (y1 - y0) * tGlobal;
//     out[i] = { x: subsetPts[i].x, y };
//   }
//   return out;
// };

// const buildTaperedRibbonPath = (pts: any[], w0: number, w1: number) => {
//   if (pts.length < 2) return "";

//   const N = pts.length;
//   const left = [];
//   const right = [];
//   const lens = [0];

//   for (let i = 1; i < N; i++) {
//     const dx = pts[i].x - pts[i - 1].x;
//     const dy = pts[i].y - pts[i - 1].y;
//     lens[i] = lens[i - 1] + Math.hypot(dx, dy);
//   }
//   const totalLen = Math.max(1e-6, lens[N - 1]);

//   for (let i = 0; i < N; i++) {
//     const i0 = Math.max(0, i - 1);
//     const i1 = Math.min(N - 1, i + 1);
//     const tx = pts[i1].x - pts[i0].x;
//     const ty = pts[i1].y - pts[i0].y;
//     const tl = Math.hypot(tx, ty) || 1;
//     const nx = -ty / tl;
//     const ny = tx / tl;

//     const t = lens[i] / totalLen;
//     // Linear width interpolation
//     const w = w0 + (w1 - w0) * t;
//     const hx = w * 0.5 * nx;
//     const hy = w * 0.5 * ny;

//     left.push({ x: pts[i].x + hx, y: pts[i].y + hy });
//     right.push({ x: pts[i].x - hx, y: pts[i].y - hy });
//   }

//   return [
//     `M${left[0].x},${left[0].y}`,
//     ...left.slice(1).map((p) => `L${p.x},${p.y}`),
//     ...right
//       .slice()
//       .reverse()
//       .map((p) => `L${p.x},${p.y}`),
//     "Z",
//   ].join(" ");
// };

// // --- SUB-COMPONENTS ---

// const ControlNode = ({ x, y, color, label, onDragStart }: any) => (
//   <div
//     onPointerDown={(e) => onDragStart(e)}
//     style={{ left: x, top: y }}
//     className="absolute -ml-3 -mt-3 z-30 cursor-grab active:cursor-grabbing group touch-none"
//   >
//     <div
//       className="w-6 h-6 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform group-hover:scale-125"
//       style={{ backgroundColor: color }}
//     >
//       <div className="w-1.5 h-1.5 bg-white rounded-full" />
//     </div>
//     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 z-40">
//       {label}
//     </div>
//   </div>
// );

// const DraggableWidget = React.memo(
//   ({ children, x, y, visible, scale, onDragStart, id, setWidgetSize }: any) => {
//     const ref = useRef<HTMLDivElement>(null);
//     const prevSize = useRef({ w: 0, h: 0 });

//     useEffect(() => {
//       if (ref.current && visible) {
//         const { offsetWidth: w, offsetHeight: h } = ref.current;

//         // Only call setWidgetSize if size actually changed
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [visible, id, setWidgetSize]); // Removed scale from dependencies

//     // Also handle scale changes separately
//     useEffect(() => {
//       if (ref.current && visible) {
//         // When scale changes, we need to remeasure
//         const { offsetWidth: w, offsetHeight: h } = ref.current;
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [scale, visible, id, setWidgetSize]);

//     if (!visible) return null;

//     return (
//       <div
//         ref={ref}
//         onPointerDown={(e) => onDragStart(e)}
//         style={{
//           left: x,
//           top: y,
//           transform: `scale(${scale})`,
//           transformOrigin: "top left",
//         }}
//         className="absolute z-20 cursor-grab active:cursor-grabbing hover:ring-1 ring-white/30 rounded-lg touch-none select-none"
//       >
//         {children}
//       </div>
//     );
//   }
// );

// const VirtualJoystick = ({
//   onMove,
// }: {
//   onMove: (dx: number, dy: number) => void;
// }) => {
//   const stickRef = useRef(null);
//   return (
//     <div className="w-full aspect-square bg-zinc-900 rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
//       <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
//         <div className="border-r border-b border-white"></div>
//         <div className="border-b border-white"></div>
//         <div className="border-r border-white"></div>
//         <div className=""></div>
//       </div>
//       <motion.div
//         ref={stickRef}
//         drag
//         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//         dragElastic={0.1}
//         onDrag={(_, info) => onMove(info.delta.x * 3, info.delta.y * 3)}
//         className="w-12 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 cursor-move active:cursor-grabbing flex items-center justify-center"
//       >
//         <Move size={20} className="text-black" />
//       </motion.div>
//       <span className="absolute bottom-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none">
//         Curve Adjust
//       </span>
//     </div>
//   );
// };

// export default function ShotTracerWeb() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [videoSrc, setVideoSrc] = useState<string | null>(null);
//   const [videoDims, setVideoDims] = useState({ w: 0, h: 0 });

//   // Playback
//   const [playing, setPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   // Geometry
//   const [impactPoint, setImpactPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [landingPoint, setLandingPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [controlPoint, setControlPoint] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   // Widget Positions & Sizes
//   const [widgetPos, setWidgetPos] = useState({
//     distance: { x: 20, y: 20 },
//     target: { x: 150, y: 150 },
//     holeInfo: { x: 20, y: 100 },
//   });
//   const [widgetSizes, setWidgetSizes] = useState({
//     distance: { w: 100, h: 50 },
//     target: { w: 60, h: 60 },
//     holeInfo: { w: 80, h: 80 },
//   });

//   // Settings
//   const [placingMode, setPlacingMode] = useState<"impact" | "landing" | null>(
//     null
//   );
//   const [tracerMode, setTracerMode] = useState<"solid" | "comet" | "hybrid">(
//     "solid"
//   );
//   const [tracerColor, setTracerColor] = useState("#ff0000");
//   const [tracerOpacity, setTracerOpacity] = useState(0.8);

//   const [tracerWidth, setTracerWidth] = useState(12);
//   const [widgetScale, setWidgetScale] = useState(1);
//   const [showShadow, setShowShadow] = useState(true);
//   const [showTarget, setShowTarget] = useState(false);
//   const [showDistance, setShowDistance] = useState(true);
//   const [showHoleInfo, setShowHoleInfo] = useState(false);

//   // Data
//   const [yardage, setYardage] = useState("150");
//   const [unit, setUnit] = useState<"yd" | "m">("yd");
//   const [holeData, setHoleData] = useState({ num: "1", par: "4", dist: "420" });

//   // --- DRAG LOGIC ---
//   const draggingRef = useRef<{
//     type: string;
//     startX: number;
//     startY: number;
//     initialPos: { x: number; y: number };
//   } | null>(null);

//   const startDrag = (
//     e: React.PointerEvent,
//     type: string,
//     currentPos: { x: number; y: number }
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const target = e.currentTarget as HTMLElement;
//     target.setPointerCapture(e.pointerId);
//     draggingRef.current = {
//       type,
//       startX: e.clientX,
//       startY: e.clientY,
//       initialPos: { ...currentPos },
//     };
//   };

//   const onPointerMove = (e: React.PointerEvent) => {
//     if (!draggingRef.current || !containerRef.current) return;

//     const { type, startX, startY, initialPos } = draggingRef.current;
//     const deltaX = e.clientX - startX;
//     const deltaY = e.clientY - startY;
//     let newX = initialPos.x + deltaX;
//     let newY = initialPos.y + deltaY;

//     // Strict Clamping
//     const rect = containerRef.current.getBoundingClientRect();

//     // Determine object size for right/bottom clamping
//     let objW = 0,
//       objH = 0;

//     if (["distance", "target", "holeInfo"].includes(type)) {
//       const size = widgetSizes[type as keyof typeof widgetSizes];
//       objW = size.w * widgetScale;
//       objH = size.h * widgetScale;
//     } else {
//       // Control points are small
//       objW = 0;
//       objH = 0;
//     }

//     newX = Math.max(0, Math.min(rect.width - objW, newX));
//     newY = Math.max(0, Math.min(rect.height - objH, newY));

//     if (type === "impact" && impactPoint)
//       setImpactPoint({ ...impactPoint, x: newX, y: newY });
//     else if (type === "landing" && landingPoint)
//       setLandingPoint({ ...landingPoint, x: newX, y: newY });
//     else if (type === "control" && controlPoint)
//       setControlPoint({ x: newX, y: newY });
//     else if (["distance", "target", "holeInfo"].includes(type)) {
//       setWidgetPos((prev) => ({ ...prev, [type]: { x: newX, y: newY } }));
//     }
//   };

//   const onPointerUp = (e: React.PointerEvent) => {
//     if (draggingRef.current) {
//       draggingRef.current = null;
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     }
//   };

//   const updateWidgetSize = useCallback((id: string, w: number, h: number) => {
//     setWidgetSizes((prev) => {
//       // Only update if the size actually changed
//       if (prev[id]?.w === w && prev[id]?.h === h) {
//         return prev;
//       }
//       return { ...prev, [id]: { w, h } };
//     });
//   }, []);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setVideoSrc(url);
//       setImpactPoint(null);
//       setLandingPoint(null);
//       setControlPoint(null);
//       setPlaying(false);
//       setCurrentTime(0);
//     }
//   };

//   const onLoadedMetadata = () => {
//     if (videoRef.current && containerRef.current) {
//       setDuration(videoRef.current.duration);
//       setVideoDims({
//         w: videoRef.current.videoWidth,
//         h: videoRef.current.videoHeight,
//       });
//     }
//   };

//   useEffect(() => {
//     let handle: number;
//     const loop = () => {
//       if (videoRef.current && !videoRef.current.paused) {
//         setCurrentTime(videoRef.current.currentTime);
//         if (videoRef.current.ended) setPlaying(false);
//       }
//       handle = requestAnimationFrame(loop);
//     };
//     handle = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(handle);
//   }, []);

//   const togglePlay = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     setPlaying((prev) => {
//       if (prev) {
//         video.pause();
//       } else {
//         if (video.currentTime >= duration) {
//           video.currentTime = 0;
//         }
//         video.play();
//       }
//       return !prev;
//     });
//   }, [duration]);

//   const skipFrame = useCallback(
//     (direction: "fwd" | "back") => {
//       const video = videoRef.current;
//       if (!video) return;

//       const frameTime = 1 / 30;

//       const newTime =
//         direction === "fwd"
//           ? Math.min(duration, video.currentTime + frameTime)
//           : Math.max(0, video.currentTime - frameTime);

//       video.currentTime = newTime;
//       setCurrentTime(newTime);
//     },
//     [duration]
//   );

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
//         return;

//       switch (e.code) {
//         case "Space":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowDown":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowLeft":
//           e.preventDefault();
//           skipFrame("back");
//           break;
//         case "ArrowRight":
//           e.preventDefault();
//           skipFrame("fwd");
//           break;
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [togglePlay, skipFrame]);

//   const handleContainerClick = (e: React.MouseEvent) => {
//     if (!placingMode || !containerRef.current || !videoRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const time = videoRef.current.currentTime;
//     const pt = { x, y, time };

//     if (placingMode === "impact") {
//       setImpactPoint(pt);
//       if (landingPoint) {
//         setControlPoint({
//           x: (x + landingPoint.x) / 2,
//           y: Math.min(y, landingPoint.y) - rect.height * 0.3,
//         });
//       }
//     } else {
//       setLandingPoint(pt);
//       if (impactPoint) {
//         setControlPoint({
//           x: (impactPoint.x + x) / 2,
//           y: Math.min(impactPoint.y, y) - rect.height * 0.3,
//         });
//       }
//     }
//     setPlacingMode(null);
//   };

//   const tracerData = useMemo(() => {
//     if (!impactPoint || !landingPoint) return null;

//     const cp = controlPoint || {
//       x: (impactPoint.x + landingPoint.x) / 2,
//       y: Math.min(impactPoint.y, landingPoint.y) - 200,
//     };

//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const rawProgress = (currentTime - impactPoint.time) / totalDuration;
//     const easedProgress = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);

//     if (easedProgress <= 0) return null;

//     const N = 240;
//     const floatIdx = easedProgress * N;

//     // USE THE NEW ROLLER COASTER CURVE HERE
//     const fullCurve = sampleRollerCoaster(impactPoint, cp, landingPoint, N);

//     // Basic visible slice
//     const endIdx = Math.floor(floatIdx);
//     let visiblePts = fullCurve.slice(0, endIdx + 1);

//     // Sub-pixel tip accuracy
//     if (easedProgress < 1) {
//       // USE THE NEW ROLLER COASTER POINT FUNCTION HERE
//       const exactTip = getRollerCoasterPoint(
//         impactPoint,
//         cp,
//         landingPoint,
//         easedProgress
//       );
//       visiblePts.push(exactTip);
//     }

//     const isLanded = currentTime > landingPoint.time;
//     let startIdx = 0;

//     // --- MODE LOGIC ---

//     if (tracerMode === "comet") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.3); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx - 15);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     } else if (tracerMode === "hybrid") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.6); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     }

//     if (visiblePts.length < 2) return null;

//     // Generate Path - DIFFERENT APPROACH FOR COMET MODE
//     let dMain = "";
//     let dShadow = "";

//     if (tracerMode === "comet" || tracerMode === "hybrid") {
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth * 0.5,
//         tracerWidth * 0.3
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         // Shadow also uses constant width (80% of main width)
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.5,
//           tracerWidth * 0.3
//         );
//       }
//     } else {
//       // SOLID Use tapered width
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth,
//         tracerWidth * 0.275
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.8,
//           tracerWidth * 0.3
//         );
//       }
//     }

//     // Calculate gradient vector for solid mode (from tail to head)
//     let gradientVector = null;
//     if (tracerMode === "solid" && visiblePts.length >= 2) {
//       gradientVector = {
//         x1: visiblePts[0].x,
//         y1: visiblePts[0].y,
//         x2: visiblePts[visiblePts.length - 1].x,
//         y2: visiblePts[visiblePts.length - 1].y,
//       };
//     }

//     return { dMain, dShadow, easedProgress, gradientVector, visiblePts };
//   }, [
//     impactPoint,
//     landingPoint,
//     controlPoint,
//     currentTime,
//     tracerMode,
//     showShadow,
//     tracerWidth,
//   ]);

//   const globalOpacity = useMemo(() => {
//     if (!landingPoint) return 1;
//     if (currentTime > landingPoint.time + 1.0) {
//       const fadeProgress = (currentTime - (landingPoint.time + 1.0)) / 0.5;
//       return Math.max(0, 1 - fadeProgress);
//     }
//     return 1;
//   }, [currentTime, landingPoint]);

//   const targetOpacity = useMemo(() => {
//     if (!showTarget) return 0;
//     if (!tracerData) return 1; // Show initially
//     if (tracerData.easedProgress > 0.1) {
//       return Math.max(0, 1 - (tracerData.easedProgress - 0.4) / 0.2);
//     }
//     return 1;
//   }, [tracerData, showTarget]);

//   // Distance: Don't reset
//   const distDisplay = useMemo(() => {
//     if (!impactPoint || !landingPoint) return 0;
//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const effectiveTime = Math.min(currentTime, landingPoint.time);

//     if (effectiveTime < impactPoint.time) return 0;

//     const rawProgress = (effectiveTime - impactPoint.time) / totalDuration;
//     const eased = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);
//     return Math.round(eased * parseInt(yardage));
//   }, [currentTime, impactPoint, landingPoint, yardage]);

//   // --- RENDER ---

//   if (!videoSrc) {
//     return (
//       <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
//         <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
//           <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
//             <Upload size={32} className="text-amber-500" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Shot Tracer Studio</h1>
//           <p className="text-gray-400 mb-8">Upload a video to start editing.</p>
//           <label className="block w-full cursor-pointer group">
//             <input
//               type="file"
//               accept="video/*"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//             <div className="w-full bg-amber-500 group-hover:bg-white text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
//               Select Video
//             </div>
//           </label>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col lg:flex-row overflow-hidden select-none"
//       onPointerUp={onPointerUp}
//       onPointerMove={onPointerMove}
//     >
//       {/* === LEFT AREA: VIDEO STUDIO === */}
//       <div className="flex-1 flex flex-col h-[calc(100vh)] lg:h-screen relative">
//         <div className="flex-1 relative flex items-center justify-center bg-zinc-950/50 p-4">
//           <div
//             ref={containerRef}
//             className="relative shadow-2xl shadow-black border border-white/10 rounded-lg overflow-hidden max-h-[80vh] w-auto touch-none"
//             style={{
//               aspectRatio: videoDims.w
//                 ? `${videoDims.w}/${videoDims.h}`
//                 : "auto",
//               cursor: placingMode ? "crosshair" : "default",
//             }}
//             onMouseDown={handleContainerClick}
//           >
//             <video
//               ref={videoRef}
//               src={videoSrc}
//               onLoadedMetadata={onLoadedMetadata}
//               className="w-full h-full object-contain pointer-events-none block"
//               playsInline
//               muted
//             />

//             {placingMode && (
//               <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold px-6 py-2 rounded-full shadow-xl z-50 animate-pulse pointer-events-none border-2 border-white whitespace-nowrap">
//                 Click to place {placingMode === "impact" ? "Start" : "End"}{" "}
//                 Point
//               </div>
//             )}

//             <motion.div
//               className="absolute inset-0 pointer-events-none"
//               animate={{ opacity: globalOpacity }}
//               transition={{ duration: 0.2 }}
//             >
//               <svg className="absolute inset-0 w-full h-full overflow-visible z-22">
//                 <defs>
//                   <filter
//                     id="tracerDropShadow"
//                     x="-50%"
//                     y="-50%"
//                     width="200%"
//                     height="200%"
//                   >
//                     <feDropShadow
//                       dx=".5"
//                       dy="2.5"
//                       stdDeviation="1.5"
//                       floodColor="#000"
//                       floodOpacity=".65"
//                     />
//                   </filter>

//                   {tracerData &&
//                     tracerMode === "solid" &&
//                     tracerData.gradientVector && (
//                       <linearGradient
//                         id="tracerGradient"
//                         x1={tracerData.gradientVector.x1}
//                         y1={tracerData.gradientVector.y1}
//                         x2={tracerData.gradientVector.x2}
//                         y2={tracerData.gradientVector.y2}
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop
//                           offset="0%"
//                           stopColor={tracerColor}
//                           stopOpacity="0"
//                         />
//                         <stop
//                           offset="25%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.2"
//                         />
//                         <stop
//                           offset="70%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.5"
//                         />
//                         <stop
//                           offset="100%"
//                           stopColor={tracerColor}
//                           stopOpacity={tracerOpacity}
//                         />
//                       </linearGradient>
//                     )}
//                 </defs>

//                 {tracerData && (
//                   <>
//                     {showShadow && (
//                       <path
//                         d={tracerData.dShadow}
//                         fill="black"
//                         opacity="0.25"
//                       />
//                     )}
//                     <path
//                       d={tracerData.dMain}
//                       fill={
//                         tracerMode === "solid"
//                           ? "url(#tracerGradient)"
//                           : tracerColor
//                       }
//                       fillOpacity={tracerMode === "solid" ? 1 : tracerOpacity}
//                       filter="url(#tracerDropShadow)"
//                     />
//                   </>
//                 )}
//               </svg>

//               {/* Widgets */}
//               <DraggableWidget
//                 id="distance"
//                 x={widgetPos.distance.x}
//                 y={widgetPos.distance.y}
//                 visible={showDistance && impactPoint && landingPoint}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "distance", widgetPos.distance)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{
//                     boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)",
//                   }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl px-4 py-2 w-[90px] h-[55px] text-center backdrop-blur-sm pointer-events-auto flex items-baseline justify-center"
//                 >
//                   <span className="text-2xl font-medium text-white leading-none drop-shadow-md mt-1">
//                     {distDisplay}
//                   </span>
//                   <span className="text-[16px] font-bold text-white-900">
//                     {unit}
//                   </span>
//                 </div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="target"
//                 x={widgetPos.target.x}
//                 y={widgetPos.target.y}
//                 visible={showTarget}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "target", widgetPos.target)
//                 }
//                 setWidgetSize={updateWidgetSize}
//                 style={{ zIndex: 1 }}
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0], opacity: targetOpacity }}
//                   transition={{
//                     y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
//                     opacity: { duration: 0.3 },
//                   }}
//                   className="filter drop-shadow-lg pointer-events-auto"
//                 >
//                   {/* <Target size={60} className="text-red-500" strokeWidth={2} /> */}
//                   <img
//                     style={{
//                       width: 35,
//                     }}
//                     src={TargetImg}
//                     alt="Target"
//                   />
//                 </motion.div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="holeInfo"
//                 x={widgetPos.holeInfo.x}
//                 y={widgetPos.holeInfo.y}
//                 visible={showHoleInfo}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "holeInfo", widgetPos.holeInfo)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{
//                     boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)",
//                   }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl p-2 w-[75px] flex flex-col items-center backdrop-blur-sm pointer-events-auto"
//                 >
//                   <div
//                     style={{
//                       boxShadow: "0px 1.5px 1.5px 0px rgba(0,0,0,.9)",
//                     }}
//                     className="bg-white rounded-full w-12.5 h-12.5 flex items-center justify-center mb-1 shadow-inner border border-gray-200"
//                   >
//                     <span className="text-black font-black text-2xl mb-1">
//                       {holeData.num}
//                     </span>
//                   </div>
//                   <div className="text-white text-s font-bold leading-tight">
//                     Par {holeData.par}
//                   </div>
//                   <div className="flex items-center gap-1 opacity-90">
//                     <span className="text-white text-[13px]">
//                       {holeData.dist}
//                       {unit}
//                     </span>
//                   </div>
//                 </div>
//               </DraggableWidget>
//             </motion.div>

//             {/* Control Points */}
//             {impactPoint && (
//               <ControlNode
//                 x={impactPoint.x}
//                 y={impactPoint.y}
//                 color="#ef4444"
//                 label="Start"
//                 onDragStart={(e: any) => startDrag(e, "impact", impactPoint)}
//               />
//             )}
//             {landingPoint && (
//               <ControlNode
//                 x={landingPoint.x}
//                 y={landingPoint.y}
//                 color="#3b82f6"
//                 label="End"
//                 onDragStart={(e: any) => startDrag(e, "landing", landingPoint)}
//               />
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="h-24 bg-black border-t border-white/10 px-4 md:px-8 flex items-center gap-6 z-20 shrink-0">
//           <button
//             onClick={togglePlay}
//             className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors shrink-0"
//           >
//             {playing ? (
//               <Pause fill="currentColor" size={20} />
//             ) : (
//               <Play fill="currentColor" size={20} className="ml-1" />
//             )}
//           </button>

//           <div className="flex gap-2 shrink-0">
//             <button
//               onClick={() => skipFrame("back")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <button
//               onClick={() => skipFrame("fwd")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>
//           <div className="flex-1 flex flex-col justify-center gap-1">
//             <input
//               type="range"
//               min={0}
//               max={duration || 100}
//               step={0.01}
//               value={currentTime}
//               onChange={(e) => {
//                 const t = parseFloat(e.target.value);
//                 setCurrentTime(t);
//                 if (videoRef.current) videoRef.current.currentTime = t;
//               }}
//               onKeyDown={(e) => {
//                 if (
//                   e.code === "Space" ||
//                   e.code === "ArrowUp" ||
//                   e.code === "ArrowDown"
//                 ) {
//                   e.preventDefault();
//                   togglePlay();
//                 } else if (e.code === "ArrowLeft") {
//                   e.preventDefault();
//                   skipFrame("back");
//                 } else if (e.code === "ArrowRight") {
//                   e.preventDefault();
//                   skipFrame("fwd");
//                 }
//               }}
//               className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
//             />
//           </div>
//         </div>
//       </div>

//       {/* === RIGHT AREA: TOOLS SIDEBAR === */}
//       <div className="w-full lg:w-80 bg-[#0a0a0a] border-l border-white/10 flex flex-col h-[40vh] lg:h-screen overflow-y-auto shrink-0">
//         <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
//           <h2 className="text-base font-bold text-white tracking-wide">
//             Studio Tools
//           </h2>
//           <button
//             onClick={() => setVideoSrc(null)}
//             className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="p-5 space-y-6">
//           {/* JOYSTICK */}
//           {controlPoint && (
//             <div className="space-y-2">
//               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
//                 <Move size={12} /> Adjust Curve
//               </div>
//               <VirtualJoystick
//                 onMove={(dx, dy) => {
//                   if (controlPoint) {
//                     const newX = controlPoint.x + dx;
//                     const newY = controlPoint.y + dy;
//                     setControlPoint({ x: newX, y: newY });
//                   }
//                 }}
//               />
//             </div>
//           )}

//           {/* PLACEMENT */}
//           <div className="grid grid-cols-2 gap-2">
//             <button
//               onClick={() => {
//                 setPlacingMode("impact");
//                 setImpactPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "impact"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set Start
//             </button>
//             <button
//               onClick={() => {
//                 setPlacingMode("landing");
//                 setLandingPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "landing"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set End
//             </button>
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           {/* TRACER SETTINGS */}
//           <div className="space-y-4">
//             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <Settings2 size={12} className="inline mr-1" /> Style
//             </div>
//             <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
//               {["solid", "comet", "hybrid"].map((m) => (
//                 <button
//                   key={m}
//                   onClick={() => setTracerMode(m as any)}
//                   className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
//                     tracerMode === m
//                       ? "bg-amber-500 text-black"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {m}
//                 </button>
//               ))}
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex gap-1.5">
//                 <input
//                   type="color"
//                   value={tracerColor}
//                   onChange={(e) => setTracerColor(e.target.value)}
//                   className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer p-0"
//                 />
//                 {["#ff0000", "#3b82f6", "#eab308", "#ffffff"].map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => setTracerColor(c)}
//                     className={`w-6 h-6 rounded-full border-2 ${
//                       tracerColor === c
//                         ? "border-white scale-110"
//                         : "border-transparent"
//                     }`}
//                     style={{ backgroundColor: c }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* OPACITY SLIDER */}
//             <div className="space-y-1 mt-2">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Opacity</span>
//                 <span>{Math.round(tracerOpacity * 100)}%</span>
//               </div>
//               <input
//                 type="range"
//                 min={0}
//                 max={1}
//                 step={0.01}
//                 value={tracerOpacity}
//                 onChange={(e) => setTracerOpacity(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>

//             {/* WIDTH SLIDER */}
//             <div className="space-y-1">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Width</span>
//                 <span>{tracerWidth}px</span>
//               </div>
//               <input
//                 type="range"
//                 min={8}
//                 max={20}
//                 value={tracerWidth}
//                 onChange={(e) => setTracerWidth(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>
//           </div>

//           <div className="w-full h-px bg-white/5" />
//           <div className="space-y-3">
//             <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <span>Widgets</span>
//               <div className="flex items-center gap-2">
//                 <span className="text-[9px]">Scale</span>
//                 <input
//                   type="range"
//                   min={0.5}
//                   max={1.5}
//                   step={0.1}
//                   value={widgetScale}
//                   onChange={(e) => setWidgetScale(Number(e.target.value))}
//                   className="w-16 h-1 bg-zinc-800 rounded-lg accent-amber-500"
//                 />
//               </div>
//             </div>

//             {[
//               {
//                 label: "Distance",
//                 icon: Ruler,
//                 val: showDistance,
//                 set: setShowDistance,
//               },
//               {
//                 label: "Target",
//                 icon: Target,
//                 val: showTarget,
//                 set: setShowTarget,
//               },
//               {
//                 label: "Hole Info",
//                 icon: Info,
//                 val: showHoleInfo,
//                 set: setShowHoleInfo,
//               },
//               {
//                 label: "Shadow",
//                 icon: MousePointer2,
//                 val: showShadow,
//                 set: setShowShadow,
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-lg border border-white/5"
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <item.icon size={14} className="text-gray-500" /> {item.label}
//                 </div>
//                 <button
//                   onClick={() => item.set(!item.val)}
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     item.val
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {item.val && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </button>
//               </div>
//             ))}

//             {/* Unit toggle (shown when either Distance or Hole Info is enabled) */}
//             {(showDistance || showHoleInfo) && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Unit</div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setUnit("yd")}
//                     className={`flex-1 py-2 text-xs font-bold uppercase rounded ${
//                       unit === "yd"
//                         ? "bg-amber-500 text-black"
//                         : "bg-zinc-800 text-gray-400"
//                     }`}
//                   >
//                     Yards
//                   </button>
//                   <button
//                     onClick={() => setUnit("m")}
//                     className={`flex-1 py-2 text-xs font-bold uppercase rounded ${
//                       unit === "m"
//                         ? "bg-amber-500 text-black"
//                         : "bg-zinc-800 text-gray-400"
//                     }`}
//                   >
//                     Meters
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Distance Settings (only show when Distance is enabled) */}
//             {showDistance && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Distance</div>
//                 <input
//                   type="number"
//                   value={yardage}
//                   onChange={(e) => setYardage(e.target.value)}
//                   className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white"
//                   placeholder="Total Distance"
//                 />
//               </div>
//             )}

//             {/* Hole Info Settings (only show when Hole Info is enabled) */}
//             {showHoleInfo && (
//               <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
//                 <div className="text-xs font-bold text-gray-300">Hole Info</div>
//                 <div className="grid grid-cols-3 gap-2">
//                   <input
//                     value={holeData.num}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, num: e.target.value })
//                     }
//                     placeholder="#"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                   <input
//                     value={holeData.par}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, par: e.target.value })
//                     }
//                     placeholder="Par"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                   <input
//                     value={holeData.dist}
//                     onChange={(e) =>
//                       setHoleData({ ...holeData, dist: e.target.value })
//                     }
//                     placeholder="Dist"
//                     className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   Upload,
//   Play,
//   Pause,
//   Trash2,
//   Target,
//   Ruler,
//   Info,
//   Settings2,
//   ChevronRight,
//   ChevronLeft,
//   Check,
//   MousePointer2,
//   Gamepad2,
//   Home,
//   Download,
//   User,
//   UserRoundPen,
//   Hash,
//   Trophy,
// } from "lucide-react";
// import TargetImg from "../assets/target.png"; // Ensure this path is correct
// import LogoImg from "../assets/logo.png"; // Assuming you have a logo here

// // --- MATH & GEOMETRY ENGINE ---

// const getRollerCoasterPoint = (
//   p0: { x: number; y: number },
//   c: { x: number; y: number },
//   p1: { x: number; y: number },
//   t: number
// ) => {
//   // Calculate the CENTER between p0 and p1
//   const centerX = (p0.x + p1.x) / 2;

//   // Calculate how far left/right the user moved from center
//   const xOffset = c.x - centerX;

//   // Calculate the 85% point from the ORIGINAL p0 and p1 (not shifted)
//   const apexX = p0.x + (p1.x - p0.x) * 0.85;

//   // Apply the user's left/right adjustment to the apex
//   const adjustedApexX = apexX + xOffset;

//   // Use this as the control point X, keeping the same curve shape
//   const forcedControl = {
//     x: adjustedApexX, // Apex at 85% + user's left/right adjustment
//     y: c.y - 300, // Same height adjustment
//   };

//   const u = 1 - t;
//   return {
//     x: u * u * p0.x + 2 * u * t * forcedControl.x + t * t * p1.x,
//     y: u * u * p0.y + 2 * u * t * forcedControl.y + t * t * p1.y,
//   };
// };

// const sampleRollerCoaster = (P0: any, C: any, P1: any, N = 200) => {
//   const pts = [];
//   for (let i = 0; i <= N; i++) {
//     pts.push(getRollerCoasterPoint(P0, C, P1, i / N));
//   }
//   return pts;
// };

// // Exact Shadow Projection from React Native code
// const projectSubsetToGroundUsingGlobal = (
//   subsetPts: { x: number; y: number }[],
//   startIndexInFull: number,
//   fullCount: number,
//   y0: number,
//   y1: number
// ) => {
//   if (subsetPts.length < 2 || fullCount <= 0) return subsetPts;

//   const out = new Array(subsetPts.length);
//   for (let i = 0; i < subsetPts.length; i++) {
//     const globalIdx = startIndexInFull + i;
//     const tGlobal = globalIdx / fullCount;
//     // Ground line linear interpolation based on global index progress
//     const y = y0 + (y1 - y0) * tGlobal;
//     out[i] = { x: subsetPts[i].x, y };
//   }
//   return out;
// };

// const buildTaperedRibbonPath = (pts: any[], w0: number, w1: number) => {
//   if (pts.length < 2) return "";

//   const N = pts.length;
//   const left = [];
//   const right = [];
//   const lens = [0];

//   for (let i = 1; i < N; i++) {
//     const dx = pts[i].x - pts[i - 1].x;
//     const dy = pts[i].y - pts[i - 1].y;
//     lens[i] = lens[i - 1] + Math.hypot(dx, dy);
//   }
//   const totalLen = Math.max(1e-6, lens[N - 1]);

//   for (let i = 0; i < N; i++) {
//     const i0 = Math.max(0, i - 1);
//     const i1 = Math.min(N - 1, i + 1);
//     const tx = pts[i1].x - pts[i0].x;
//     const ty = pts[i1].y - pts[i0].y;
//     const tl = Math.hypot(tx, ty) || 1;
//     const nx = -ty / tl;
//     const ny = tx / tl;

//     const t = lens[i] / totalLen;
//     // Linear width interpolation
//     const w = w0 + (w1 - w0) * t;
//     const hx = w * 0.5 * nx;
//     const hy = w * 0.5 * ny;

//     left.push({ x: pts[i].x + hx, y: pts[i].y + hy });
//     right.push({ x: pts[i].x - hx, y: pts[i].y - hy });
//   }

//   return [
//     `M${left[0].x},${left[0].y}`,
//     ...left.slice(1).map((p) => `L${p.x},${p.y}`),
//     ...right
//       .slice()
//       .reverse()
//       .map((p) => `L${p.x},${p.y}`),
//     "Z",
//   ].join(" ");
// };

// // --- SUB-COMPONENTS ---

// const ControlNode = ({ x, y, color, label, onDragStart }: any) => (
//   <div
//     onPointerDown={(e) => onDragStart(e)}
//     style={{ left: x, top: y }}
//     className="absolute -ml-3 -mt-3 z-30 cursor-grab active:cursor-grabbing group touch-none"
//   >
//     <div
//       className="w-6 h-6 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform group-hover:scale-125"
//       style={{ backgroundColor: color }}
//     >
//       <div className="w-1.5 h-1.5 bg-white rounded-full" />
//     </div>
//     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 z-40">
//       {label}
//     </div>
//   </div>
// );

// const DraggableWidget = React.memo(
//   ({ children, x, y, visible, scale, onDragStart, id, setWidgetSize }: any) => {
//     const ref = useRef<HTMLDivElement>(null);
//     const prevSize = useRef({ w: 0, h: 0 });

//     useEffect(() => {
//       if (ref.current && visible) {
//         const { offsetWidth: w, offsetHeight: h } = ref.current;
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [visible, id, setWidgetSize, scale]);

//     if (!visible) return null;
//     return (
//       <div
//         ref={ref}
//         onPointerDown={(e) => onDragStart(e)}
//         style={{
//           left: x,
//           top: y,
//           transform: `scale(${scale})`,
//           transformOrigin: "top left",
//         }}
//         className="absolute z-20 cursor-grab active:cursor-grabbing hover:ring-1 ring-white/30 rounded-lg touch-none select-none"
//       >
//         {children}
//       </div>
//     );
//   }
// );

// const VirtualJoystick = ({
//   onMove,
// }: {
//   onMove: (dx: number, dy: number) => void;
// }) => {
//   const stickRef = useRef(null);
//   return (
//     <div className="w-full aspect-square bg-zinc-900 rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
//       <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
//         <div className="border-r border-b border-white"></div>
//         <div className="border-b border-white"></div>
//         <div className="border-r border-white"></div>
//         <div className=""></div>
//       </div>
//       <motion.div
//         ref={stickRef}
//         drag
//         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//         dragElastic={0.1}
//         onDrag={(_, info) => onMove(info.delta.x * 3, info.delta.y * 3)}
//         className="w-12 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 cursor-move active:cursor-grabbing flex items-center justify-center"
//       >
//         <Gamepad2 size={20} className="text-black" />
//       </motion.div>
//       <span className="absolute bottom-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none">
//         Curve Adjust
//       </span>
//     </div>
//   );
// };

// // --- PRO TV GRAPHIC COMPONENT ---
// const PlayerInfoGraphic = ({
//   data,
//   holeData,
//   unit,
// }: {
//   data: { name: string; score: string; shot: string };
//   holeData: { num: string; par: string; dist: string };
//   unit: string;
// }) => {
//   // Logic for shot counter
//   const par = parseInt(holeData.par) || 4;
//   const currentShot = parseInt(data.shot) || 1;
//   const maxSlots = par; // "Never be more numbers than hole par"

//   // Calculate window
//   // If shot is 6 on par 4, we want [3, 4, 5, 6]
//   let endNum = Math.max(par, currentShot);
//   let startNum = endNum - maxSlots + 1;

//   const shots = [];
//   for (let i = startNum; i <= endNum; i++) shots.push(i);

//   return (
//     <div
//       style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.6)" }}
//       className="flex flex-col w-[280px] rounded-lg overflow-hidden border border-white/20 font-sans"
//     >
//       {/* Upper Section */}
//       <div className="bg-[#165B94] h-[45px] flex items-center px-3 justify-between relative">
//         <div className="flex items-center gap-3">
//           {/* Logo Placeholder */}
//           <div className="w-8 h-8 rounded-md flex items-center justify-center">
//             <img
//               src={LogoImg}
//               alt="Logo"
//               className="w-6 h-6 object-contain brightness-0 invert"
//             />
//           </div>
//           <span className="text-white font-bold text-lg uppercase tracking-tight truncate max-w-[140px]">
//             {data.name}
//           </span>
//         </div>
//         <div className="w-10 h-8 bg-black/20 rounded flex items-center justify-center border border-white/10">
//           <span className="text-white font-bold text-lg">{data.score}</span>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="h-[2px] bg-amber-500 w-full" />

//       {/* Lower Section */}
//       <div className="bg-white h-[35px] flex items-center px-4 justify-between">
//         <div className="flex items-center gap-4">
//           <span className="text-black font-black text-xl mb-1">
//             {holeData.num}
//           </span>
//           <span className="text-gray-600 font-bold text-sm">
//             {holeData.dist}
//             <span className="text-[10px]">{unit}</span>
//           </span>
//         </div>

//         {/* Shot Counter */}
//         <div className="flex items-center gap-1.5">
//           {shots.map((num) => (
//             <div
//               key={num}
//               className={`w-6 h-6 rounded-full flex items-center justify-center
//     ${num === currentShot ? "bg-[#165B94] text-white" : "text-gray-400"}
//   `}
//             >
//               <span className="text-xs font-bold relative -top-[.25px]">
//                 {num}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function ShotTracerWeb() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const svgRef = useRef<SVGSVGElement>(null);

//   // State
//   const [videoSrc, setVideoSrc] = useState<string | null>(null);
//   const [videoDims, setVideoDims] = useState({ w: 0, h: 0 });
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);

//   // Playback
//   const [playing, setPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   // Geometry
//   const [impactPoint, setImpactPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [landingPoint, setLandingPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [controlPoint, setControlPoint] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   // Widgets
//   const [widgetPos, setWidgetPos] = useState({
//     distance: { x: 20, y: 20 },
//     target: { x: 150, y: 150 },
//     holeInfo: { x: 20, y: 100 },
//   });
//   const [widgetSizes, setWidgetSizes] = useState<any>({});

//   // Settings
//   const [placingMode, setPlacingMode] = useState<"impact" | "landing" | null>(
//     null
//   );
//   const [tracerMode, setTracerMode] = useState<"solid" | "comet" | "hybrid">(
//     "solid"
//   );
//   const [tracerColor, setTracerColor] = useState("#ff0000");
//   const [tracerOpacity, setTracerOpacity] = useState(0.7);
//   const [tracerWidth, setTracerWidth] = useState(12);
//   const [widgetScale, setWidgetScale] = useState(0.8);

//   const [showShadow, setShowShadow] = useState(true);
//   const [showTarget, setShowTarget] = useState(false);
//   const [showDistance, setShowDistance] = useState(true);
//   const [showHoleInfo, setShowHoleInfo] = useState(false);
//   const [showPlayerInfo, setShowPlayerInfo] = useState(false); // Toggle between basic hole info and Pro TV

//   // Data
//   const [yardage, setYardage] = useState("150");
//   const [unit, setUnit] = useState<"yd" | "m">("yd");
//   const [holeData, setHoleData] = useState({ num: "1", par: "4", dist: "420" });
//   const [playerData, setPlayerData] = useState({
//     name: "Tiger Woods",
//     score: "-2",
//     shot: "1",
//   });

//   // --- EXPORT LOGIC ---
//   const handleExport = async () => {
//     if (!videoRef.current || !containerRef.current) return;
//     setIsExporting(true);
//     setPlaying(false);
//     setExportProgress(0);

//     const video = videoRef.current;
//     const originalTime = video.currentTime;

//     try {
//       // 1. Setup Canvas
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       if (!ctx) throw new Error("No Context");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       // 2. Setup Recorder
//       const stream = canvas.captureStream(30); // 30 FPS
//       const recorder = new MediaRecorder(stream, {
//         mimeType: "video/webm; codecs=vp9",
//       });
//       const chunks: Blob[] = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) chunks.push(e.data);
//       };
//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "video/webm" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `MaxBogey_Tracer_${Date.now()}.webm`;
//         a.click();

//         // Cleanup
//         setIsExporting(false);
//         video.currentTime = originalTime;
//       };

//       recorder.start();
//       video.currentTime = 0;

//       // 3. Frame Loop
//       const processFrame = () => {
//         if (!video || video.ended || video.currentTime >= duration) {
//           recorder.stop();
//           return;
//         }

//         // Draw Video
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // Draw Overlays manually (Simple Approach: Serialize SVG)
//         // Note: For perfect sync, we might need to recreate geometry on canvas context
//         // But serializing the SVG container over the video is the standard web hack.
//         if (svgRef.current) {
//           const xml = new XMLSerializer().serializeToString(svgRef.current);
//           const svg64 = btoa(unescape(encodeURIComponent(xml)));
//           const b64Start = "data:image/svg+xml;base64,";
//           const image64 = b64Start + svg64;

//           const img = new Image();
//           img.src = image64;
//           img.onload = () => {
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//             // Advance Video
//             const step = 1 / 30;
//             video.currentTime += step;
//             setCurrentTime(video.currentTime);
//             setExportProgress(Math.round((video.currentTime / duration) * 100));

//             // Recursive loop
//             requestAnimationFrame(processFrame);
//           };
//         } else {
//           // Fallback if no SVG ref
//           video.currentTime += 1 / 30;
//           requestAnimationFrame(processFrame);
//         }
//       };

//       // Start the loop
//       processFrame();
//     } catch (e) {
//       console.error(e);
//       setIsExporting(false);
//       alert("Export failed. Please try a shorter video or different browser.");
//     }
//   };

//   // --- DRAG LOGIC ---
//   const draggingRef = useRef<{
//     type: string;
//     startX: number;
//     startY: number;
//     initialPos: { x: number; y: number };
//   } | null>(null);

//   const startDrag = (
//     e: React.PointerEvent,
//     type: string,
//     currentPos: { x: number; y: number }
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const target = e.currentTarget as HTMLElement;
//     target.setPointerCapture(e.pointerId);
//     draggingRef.current = {
//       type,
//       startX: e.clientX,
//       startY: e.clientY,
//       initialPos: { ...currentPos },
//     };
//   };

//   const onPointerMove = (e: React.PointerEvent) => {
//     if (!draggingRef.current || !containerRef.current) return;
//     const { type, startX, startY, initialPos } = draggingRef.current;
//     const deltaX = e.clientX - startX;
//     const deltaY = e.clientY - startY;
//     let newX = initialPos.x + deltaX;
//     let newY = initialPos.y + deltaY;

//     // Clamping
//     const rect = containerRef.current.getBoundingClientRect();
//     let objW = 0,
//       objH = 0;
//     if (["distance", "target", "holeInfo"].includes(type)) {
//       const size = widgetSizes[type];
//       if (size) {
//         objW = size.w * widgetScale;
//         objH = size.h * widgetScale;
//       }
//     }
//     newX = Math.max(0, Math.min(rect.width - objW, newX));
//     newY = Math.max(0, Math.min(rect.height - objH, newY));

//     if (type === "impact" && impactPoint)
//       setImpactPoint({ ...impactPoint, x: newX, y: newY });
//     else if (type === "landing" && landingPoint)
//       setLandingPoint({ ...landingPoint, x: newX, y: newY });
//     else if (type === "control" && controlPoint)
//       setControlPoint({ x: newX, y: newY });
//     else if (["distance", "target", "holeInfo"].includes(type)) {
//       setWidgetPos((prev) => ({ ...prev, [type]: { x: newX, y: newY } }));
//     }
//   };

//   const onPointerUp = (e: React.PointerEvent) => {
//     if (draggingRef.current) {
//       draggingRef.current = null;
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     }
//   };

//   const updateWidgetSize = useCallback((id: string, w: number, h: number) => {
//     setWidgetSizes((prev: any) => {
//       if (prev[id]?.w === w && prev[id]?.h === h) return prev;
//       return { ...prev, [id]: { w, h } };
//     });
//   }, []);

//   // --- FILE HANDLING ---
//   const onFileChange = (file: File) => {
//     const url = URL.createObjectURL(file);
//     setVideoSrc(url);
//     setImpactPoint(null);
//     setLandingPoint(null);
//     setControlPoint(null);
//     setPlaying(false);
//     setCurrentTime(0);
//   };

//   const onLoadedMetadata = () => {
//     if (videoRef.current && containerRef.current) {
//       setDuration(videoRef.current.duration);
//       setVideoDims({
//         w: videoRef.current.videoWidth,
//         h: videoRef.current.videoHeight,
//       });
//     }
//   };

//   useEffect(() => {
//     let handle: number;
//     const loop = () => {
//       if (videoRef.current && !videoRef.current.paused) {
//         setCurrentTime(videoRef.current.currentTime);
//         if (videoRef.current.ended) setPlaying(false);
//       }
//       handle = requestAnimationFrame(loop);
//     };
//     handle = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(handle);
//   }, []);

//   const togglePlay = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     setPlaying((prev) => {
//       if (prev) {
//         video.pause();
//       } else {
//         if (video.currentTime >= duration) {
//           video.currentTime = 0;
//         }
//         video.play();
//       }
//       return !prev;
//     });
//   }, [duration]);

//   const skipFrame = useCallback(
//     (direction: "fwd" | "back") => {
//       const video = videoRef.current;
//       if (!video) return;

//       const frameTime = 1 / 30;

//       const newTime =
//         direction === "fwd"
//           ? Math.min(duration, video.currentTime + frameTime)
//           : Math.max(0, video.currentTime - frameTime);

//       video.currentTime = newTime;
//       setCurrentTime(newTime);
//     },
//     [duration]
//   );

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
//         return;

//       switch (e.code) {
//         case "Space":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowDown":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowLeft":
//           e.preventDefault();
//           skipFrame("back");
//           break;
//         case "ArrowRight":
//           e.preventDefault();
//           skipFrame("fwd");
//           break;
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [togglePlay, skipFrame]);

//   const handleContainerClick = (e: React.MouseEvent) => {
//     if (!placingMode || !containerRef.current || !videoRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const time = videoRef.current.currentTime;
//     const pt = { x, y, time };

//     if (placingMode === "impact") {
//       setImpactPoint(pt);
//       if (landingPoint) {
//         setControlPoint({
//           x: (x + landingPoint.x) / 2,
//           y: Math.min(y, landingPoint.y) - rect.height * 0.3,
//         });
//       }
//     } else {
//       setLandingPoint(pt);
//       if (impactPoint) {
//         setControlPoint({
//           x: (impactPoint.x + x) / 2,
//           y: Math.min(impactPoint.y, y) - rect.height * 0.3,
//         });
//       }
//     }
//     setPlacingMode(null);
//   };

//   // --- TRACER ENGINE ---
//   const tracerData = useMemo(() => {
//     if (!impactPoint || !landingPoint) return null;

//     const cp = controlPoint || {
//       x: (impactPoint.x + landingPoint.x) / 2,
//       y: Math.min(impactPoint.y, landingPoint.y) - 200,
//     };

//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const rawProgress = (currentTime - impactPoint.time) / totalDuration;
//     const easedProgress = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);

//     if (easedProgress <= 0) return null;

//     const N = 240;
//     const floatIdx = easedProgress * N;

//     // USE THE NEW ROLLER COASTER CURVE HERE
//     const fullCurve = sampleRollerCoaster(impactPoint, cp, landingPoint, N);

//     // Basic visible slice
//     const endIdx = Math.floor(floatIdx);
//     let visiblePts = fullCurve.slice(0, endIdx + 1);

//     // Sub-pixel tip accuracy
//     if (easedProgress < 1) {
//       // USE THE NEW ROLLER COASTER POINT FUNCTION HERE
//       const exactTip = getRollerCoasterPoint(
//         impactPoint,
//         cp,
//         landingPoint,
//         easedProgress
//       );
//       visiblePts.push(exactTip);
//     }

//     const isLanded = currentTime > landingPoint.time;
//     let startIdx = 0;

//     // --- MODE LOGIC ---

//     if (tracerMode === "comet") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.3); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx - 15);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     } else if (tracerMode === "hybrid") {
//       // MODIFIED: Start cutting tail earlier at 60% instead of 85%
//       const hybridCutStartIdx = Math.floor(N * 0.6); // 60% instead of apexIdx

//       // Start shrinking tail after hybridCutStartIdx (60%)
//       if (endIdx > hybridCutStartIdx || isLanded) {
//         // Shrink logic
//         const progressPastCutStart =
//           (floatIdx - hybridCutStartIdx) / (N - hybridCutStartIdx);
//         startIdx = Math.floor(progressPastCutStart * (N * 0.8));

//         if (isLanded) {
//           // Slow shrink at end (1.5s)
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.5);
//           startIdx = startIdx + Math.floor((N - startIdx) * shrinkFactor);
//         }

//         if (startIdx >= visiblePts.length) startIdx = visiblePts.length - 1;
//         visiblePts = visiblePts.slice(startIdx);
//       }
//     }

//     if (visiblePts.length < 2) return null;

//     // Generate Path - DIFFERENT APPROACH FOR COMET MODE
//     let dMain = "";
//     let dShadow = "";

//     if (tracerMode === "comet" || tracerMode === "hybrid") {
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth * 0.5,
//         tracerWidth * 0.3
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         // Shadow also uses constant width (80% of main width)
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.5,
//           tracerWidth * 0.3
//         );
//       }
//     } else {
//       // SOLID Use tapered width
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth,
//         tracerWidth * 0.275
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           startIdx,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.8,
//           tracerWidth * 0.3
//         );
//       }
//     }

//     // Calculate gradient vector for solid mode (from tail to head)
//     let gradientVector = null;
//     if (tracerMode === "solid" && visiblePts.length >= 2) {
//       gradientVector = {
//         x1: visiblePts[0].x,
//         y1: visiblePts[0].y,
//         x2: visiblePts[visiblePts.length - 1].x,
//         y2: visiblePts[visiblePts.length - 1].y,
//       };
//     }

//     return { dMain, dShadow, easedProgress, gradientVector, visiblePts };
//   }, [
//     impactPoint,
//     landingPoint,
//     controlPoint,
//     currentTime,
//     tracerMode,
//     showShadow,
//     tracerWidth,
//   ]);

//   const globalOpacity = useMemo(() => {
//     if (!landingPoint) return 1;
//     if (currentTime > landingPoint.time + 1.5) {
//       // 1.5s shrink
//       const fadeProgress = (currentTime - (landingPoint.time + 1.5)) / 0.5;
//       return Math.max(0, 1 - fadeProgress);
//     }
//     return 1;
//   }, [currentTime, landingPoint]);

//   const targetOpacity = useMemo(() => {
//     if (!showTarget) return 0;
//     if (!tracerData) return 1;
//     if (tracerData.easedProgress > 0.1)
//       return Math.max(0, 1 - (tracerData.easedProgress - 0.4) / 0.2);
//     return 1;
//   }, [tracerData, showTarget]);

//   const distDisplay = useMemo(() => {
//     if (!impactPoint || !landingPoint) return 0;
//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const effectiveTime = Math.min(currentTime, landingPoint.time);
//     if (effectiveTime < impactPoint.time) return 0;
//     const rawProgress = (effectiveTime - impactPoint.time) / totalDuration;
//     const eased = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);
//     return Math.round(eased * parseInt(yardage));
//   }, [currentTime, impactPoint, landingPoint, yardage]);

//   // --- RENDER ---

//   if (!videoSrc) {
//     return (
//       <div
//         className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4"
//         onDragOver={(e) => {
//           e.preventDefault();
//           setIsDragOver(true);
//         }}
//         onDragLeave={() => setIsDragOver(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setIsDragOver(false);
//           if (e.dataTransfer.files?.[0]) onFileChange(e.dataTransfer.files[0]);
//         }}
//       >
//         <Link to="/">
//           <button className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
//             <Home size={24} /> <span className="font-bold">Home</span>
//           </button>
//         </Link>

//         <div
//           className={`max-w-md w-full bg-zinc-900 border-2 border-dashed rounded-3xl p-10 text-center shadow-2xl transition-all ${
//             isDragOver ? "border-amber-500 bg-amber-500/10" : "border-white/10"
//           }`}
//         >
//           <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
//             <Upload size={32} className="text-amber-500" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Shot Tracer Studio</h1>
//           <p className="text-gray-400 mb-8">
//             Drag & drop or select a video to start.
//           </p>
//           <label className="block w-full cursor-pointer group">
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) =>
//                 e.target.files?.[0] && onFileChange(e.target.files[0])
//               }
//               className="hidden"
//             />
//             <div className="w-full bg-amber-500 group-hover:bg-white text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
//               Select Video
//             </div>
//           </label>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col lg:flex-row overflow-hidden select-none"
//       onPointerUp={onPointerUp}
//       onPointerMove={onPointerMove}
//     >
//       {/* Export Overlay */}
//       {isExporting && (
//         <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
//           <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
//           <h2 className="text-2xl font-bold text-white mb-2">
//             Exporting Video...
//           </h2>
//           <p className="text-gray-400">
//             Rendering frame {Math.round(exportProgress)}%
//           </p>
//         </div>
//       )}

//       {/* LEFT: VIDEO STUDIO */}
//       <div className="flex-1 flex flex-col h-[calc(100vh)] lg:h-screen relative">
//         <div className="flex-1 relative flex items-center justify-center bg-zinc-950/50 p-4">
//           <div
//             ref={containerRef}
//             className="relative shadow-2xl shadow-black border border-white/10 rounded-lg overflow-hidden max-h-[80vh] w-auto touch-none"
//             style={{
//               aspectRatio: videoDims.w
//                 ? `${videoDims.w}/${videoDims.h}`
//                 : "auto",
//               cursor: placingMode ? "crosshair" : "default",
//             }}
//             onMouseDown={handleContainerClick}
//           >
//             <video
//               ref={videoRef}
//               src={videoSrc}
//               onLoadedMetadata={onLoadedMetadata}
//               className="w-full h-full object-contain pointer-events-none block"
//               playsInline
//               muted
//             />

//             {placingMode && !isExporting && (
//               <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold px-6 py-2 rounded-full shadow-xl z-50 animate-pulse pointer-events-none border-2 border-white whitespace-nowrap">
//                 Click to place {placingMode === "impact" ? "Start" : "End"}{" "}
//                 Point
//               </div>
//             )}

//             <motion.div
//               className="absolute inset-0 pointer-events-none z-5"
//               animate={{ opacity: globalOpacity }}
//               transition={{ duration: 0.2 }}
//             >
//               <svg
//                 ref={svgRef}
//                 className="absolute inset-0 w-full h-full overflow-visible"
//               >
//                 <defs>
//                   <filter
//                     id="tracerDropShadow"
//                     x="-50%"
//                     y="-50%"
//                     width="200%"
//                     height="200%"
//                   >
//                     <feDropShadow
//                       dx=".5"
//                       dy="2.5"
//                       stdDeviation="1.5"
//                       floodColor="#000"
//                       floodOpacity=".65"
//                     />
//                   </filter>
//                   <mask id="startMask" maskUnits="userSpaceOnUse">
//                     <rect x="0" y="0" width="100%" height="100%" fill="white" />
//                     {impactPoint && (
//                       <radialGradient id="fadeGrad">
//                         <stop offset="0%" stopColor="black" />
//                         <stop offset="50px" stopColor="white" />
//                       </radialGradient>
//                     )}
//                     {impactPoint && (
//                       <circle
//                         cx={impactPoint.x}
//                         cy={impactPoint.y}
//                         r="60"
//                         fill="url(#fadeGrad)"
//                       />
//                     )}
//                   </mask>
//                   {tracerData &&
//                     tracerMode === "solid" &&
//                     tracerData.gradientVector && (
//                       <linearGradient
//                         id="tracerGradient"
//                         x1={tracerData.gradientVector.x1}
//                         y1={tracerData.gradientVector.y1}
//                         x2={tracerData.gradientVector.x2}
//                         y2={tracerData.gradientVector.y2}
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop
//                           offset="0%"
//                           stopColor={tracerColor}
//                           stopOpacity="0"
//                         />
//                         <stop
//                           offset="10%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.2"
//                         />
//                         <stop
//                           offset="30%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.5"
//                         />
//                         <stop
//                           offset="100%"
//                           stopColor={tracerColor}
//                           stopOpacity={tracerOpacity}
//                         />
//                       </linearGradient>
//                     )}
//                 </defs>

//                 {tracerData && (
//                   <>
//                     {showShadow && (
//                       <path
//                         d={tracerData.dShadow}
//                         fill="black"
//                         opacity="0.25"
//                       />
//                     )}
//                     <path
//                       d={tracerData.dMain}
//                       fill={
//                         tracerMode === "solid"
//                           ? "url(#tracerGradient)"
//                           : tracerColor
//                       }
//                       fillOpacity={tracerMode === "solid" ? 1 : tracerOpacity}
//                       filter="url(#tracerDropShadow)"
//                       mask="url(#startMask)"
//                     />
//                   </>
//                 )}
//               </svg>

//               <DraggableWidget
//                 id="distance"
//                 x={widgetPos.distance.x}
//                 y={widgetPos.distance.y}
//                 visible={showDistance && impactPoint && landingPoint}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "distance", widgetPos.distance)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)" }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl px-4 py-2 w-[90px] h-[55px] text-center backdrop-blur-sm pointer-events-auto flex items-baseline justify-center"
//                 >
//                   <span className="text-2xl font-medium text-white leading-none drop-shadow-md mt-1">
//                     {distDisplay}
//                   </span>
//                   <span className="text-[16px] font-bold text-white-900">
//                     {unit}
//                   </span>
//                 </div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="holeInfo"
//                 x={widgetPos.holeInfo.x}
//                 y={widgetPos.holeInfo.y}
//                 visible={showHoleInfo}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "holeInfo", widgetPos.holeInfo)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 {showPlayerInfo ? (
//                   // PRO TV GRAPHIC
//                   <div className="pointer-events-auto">
//                     <PlayerInfoGraphic
//                       data={playerData}
//                       holeData={holeData}
//                       unit={unit}
//                     />
//                   </div>
//                 ) : (
//                   // SIMPLE HOLE INFO
//                   <div
//                     style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.6)" }}
//                     className="flex flex-col w-[70px] rounded-lg overflow-hidden border border-white/20 font-sans pointer-events-auto"
//                   >
//                     <div className="bg-[#165B94] h-[50px] flex items-center justify-center px-2 relative">
//                       <span className="text-white font-bold text-3xl">
//                         {holeData.num}
//                       </span>
//                     </div>

//                     <div className="h-[3px] bg-amber-500 w-full" />

//                     <div className="bg-white px-2  py-2 pt-[7px] flex flex-col items-center">
//                       <span className="text-gray-700 font-bold text-md">
//                         Par {holeData.par}
//                       </span>

//                       <span className="text-gray-500 font-bold text-[14px] pt-[.5px]">
//                         {holeData.dist}
//                         <span className="text-[10px] ml-[.5px]">{unit}</span>
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </DraggableWidget>
//             </motion.div>

//             <motion.div
//               className="absolute inset-0 pointer-events-none z-1"
//               animate={{ opacity: globalOpacity }}
//               transition={{ duration: 0.2 }}
//             >
//               <DraggableWidget
//                 id="target"
//                 x={widgetPos.target.x}
//                 y={widgetPos.target.y}
//                 visible={showTarget}
//                 scale={widgetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "target", widgetPos.target)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0], opacity: targetOpacity }}
//                   transition={{
//                     y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
//                     opacity: { duration: 0.3 },
//                   }}
//                   className="filter drop-shadow-lg pointer-events-auto"
//                 >
//                   <img style={{ width: 35 }} src={TargetImg} alt="Target" />
//                 </motion.div>
//               </DraggableWidget>
//             </motion.div>

//             {/* CONTROL POINTS (Hidden during export) */}
//             {!isExporting && impactPoint && (
//               <ControlNode
//                 x={impactPoint.x}
//                 y={impactPoint.y}
//                 color="#ef4444"
//                 label="Start"
//                 onDragStart={(e: any) => startDrag(e, "impact", impactPoint)}
//               />
//             )}
//             {!isExporting && landingPoint && (
//               <ControlNode
//                 x={landingPoint.x}
//                 y={landingPoint.y}
//                 color="#3b82f6"
//                 label="End"
//                 onDragStart={(e: any) => startDrag(e, "landing", landingPoint)}
//               />
//             )}
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="h-24 bg-black border-t border-white/10 px-4 md:px-8 flex items-center gap-6 z-20 shrink-0">
//           <button
//             onClick={togglePlay}
//             className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors shrink-0"
//           >
//             {playing ? (
//               <Pause fill="currentColor" size={20} />
//             ) : (
//               <Play fill="currentColor" size={20} className="ml-1" />
//             )}
//           </button>
//           <div className="flex gap-2 shrink-0">
//             <button
//               onClick={() => skipFrame("back")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <button
//               onClick={() => skipFrame("fwd")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>
//           <div className="flex-1 flex flex-col justify-center gap-1">
//             {/* <input
//               type="range"
//               min={0}
//               max={duration || 100}
//               step={0.01}
//               value={currentTime}
//               onChange={(e) => {
//                 const t = parseFloat(e.target.value);
//                 setCurrentTime(t);
//                 if (videoRef.current) videoRef.current.currentTime = t;
//               }}
//               className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
//             /> */}

//             <input
//               type="range"
//               min={0}
//               max={duration || 100}
//               step={0.01}
//               value={currentTime}
//               onChange={(e) => {
//                 const t = parseFloat(e.target.value);
//                 setCurrentTime(t);
//                 if (videoRef.current) videoRef.current.currentTime = t;
//               }}
//               onKeyDown={(e) => {
//                 if (
//                   e.code === "Space" ||
//                   e.code === "ArrowUp" ||
//                   e.code === "ArrowDown"
//                 ) {
//                   e.preventDefault();
//                   togglePlay();
//                 } else if (e.code === "ArrowLeft") {
//                   e.preventDefault();
//                   skipFrame("back");
//                 } else if (e.code === "ArrowRight") {
//                   e.preventDefault();
//                   skipFrame("fwd");
//                 }
//               }}
//               className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
//             />
//           </div>
//         </div>
//       </div>

//       {/* RIGHT: TOOLS SIDEBAR */}
//       <div className="w-full lg:w-80 bg-[#0a0a0a] border-l border-white/10 flex flex-col h-[40vh] lg:h-screen overflow-y-auto shrink-0">
//         <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => router.push("/")}
//               className="hover:bg-white/10 p-2 rounded transition-colors"
//             >
//               <Home size={18} />
//             </button>
//             <h2 className="text-base font-bold text-white tracking-wide">
//               Studio Tools
//             </h2>
//           </div>
//           <button
//             onClick={() => setVideoSrc(null)}
//             className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="p-5 space-y-6">
//           {controlPoint && (
//             <div className="space-y-2">
//               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
//                 <Gamepad2 size={12} /> Adjust Curve
//               </div>
//               <VirtualJoystick
//                 onMove={(dx, dy) => {
//                   if (controlPoint) {
//                     setControlPoint({
//                       x: controlPoint.x + dx,
//                       y: controlPoint.y + dy,
//                     });
//                   }
//                 }}
//               />
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-2">
//             <button
//               onClick={() => {
//                 setPlacingMode("impact");
//                 setImpactPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "impact"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set Start
//             </button>
//             <button
//               onClick={() => {
//                 setPlacingMode("landing");
//                 setLandingPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "landing"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set End
//             </button>
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           <div className="space-y-4">
//             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <Settings2 size={12} className="inline mr-1" /> Style
//             </div>
//             <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
//               {["solid", "comet", "hybrid"].map((m) => (
//                 <button
//                   key={m}
//                   onClick={() => setTracerMode(m as any)}
//                   className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
//                     tracerMode === m
//                       ? "bg-amber-500 text-black"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {m}
//                 </button>
//               ))}
//             </div>
//             <div className="flex gap-1.5">
//               <input
//                 type="color"
//                 value={tracerColor}
//                 onChange={(e) => setTracerColor(e.target.value)}
//                 className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer p-0"
//               />
//               {["#ff0000", "#3b82f6", "#eab308", "#ffffff"].map((c) => (
//                 <button
//                   key={c}
//                   onClick={() => setTracerColor(c)}
//                   className={`w-6 h-6 rounded-full border-2 ${
//                     tracerColor === c
//                       ? "border-white scale-110"
//                       : "border-transparent"
//                   }`}
//                   style={{ backgroundColor: c }}
//                 />
//               ))}
//             </div>
//             {/* Opacity & Width Sliders */}
//             <div className="space-y-1 mt-2">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Opacity</span>
//                 <span>{Math.round(tracerOpacity * 100)}%</span>
//               </div>
//               <input
//                 type="range"
//                 min={0}
//                 max={1}
//                 step={0.01}
//                 value={tracerOpacity}
//                 onChange={(e) => setTracerOpacity(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Width</span>
//                 <span>{tracerWidth}px</span>
//               </div>
//               <input
//                 type="range"
//                 min={8}
//                 max={20}
//                 value={tracerWidth}
//                 onChange={(e) => setTracerWidth(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           {/* WIDGETS CONFIG */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <span>Widgets</span>
//               <div className="flex items-center gap-2">
//                 <span className="text-[9px]">Scale</span>
//                 <input
//                   type="range"
//                   min={0.5}
//                   max={1.5}
//                   step={0.1}
//                   value={widgetScale}
//                   onChange={(e) => setWidgetScale(Number(e.target.value))}
//                   className="w-24 h-1 bg-zinc-800 rounded-lg accent-amber-500"
//                 />
//               </div>
//             </div>

//             <div className="bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden">
//               <div
//                 className="flex items-center justify-between p-3 cursor-pointer"
//                 onClick={() => setShowDistance(!showDistance)}
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <Ruler size={14} className="text-gray-500" /> Distance
//                 </div>
//                 <div
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     showDistance
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {showDistance && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </div>
//               </div>
//               {showDistance && (
//                 <div className="px-3 pb-3 flex gap-2 animate-in slide-in-from-top-2">
//                   <input
//                     value={yardage}
//                     onChange={(e) => setYardage(e.target.value)}
//                     className="bg-black border border-white/20 rounded px-2 py-1.5 text-xs text-white flex-1"
//                     placeholder="Distance"
//                   />
//                   <button
//                     onClick={() => setUnit(unit === "yd" ? "m" : "yd")}
//                     className="bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold border border-white/20 w-10"
//                   >
//                     {unit}
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden">
//               <div
//                 className="flex items-center justify-between p-3 cursor-pointer"
//                 onClick={() => setShowHoleInfo(!showHoleInfo)}
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <Info size={14} className="text-gray-500" /> Hole Info
//                 </div>
//                 <div
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     showHoleInfo
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {showHoleInfo && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </div>
//               </div>
//               {showHoleInfo && (
//                 <div className="px-3 pb-3 space-y-3 animate-in slide-in-from-top-2">
//                   <div className="grid grid-cols-4 gap-2">
//                     <input
//                       value={holeData.num}
//                       onChange={(e) =>
//                         setHoleData({ ...holeData, num: e.target.value })
//                       }
//                       placeholder="#"
//                       className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center col-span-1"
//                     />
//                     <input
//                       value={holeData.par}
//                       onChange={(e) =>
//                         setHoleData({ ...holeData, par: e.target.value })
//                       }
//                       placeholder="Par"
//                       className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center col-span-1"
//                     />
//                     <input
//                       value={holeData.dist}
//                       onChange={(e) =>
//                         setHoleData({ ...holeData, dist: e.target.value })
//                       }
//                       placeholder="Dist"
//                       className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center flex-1"
//                     />
//                     <button
//                       onClick={() => setUnit(unit === "yd" ? "m" : "yd")}
//                       className="bg-zinc-800 px-1 rounded text-[9px] font-bold border border-white/20 w-8"
//                     >
//                       {unit}
//                     </button>
//                   </div>

//                   <div className="pt-2 border-t border-white/10">
//                     <div className="flex justify-between items-center mb-2">
//                       <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                         <UserRoundPen size={14} className="text-gray-500" />{" "}
//                         Player Info
//                       </div>
//                       <button
//                         onClick={() => setShowPlayerInfo(!showPlayerInfo)}
//                         className={`w-8 h-4 rounded-full relative transition-colors ${
//                           showPlayerInfo ? "bg-amber-500" : "bg-gray-700"
//                         }`}
//                       >
//                         <div
//                           className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
//                             showPlayerInfo ? "left-4.5" : "left-0.5"
//                           }`}
//                         />
//                       </button>
//                     </div>
//                     {showPlayerInfo && (
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10">
//                           <User size={12} className="text-gray-500" />
//                           <input
//                             value={playerData.name}
//                             onChange={(e) =>
//                               setPlayerData({
//                                 ...playerData,
//                                 name: e.target.value,
//                               })
//                             }
//                             className="bg-transparent text-xs text-white w-full outline-none"
//                             placeholder="Player Name"
//                           />
//                         </div>
//                         <div className="flex gap-2">
//                           <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10 flex-1">
//                             <Trophy size={12} className="text-gray-500" />
//                             <input
//                               value={playerData.score}
//                               onChange={(e) =>
//                                 setPlayerData({
//                                   ...playerData,
//                                   score: e.target.value,
//                                 })
//                               }
//                               className="bg-transparent text-xs text-white w-full outline-none"
//                               placeholder="Score"
//                             />
//                           </div>
//                           <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10 flex-1">
//                             <Hash size={12} className="text-gray-500" />
//                             <input
//                               value={playerData.shot}
//                               onChange={(e) =>
//                                 setPlayerData({
//                                   ...playerData,
//                                   shot: e.target.value,
//                                 })
//                               }
//                               className="bg-transparent text-xs text-white w-full outline-none"
//                               placeholder="Shot"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {[
//               {
//                 label: "Target",
//                 icon: Target,
//                 val: showTarget,
//                 set: setShowTarget,
//               },
//               {
//                 label: "Shadow",
//                 icon: MousePointer2,
//                 val: showShadow,
//                 set: setShowShadow,
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-white/5"
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <item.icon size={14} className="text-gray-500" /> {item.label}
//                 </div>
//                 <button
//                   onClick={() => item.set(!item.val)}
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     item.val
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {item.val && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           <button
//             onClick={handleExport}
//             disabled={isExporting}
//             className="w-full bg-[#165B94] hover:bg-white hover:text-[#165B94] text-white font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
//           >
//             {isExporting ? (
//               "Processing..."
//             ) : (
//               <>
//                 <Download size={18} /> Export Video
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   Upload,
//   Play,
//   Pause,
//   Trash2,
//   Target,
//   Ruler,
//   Info,
//   Settings2,
//   ChevronRight,
//   ChevronLeft,
//   Check,
//   MousePointer2,
//   Gamepad2,
//   Home,
//   Download,
//   User,
//   UserRoundPen,
//   Hash,
//   Trophy,
// } from "lucide-react";
// import TargetImg from "../assets/target.png"; // Ensure this path is correct
// import LogoImg from "../assets/logo.png"; // Assuming you have a logo here

// // --- MATH & GEOMETRY ENGINE ---

// const getRollerCoasterPoint = (
//   p0: { x: number; y: number },
//   c: { x: number; y: number },
//   p1: { x: number; y: number },
//   t: number
// ) => {
//   // Calculate the CENTER between p0 and p1
//   const centerX = (p0.x + p1.x) / 2;

//   // Calculate how far left/right the user moved from center
//   const xOffset = c.x - centerX;

//   // Calculate the 85% point from the ORIGINAL p0 and p1 (not shifted)
//   const apexX = p0.x + (p1.x - p0.x) * 0.85;

//   // Apply the user's left/right adjustment to the apex
//   const adjustedApexX = apexX + xOffset;

//   // Use this as the control point X, keeping the same curve shape
//   const forcedControl = {
//     x: adjustedApexX, // Apex at 85% + user's left/right adjustment
//     y: c.y - 300, // Same height adjustment
//   };

//   const u = 1 - t;
//   return {
//     x: u * u * p0.x + 2 * u * t * forcedControl.x + t * t * p1.x,
//     y: u * u * p0.y + 2 * u * t * forcedControl.y + t * t * p1.y,
//   };
// };

// const sampleRollerCoaster = (P0: any, C: any, P1: any, N = 200) => {
//   const pts = [];
//   for (let i = 0; i <= N; i++) {
//     pts.push(getRollerCoasterPoint(P0, C, P1, i / N));
//   }
//   return pts;
// };

// // Exact Shadow Projection from React Native code
// const projectSubsetToGroundUsingGlobal = (
//   subsetPts: { x: number; y: number }[],
//   startIndexInFull: number,
//   fullCount: number,
//   y0: number,
//   y1: number
// ) => {
//   if (subsetPts.length < 2 || fullCount <= 0) return subsetPts;

//   const out = new Array(subsetPts.length);
//   for (let i = 0; i < subsetPts.length; i++) {
//     const globalIdx = startIndexInFull + i;
//     const tGlobal = globalIdx / fullCount;
//     // Ground line linear interpolation based on global index progress
//     const y = y0 + (y1 - y0) * tGlobal;
//     out[i] = { x: subsetPts[i].x, y };
//   }
//   return out;
// };

// const buildTaperedRibbonPath = (pts: any[], w0: number, w1: number) => {
//   if (pts.length < 2) return "";

//   const N = pts.length;
//   const left = [];
//   const right = [];
//   const lens = [0];

//   for (let i = 1; i < N; i++) {
//     const dx = pts[i].x - pts[i - 1].x;
//     const dy = pts[i].y - pts[i - 1].y;
//     lens[i] = lens[i - 1] + Math.hypot(dx, dy);
//   }
//   const totalLen = Math.max(1e-6, lens[N - 1]);

//   for (let i = 0; i < N; i++) {
//     const i0 = Math.max(0, i - 1);
//     const i1 = Math.min(N - 1, i + 1);
//     const tx = pts[i1].x - pts[i0].x;
//     const ty = pts[i1].y - pts[i0].y;
//     const tl = Math.hypot(tx, ty) || 1;
//     const nx = -ty / tl;
//     const ny = tx / tl;

//     const t = lens[i] / totalLen;
//     // Linear width interpolation
//     const w = w0 + (w1 - w0) * t;
//     const hx = w * 0.5 * nx;
//     const hy = w * 0.5 * ny;

//     left.push({ x: pts[i].x + hx, y: pts[i].y + hy });
//     right.push({ x: pts[i].x - hx, y: pts[i].y - hy });
//   }

//   return [
//     `M${left[0].x},${left[0].y}`,
//     ...left.slice(1).map((p) => `L${p.x},${p.y}`),
//     ...right
//       .slice()
//       .reverse()
//       .map((p) => `L${p.x},${p.y}`),
//     "Z",
//   ].join(" ");
// };

// // --- SUB-COMPONENTS ---

// const ControlNode = ({ x, y, color, label, onDragStart }: any) => (
//   <div
//     onPointerDown={(e) => onDragStart(e)}
//     style={{ left: x, top: y }}
//     className="absolute -ml-4 -mt-4 z-30 cursor-grab active:cursor-grabbing group touch-none"
//   >
//     <div
//       className="w-8 h-8 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform"
//       style={{ backgroundColor: color }}
//     >
//       <div className="w-0.75 h-0.75  bg-white rounded-full" />
//     </div>
//     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 z-40">
//       {label}
//     </div>
//   </div>
// );

// const DraggableWidget = React.memo(
//   ({ children, x, y, visible, scale, onDragStart, id, setWidgetSize }: any) => {
//     const ref = useRef<HTMLDivElement>(null);
//     const prevSize = useRef({ w: 0, h: 0 });

//     useEffect(() => {
//       if (ref.current && visible) {
//         const { offsetWidth: w, offsetHeight: h } = ref.current;
//         if (w !== prevSize.current.w || h !== prevSize.current.h) {
//           prevSize.current = { w, h };
//           setWidgetSize(id, w, h);
//         }
//       }
//     }, [visible, id, setWidgetSize, scale]);

//     if (!visible) return null;
//     return (
//       <div
//         ref={ref}
//         onPointerDown={(e) => onDragStart(e)}
//         style={{
//           left: x,
//           top: y,
//           transform: `scale(${scale})`,
//           transformOrigin: "top left",
//         }}
//         className="absolute z-20 cursor-grab active:cursor-grabbing hover:ring-1 ring-white/30 rounded-lg touch-none select-none"
//       >
//         {children}
//       </div>
//     );
//   }
// );

// const VirtualJoystick = ({
//   onMove,
// }: {
//   onMove: (dx: number, dy: number) => void;
// }) => {
//   const stickRef = useRef(null);
//   return (
//     <div className="w-full aspect-square bg-zinc-900 rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
//       <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
//         <div className="border-r border-b border-white"></div>
//         <div className="border-b border-white"></div>
//         <div className="border-r border-white"></div>
//         <div className=""></div>
//       </div>
//       <motion.div
//         ref={stickRef}
//         drag
//         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//         dragElastic={0.1}
//         onDrag={(_, info) => onMove(info.delta.x * 3, info.delta.y * 3)}
//         className="w-12 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 cursor-move active:cursor-grabbing flex items-center justify-center"
//       >
//         <Gamepad2 size={20} className="text-black" />
//       </motion.div>
//       <span className="absolute bottom-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none">
//         Curve Adjust
//       </span>
//     </div>
//   );
// };

// // --- PRO TV GRAPHIC COMPONENT ---
// const PlayerInfoGraphic = ({
//   data,
//   holeData,
//   unit,
// }: {
//   data: { name: string; score: string; shot: string };
//   holeData: { num: string; par: string; dist: string };
//   unit: string;
// }) => {
//   // Logic for shot counter
//   const par = parseInt(holeData.par) || 4;
//   const currentShot = parseInt(data.shot) || 1;
//   const maxSlots = par; // "Never be more numbers than hole par"

//   // Calculate window
//   // If shot is 6 on par 4, we want [3, 4, 5, 6]
//   let endNum = Math.max(par, currentShot);
//   let startNum = endNum - maxSlots + 1;

//   const shots = [];
//   for (let i = startNum; i <= endNum; i++) shots.push(i);

//   return (
//     <div
//       style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.6)" }}
//       className="flex flex-col w-[280px] rounded-lg overflow-hidden border border-white/20 font-sans"
//     >
//       {/* Upper Section */}
//       <div className="bg-[#165B94] h-[45px] flex items-center px-3 justify-between relative">
//         <div className="flex items-center gap-3">
//           {/* Logo Placeholder */}
//           <div className="w-8 h-8 rounded-md flex items-center justify-center">
//             <img
//               src={LogoImg}
//               alt="Logo"
//               className="w-6 h-6 object-contain brightness-0 invert"
//             />
//           </div>
//           <span className="text-white font-bold text-lg uppercase tracking-tight truncate max-w-[140px]">
//             {data.name}
//           </span>
//         </div>
//         <div className="w-10 h-8 bg-black/20 rounded flex items-center justify-center border border-white/10">
//           <span className="text-white font-bold text-lg">{data.score}</span>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="h-[2px] bg-amber-500 w-full" />

//       {/* Lower Section */}
//       <div className="bg-white h-[35px] flex items-center px-4 justify-between">
//         <div className="flex items-center gap-4">
//           <span className="text-black font-black text-xl mb-1">
//             {holeData.num}
//           </span>
//           <span className="text-gray-600 font-bold text-sm">
//             {holeData.dist}
//             <span className="text-[10px]">{unit}</span>
//           </span>
//         </div>

//         {/* Shot Counter */}
//         <div className="flex items-center gap-1.5">
//           {shots.map((num) => (
//             <div
//               key={num}
//               className={`w-6 h-6 rounded-full flex items-center justify-center
//     ${num === currentShot ? "bg-[#165B94] text-white" : "text-gray-400"}
//   `}
//             >
//               <span className="text-xs font-bold relative -top-[.25px]">
//                 {num}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function ShotTracerWeb() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const svgRef = useRef<SVGSVGElement>(null);

//   // State
//   const [videoSrc, setVideoSrc] = useState<string | null>(null);
//   const [videoDims, setVideoDims] = useState({ w: 0, h: 0 });
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);

//   // Playback
//   const [playing, setPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   // Geometry
//   const [impactPoint, setImpactPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [landingPoint, setLandingPoint] = useState<{
//     x: number;
//     y: number;
//     time: number;
//   } | null>(null);
//   const [controlPoint, setControlPoint] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   // Widgets
//   const [widgetPos, setWidgetPos] = useState({
//     distance: { x: 20, y: 20 },
//     target: { x: 150, y: 150 },
//     holeInfo: { x: 20, y: 100 },
//   });
//   const [widgetSizes, setWidgetSizes] = useState<any>({});

//   // Settings
//   const [placingMode, setPlacingMode] = useState<"impact" | "landing" | null>(
//     null
//   );
//   const [tracerMode, setTracerMode] = useState<"solid" | "comet" | "hybrid">(
//     "solid"
//   );
//   const [tracerColor, setTracerColor] = useState("#ff0000");
//   const [tracerOpacity, setTracerOpacity] = useState(0.7);
//   const [tracerWidth, setTracerWidth] = useState(12);
//   const [distanceScale, setDistanceScale] = useState(1.0);
//   const [holeInfoScale, setHoleInfoScale] = useState(1.0);
//   const [targetScale, setTargetScale] = useState(1.0);
//   const [showShadow, setShowShadow] = useState(true);
//   const [showTarget, setShowTarget] = useState(false);
//   const [showDistance, setShowDistance] = useState(true);
//   const [showHoleInfo, setShowHoleInfo] = useState(false);
//   const [showPlayerInfo, setShowPlayerInfo] = useState(false); // Toggle between basic hole info and Pro TV

//   // Data
//   const [yardage, setYardage] = useState("150");
//   const [unit, setUnit] = useState<"yd" | "m">("yd");
//   const [holeData, setHoleData] = useState({ num: "1", par: "4", dist: "420" });
//   const [playerData, setPlayerData] = useState({
//     name: "Tiger Woods",
//     score: "-2",
//     shot: "1",
//   });

//   // --- EXPORT LOGIC ---
//   // const handleExport = async () => {
//   //   if (!videoRef.current || !containerRef.current) return;
//   //   setIsExporting(true);
//   //   setPlaying(false);
//   //   setExportProgress(0);

//   //   const video = videoRef.current;
//   //   const originalTime = video.currentTime;

//   //   try {
//   //     // 1. Setup Canvas
//   //     const canvas = document.createElement("canvas");
//   //     const ctx = canvas.getContext("2d");
//   //     if (!ctx) throw new Error("No Context");

//   //     canvas.width = video.videoWidth;
//   //     canvas.height = video.videoHeight;

//   //     // 2. Setup Recorder
//   //     const stream = canvas.captureStream(30); // 30 FPS
//   //     const recorder = new MediaRecorder(stream, {
//   //       mimeType: "video/webm; codecs=vp9",
//   //     });
//   //     const chunks: Blob[] = [];

//   //     recorder.ondataavailable = (e) => {
//   //       if (e.data.size > 0) chunks.push(e.data);
//   //     };
//   //     recorder.onstop = () => {
//   //       const blob = new Blob(chunks, { type: "video/webm" });
//   //       const url = URL.createObjectURL(blob);
//   //       const a = document.createElement("a");
//   //       a.href = url;
//   //       a.download = `MaxBogey_Tracer_${Date.now()}.webm`;
//   //       a.click();

//   //       // Cleanup
//   //       setIsExporting(false);
//   //       video.currentTime = originalTime;
//   //     };

//   //     recorder.start();
//   //     video.currentTime = 0;

//   //     // 3. Frame Loop
//   //     const processFrame = () => {
//   //       if (!video || video.ended || video.currentTime >= duration) {
//   //         recorder.stop();
//   //         return;
//   //       }

//   //       // Draw Video
//   //       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//   //       // Draw Overlays manually (Simple Approach: Serialize SVG)
//   //       // Note: For perfect sync, we might need to recreate geometry on canvas context
//   //       // But serializing the SVG container over the video is the standard web hack.
//   //       if (svgRef.current) {
//   //         const xml = new XMLSerializer().serializeToString(svgRef.current);
//   //         const svg64 = btoa(unescape(encodeURIComponent(xml)));
//   //         const b64Start = "data:image/svg+xml;base64,";
//   //         const image64 = b64Start + svg64;

//   //         const img = new Image();
//   //         img.src = image64;
//   //         img.onload = () => {
//   //           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//   //           // Advance Video
//   //           const step = 1 / 30;
//   //           video.currentTime += step;
//   //           setCurrentTime(video.currentTime);
//   //           setExportProgress(Math.round((video.currentTime / duration) * 100));

//   //           // Recursive loop
//   //           requestAnimationFrame(processFrame);
//   //         };
//   //       } else {
//   //         // Fallback if no SVG ref
//   //         video.currentTime += 1 / 30;
//   //         requestAnimationFrame(processFrame);
//   //       }
//   //     };

//   //     // Start the loop
//   //     processFrame();
//   //   } catch (e) {
//   //     console.error(e);
//   //     setIsExporting(false);
//   //     alert("Export failed. Please try a shorter video or different browser.");
//   //   }
//   // };

//   const handleExport = () => {
//     console.log("EXPORT VIDEO!");
//   };

//   // --- DRAG LOGIC ---
//   const draggingRef = useRef<{
//     type: string;
//     startX: number;
//     startY: number;
//     initialPos: { x: number; y: number };
//   } | null>(null);

//   const startDrag = (
//     e: React.PointerEvent,
//     type: string,
//     currentPos: { x: number; y: number }
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const target = e.currentTarget as HTMLElement;
//     target.setPointerCapture(e.pointerId);
//     draggingRef.current = {
//       type,
//       startX: e.clientX,
//       startY: e.clientY,
//       initialPos: { ...currentPos },
//     };
//   };

//   const onPointerMove = (e: React.PointerEvent) => {
//     if (!draggingRef.current || !containerRef.current) return;
//     const { type, startX, startY, initialPos } = draggingRef.current;
//     const deltaX = e.clientX - startX;
//     const deltaY = e.clientY - startY;
//     let newX = initialPos.x + deltaX;
//     let newY = initialPos.y + deltaY;

//     // Clamping
//     const rect = containerRef.current.getBoundingClientRect();
//     let objW = 0,
//       objH = 0;
//     if (["distance", "target", "holeInfo"].includes(type)) {
//       const size = widgetSizes[type];
//       if (size) {
//         objW = size.w;
//         objH = size.h;
//       }
//     }
//     newX = Math.max(0, Math.min(rect.width - objW, newX));
//     newY = Math.max(0, Math.min(rect.height - objH, newY));

//     if (type === "impact" && impactPoint)
//       setImpactPoint({ ...impactPoint, x: newX, y: newY });
//     else if (type === "landing" && landingPoint)
//       setLandingPoint({ ...landingPoint, x: newX, y: newY });
//     else if (type === "control" && controlPoint)
//       setControlPoint({ x: newX, y: newY });
//     else if (["distance", "target", "holeInfo"].includes(type)) {
//       setWidgetPos((prev) => ({ ...prev, [type]: { x: newX, y: newY } }));
//     }
//   };

//   const onPointerUp = (e: React.PointerEvent) => {
//     if (draggingRef.current) {
//       draggingRef.current = null;
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     }
//   };

//   const updateWidgetSize = useCallback((id: string, w: number, h: number) => {
//     setWidgetSizes((prev: any) => {
//       if (prev[id]?.w === w && prev[id]?.h === h) return prev;
//       return { ...prev, [id]: { w, h } };
//     });
//   }, []);

//   // --- FILE HANDLING ---
//   const onFileChange = (file: File) => {
//     const url = URL.createObjectURL(file);
//     setVideoSrc(url);
//     setImpactPoint(null);
//     setLandingPoint(null);
//     setControlPoint(null);
//     setPlaying(false);
//     setCurrentTime(0);
//   };

//   const onLoadedMetadata = () => {
//     if (videoRef.current && containerRef.current) {
//       setDuration(videoRef.current.duration);
//       setVideoDims({
//         w: videoRef.current.videoWidth,
//         h: videoRef.current.videoHeight,
//       });
//     }
//   };

//   useEffect(() => {
//     let handle: number;
//     const loop = () => {
//       if (videoRef.current && !videoRef.current.paused) {
//         setCurrentTime(videoRef.current.currentTime);
//         if (videoRef.current.ended) setPlaying(false);
//       }
//       handle = requestAnimationFrame(loop);
//     };
//     handle = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(handle);
//   }, []);

//   const togglePlay = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     setPlaying((prev) => {
//       if (prev) {
//         video.pause();
//       } else {
//         if (video.currentTime >= duration) {
//           video.currentTime = 0;
//         }
//         video.play();
//       }
//       return !prev;
//     });
//   }, [duration]);

//   const skipFrame = useCallback(
//     (direction: "fwd" | "back") => {
//       const video = videoRef.current;
//       if (!video) return;

//       const frameTime = 1 / 30;

//       const newTime =
//         direction === "fwd"
//           ? Math.min(duration, video.currentTime + frameTime)
//           : Math.max(0, video.currentTime - frameTime);

//       video.currentTime = newTime;
//       setCurrentTime(newTime);
//     },
//     [duration]
//   );

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
//         return;

//       switch (e.code) {
//         case "Space":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowDown":
//           e.preventDefault();
//           togglePlay();
//           break;
//         case "ArrowLeft":
//           e.preventDefault();
//           skipFrame("back");
//           break;
//         case "ArrowRight":
//           e.preventDefault();
//           skipFrame("fwd");
//           break;
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [togglePlay, skipFrame]);

//   const handleContainerClick = (e: React.MouseEvent) => {
//     if (!placingMode || !containerRef.current || !videoRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const time = videoRef.current.currentTime;
//     const pt = { x, y, time };

//     if (placingMode === "impact") {
//       setImpactPoint(pt);
//       if (landingPoint) {
//         setControlPoint({
//           x: (x + landingPoint.x) / 2,
//           y: Math.min(y, landingPoint.y) - rect.height * 0.3,
//         });
//       }
//     } else {
//       setLandingPoint(pt);
//       if (impactPoint) {
//         setControlPoint({
//           x: (impactPoint.x + x) / 2,
//           y: Math.min(impactPoint.y, y) - rect.height * 0.3,
//         });
//       }
//     }
//     setPlacingMode(null);
//   };

//   const tracerData = useMemo(() => {
//     if (!impactPoint || !landingPoint) return null;

//     const cp = controlPoint || {
//       x: (impactPoint.x + landingPoint.x) / 2,
//       y: Math.min(impactPoint.y, landingPoint.y) - 200,
//     };

//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const rawProgress = (currentTime - impactPoint.time) / totalDuration;
//     const easedProgress = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);

//     if (easedProgress <= 0) return null;

//     const N = 240;
//     const floatIdx = easedProgress * N;

//     const fullCurve = sampleRollerCoaster(impactPoint, cp, landingPoint, N);

//     const endIdx = Math.floor(floatIdx);
//     let visiblePts = fullCurve.slice(0, endIdx + 1);

//     // Sub-pixel head interpolation
//     if (easedProgress < 1) {
//       const exactTip = getRollerCoasterPoint(
//         impactPoint,
//         cp,
//         landingPoint,
//         easedProgress
//       );
//       visiblePts.push(exactTip);
//     }

//     const isLanded = currentTime > landingPoint.time;

//     // --------------------------------------------------
//     // COMET + HYBRID (FRACTIONAL, SMOOTH TAIL SHRINK)
//     // --------------------------------------------------

//     if (tracerMode === "comet" || tracerMode === "hybrid") {
//       const cutStart =
//         tracerMode === "comet" ? Math.floor(N * 0.3) : Math.floor(N * 0.6);

//       // 🔑 DIFFERENCE BETWEEN MODES
//       const maxTailEat =
//         tracerMode === "comet"
//           ? N * 0.875 // SLOWER SHRINK (FIX)
//           : N * 0.8; // PERFECT — DO NOT TOUCH

//       if (endIdx > cutStart || isLanded) {
//         let rawStartIdx = ((floatIdx - cutStart) / (N - cutStart)) * maxTailEat;

//         if (isLanded) {
//           const timeSinceLand = currentTime - landingPoint.time;
//           const shrinkFactor = Math.min(1, timeSinceLand / 1.9);
//           rawStartIdx = rawStartIdx + (N - rawStartIdx) * shrinkFactor;
//         }

//         rawStartIdx = Math.max(0, Math.min(rawStartIdx, visiblePts.length - 2));

//         const startIdxInt = Math.floor(rawStartIdx);
//         const startFrac = rawStartIdx - startIdxInt;

//         let slicedPts = visiblePts.slice(startIdxInt);

//         // Fractional tail interpolation (critical)
//         if (slicedPts.length >= 2 && startFrac > 0) {
//           const p0 = visiblePts[startIdxInt];
//           const p1 = visiblePts[startIdxInt + 1];

//           slicedPts[0] = {
//             x: p0.x + (p1.x - p0.x) * startFrac,
//             y: p0.y + (p1.y - p0.y) * startFrac,
//           };
//         }

//         visiblePts = slicedPts;
//       }
//     }

//     if (visiblePts.length < 2) return null;

//     // --------------------------------------------------
//     // PATH BUILDING
//     // --------------------------------------------------

//     let dMain = "";
//     let dShadow = "";

//     if (tracerMode === "comet" || tracerMode === "hybrid") {
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth * 0.3,
//         tracerWidth * 0.3
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           0,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.3,
//           tracerWidth * 0.3
//         );
//       }
//     } else {
//       // SOLID
//       dMain = buildTaperedRibbonPath(
//         visiblePts,
//         tracerWidth,
//         tracerWidth * 0.275
//       );

//       if (showShadow) {
//         const groundPts = projectSubsetToGroundUsingGlobal(
//           visiblePts,
//           0,
//           N,
//           impactPoint.y,
//           landingPoint.y
//         );
//         dShadow = buildTaperedRibbonPath(
//           groundPts,
//           tracerWidth * 0.8,
//           tracerWidth * 0.3
//         );
//       }
//     }

//     let gradientVector = null;
//     if (tracerMode === "solid" && visiblePts.length >= 2) {
//       gradientVector = {
//         x1: visiblePts[0].x,
//         y1: visiblePts[0].y,
//         x2: visiblePts[visiblePts.length - 1].x,
//         y2: visiblePts[visiblePts.length - 1].y,
//       };
//     }

//     return { dMain, dShadow, easedProgress, gradientVector, visiblePts };
//   }, [
//     impactPoint,
//     landingPoint,
//     controlPoint,
//     currentTime,
//     tracerMode,
//     showShadow,
//     tracerWidth,
//   ]);

//   const globalOpacity = useMemo(() => {
//     if (!landingPoint) return 1;
//     if (currentTime > landingPoint.time + 1.5) {
//       // 1.5s shrink
//       const fadeProgress = (currentTime - (landingPoint.time + 1.5)) / 0.5;
//       return Math.max(0, 1 - fadeProgress);
//     }
//     return 1;
//   }, [currentTime, landingPoint]);

//   const targetOpacity = useMemo(() => {
//     if (!showTarget) return 0;
//     if (!tracerData) return 1;
//     if (tracerData.easedProgress > 0.1)
//       return Math.max(0, 1 - (tracerData.easedProgress - 0.4) / 0.2);
//     return 1;
//   }, [tracerData, showTarget]);

//   const distDisplay = useMemo(() => {
//     if (!impactPoint || !landingPoint) return 0;
//     const totalDuration = Math.max(0.1, landingPoint.time - impactPoint.time);
//     const effectiveTime = Math.min(currentTime, landingPoint.time);
//     if (effectiveTime < impactPoint.time) return 0;
//     const rawProgress = (effectiveTime - impactPoint.time) / totalDuration;
//     const eased = Math.pow(Math.max(0, Math.min(1, rawProgress)), 0.4);
//     return Math.round(eased * parseInt(yardage));
//   }, [currentTime, impactPoint, landingPoint, yardage]);

//   // --- RENDER ---

//   if (!videoSrc) {
//     return (
//       <div
//         className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4"
//         onDragOver={(e) => {
//           e.preventDefault();
//           setIsDragOver(true);
//         }}
//         onDragLeave={() => setIsDragOver(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setIsDragOver(false);
//           if (e.dataTransfer.files?.[0]) onFileChange(e.dataTransfer.files[0]);
//         }}
//       >
//         <Link to="/">
//           <button className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
//             <Home size={24} /> <span className="font-bold">Home</span>
//           </button>
//         </Link>

//         <div
//           className={`max-w-md w-full bg-zinc-900 border-2 border-dashed rounded-3xl p-10 text-center shadow-2xl transition-all ${
//             isDragOver ? "border-amber-500 bg-amber-500/10" : "border-white/10"
//           }`}
//         >
//           <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
//             <Upload size={32} className="text-amber-500" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Shot Tracer Studio</h1>
//           <p className="text-gray-400 mb-8">
//             Drag & drop or select a video to start.
//           </p>
//           <label className="block w-full cursor-pointer group">
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) =>
//                 e.target.files?.[0] && onFileChange(e.target.files[0])
//               }
//               className="hidden"
//             />
//             <div className="w-full bg-amber-500 group-hover:bg-white text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
//               Select Video
//             </div>
//           </label>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col lg:flex-row overflow-hidden select-none"
//       onPointerUp={onPointerUp}
//       onPointerMove={onPointerMove}
//     >
//       {/* Export Overlay */}
//       {isExporting && (
//         <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
//           <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
//           <h2 className="text-2xl font-bold text-white mb-2">
//             Exporting Video...
//           </h2>
//           <p className="text-gray-400">
//             Rendering frame {Math.round(exportProgress)}%
//           </p>
//         </div>
//       )}

//       {/* LEFT: VIDEO STUDIO */}
//       <div className="flex-1 flex flex-col h-[calc(100vh)] lg:h-screen relative">
//         <div className="flex-1 relative flex items-center justify-center bg-zinc-950/50 p-4">
//           <div
//             ref={containerRef}
//             className="relative shadow-2xl shadow-black border border-white/10 rounded-lg overflow-hidden max-h-[80vh] w-auto touch-none"
//             style={{
//               aspectRatio: videoDims.w
//                 ? `${videoDims.w}/${videoDims.h}`
//                 : "auto",
//               cursor: placingMode ? "crosshair" : "default",
//             }}
//             onMouseDown={handleContainerClick}
//           >
//             <video
//               ref={videoRef}
//               src={videoSrc}
//               onLoadedMetadata={onLoadedMetadata}
//               className="w-full h-full object-contain pointer-events-none block"
//               playsInline
//               muted
//             />

//             {placingMode && !isExporting && (
//               <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold px-6 py-2 rounded-full shadow-xl z-50 animate-pulse pointer-events-none border-2 border-white whitespace-nowrap">
//                 Click to place {placingMode === "impact" ? "Start" : "End"}{" "}
//                 Point
//               </div>
//             )}

//             <motion.div
//               className="absolute inset-0 pointer-events-none z-5"
//               animate={{ opacity: globalOpacity }}
//               transition={{ duration: 0.2 }}
//             >
//               <svg
//                 ref={svgRef}
//                 className="absolute inset-0 w-full h-full overflow-visible"
//               >
//                 <defs>
//                   <filter
//                     id="tracerDropShadow"
//                     x="-50%"
//                     y="-50%"
//                     width="200%"
//                     height="200%"
//                   >
//                     <feDropShadow
//                       dx=".5"
//                       dy="2.5"
//                       stdDeviation="1.5"
//                       floodColor="#000"
//                       floodOpacity=".65"
//                     />
//                   </filter>
//                   <mask id="startMask" maskUnits="userSpaceOnUse">
//                     <rect x="0" y="0" width="100%" height="100%" fill="white" />
//                     {impactPoint && (
//                       <radialGradient id="fadeGrad">
//                         <stop offset="0%" stopColor="black" />
//                         <stop offset="50px" stopColor="white" />
//                       </radialGradient>
//                     )}
//                     {impactPoint && (
//                       <circle
//                         cx={impactPoint.x}
//                         cy={impactPoint.y}
//                         r="60"
//                         fill="url(#fadeGrad)"
//                       />
//                     )}
//                   </mask>
//                   {tracerData &&
//                     tracerMode === "solid" &&
//                     tracerData.gradientVector && (
//                       <linearGradient
//                         id="tracerGradient"
//                         x1={tracerData.gradientVector.x1}
//                         y1={tracerData.gradientVector.y1}
//                         x2={tracerData.gradientVector.x2}
//                         y2={tracerData.gradientVector.y2}
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop
//                           offset="0%"
//                           stopColor={tracerColor}
//                           stopOpacity="0"
//                         />
//                         <stop
//                           offset="10%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.2"
//                         />
//                         <stop
//                           offset="30%"
//                           stopColor={tracerColor}
//                           stopOpacity="0.5"
//                         />
//                         <stop
//                           offset="100%"
//                           stopColor={tracerColor}
//                           stopOpacity={tracerOpacity}
//                         />
//                       </linearGradient>
//                     )}
//                 </defs>

//                 {tracerData && (
//                   <>
//                     {showShadow && (
//                       <path
//                         d={tracerData.dShadow}
//                         fill="black"
//                         opacity="0.25"
//                       />
//                     )}
//                     <path
//                       d={tracerData.dMain}
//                       fill={
//                         tracerMode === "solid"
//                           ? "url(#tracerGradient)"
//                           : tracerColor
//                       }
//                       fillOpacity={tracerMode === "solid" ? 1 : tracerOpacity}
//                       filter="url(#tracerDropShadow)"
//                       mask="url(#startMask)"
//                     />
//                   </>
//                 )}
//               </svg>

//               <DraggableWidget
//                 id="distance"
//                 x={widgetPos.distance.x}
//                 y={widgetPos.distance.y}
//                 visible={showDistance && impactPoint && landingPoint}
//                 scale={distanceScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "distance", widgetPos.distance)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <div
//                   style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.8)" }}
//                   className="bg-[#165B94] border-2 border-white/90 rounded-xl px-4 py-2 w-[90px] h-[55px] text-center backdrop-blur-sm pointer-events-auto flex items-baseline justify-center"
//                 >
//                   <span className="text-2xl font-medium text-white leading-none drop-shadow-md mt-1">
//                     {distDisplay}
//                   </span>
//                   <span className="text-[16px] font-bold text-white-900">
//                     {unit}
//                   </span>
//                 </div>
//               </DraggableWidget>

//               <DraggableWidget
//                 id="holeInfo"
//                 x={widgetPos.holeInfo.x}
//                 y={widgetPos.holeInfo.y}
//                 visible={showHoleInfo}
//                 scale={holeInfoScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "holeInfo", widgetPos.holeInfo)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 {showPlayerInfo ? (
//                   // PRO TV GRAPHIC
//                   <div className="pointer-events-auto">
//                     <PlayerInfoGraphic
//                       data={playerData}
//                       holeData={holeData}
//                       unit={unit}
//                     />
//                   </div>
//                 ) : (
//                   // SIMPLE HOLE INFO
//                   <div
//                     style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,.6)" }}
//                     className="flex flex-col w-[70px] rounded-lg overflow-hidden border border-white/20 font-sans pointer-events-auto"
//                   >
//                     <div className="bg-[#165B94] h-[50px] flex items-center justify-center px-2 relative">
//                       <span className="text-white font-bold text-3xl">
//                         {holeData.num}
//                       </span>
//                     </div>

//                     <div className="h-[3px] bg-amber-500 w-full" />

//                     <div className="bg-white px-2  py-2 pt-[7px] flex flex-col items-center">
//                       <span className="text-gray-700 font-bold text-md">
//                         Par {holeData.par}
//                       </span>

//                       <span className="text-gray-500 font-bold text-[14px] pt-[.5px]">
//                         {holeData.dist}
//                         <span className="text-[10px] ml-[.5px]">{unit}</span>
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </DraggableWidget>
//             </motion.div>

//             <motion.div
//               className="absolute inset-0 pointer-events-none z-1"
//               animate={{ opacity: globalOpacity }}
//               transition={{ duration: 0.2 }}
//             >
//               <DraggableWidget
//                 id="target"
//                 x={widgetPos.target.x}
//                 y={widgetPos.target.y}
//                 visible={showTarget}
//                 scale={targetScale}
//                 onDragStart={(e: any) =>
//                   startDrag(e, "target", widgetPos.target)
//                 }
//                 setWidgetSize={updateWidgetSize}
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0], opacity: targetOpacity }}
//                   transition={{
//                     y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
//                     opacity: { duration: 0.3 },
//                   }}
//                   className="filter drop-shadow-lg pointer-events-auto"
//                 >
//                   <img style={{ width: 35 }} src={TargetImg} alt="Target" />
//                 </motion.div>
//               </DraggableWidget>
//             </motion.div>

//             {/* CONTROL POINTS (Hidden during export) */}
//             {!isExporting && impactPoint && (
//               <ControlNode
//                 x={impactPoint.x}
//                 y={impactPoint.y}
//                 color="#ef444450"
//                 label="Start"
//                 onDragStart={(e: any) => startDrag(e, "impact", impactPoint)}
//               />
//             )}
//             {!isExporting && landingPoint && (
//               <ControlNode
//                 x={landingPoint.x}
//                 y={landingPoint.y}
//                 color="#3b83f650"
//                 label="End"
//                 onDragStart={(e: any) => startDrag(e, "landing", landingPoint)}
//               />
//             )}
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="h-24 bg-black border-t border-white/10 px-4 md:px-8 flex items-center gap-6 z-20 shrink-0">
//           <button
//             onClick={togglePlay}
//             className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors shrink-0"
//           >
//             {playing ? (
//               <Pause fill="currentColor" size={20} />
//             ) : (
//               <Play fill="currentColor" size={20} className="ml-1" />
//             )}
//           </button>
//           <div className="flex gap-2 shrink-0">
//             <button
//               onClick={() => skipFrame("back")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <button
//               onClick={() => skipFrame("fwd")}
//               className="p-2 hover:text-amber-500 text-gray-400"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>
//           <div className="flex-1 flex flex-col justify-center gap-1">
//             <input
//               type="range"
//               min={0}
//               max={duration || 100}
//               step={0.01}
//               value={currentTime}
//               onChange={(e) => {
//                 const t = parseFloat(e.target.value);
//                 setCurrentTime(t);
//                 if (videoRef.current) videoRef.current.currentTime = t;
//               }}
//               onKeyDown={(e) => {
//                 if (
//                   e.code === "Space" ||
//                   e.code === "ArrowUp" ||
//                   e.code === "ArrowDown"
//                 ) {
//                   e.preventDefault();
//                   togglePlay();
//                 } else if (e.code === "ArrowLeft") {
//                   e.preventDefault();
//                   skipFrame("back");
//                 } else if (e.code === "ArrowRight") {
//                   e.preventDefault();
//                   skipFrame("fwd");
//                 }
//               }}
//               className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
//             />
//           </div>
//         </div>
//       </div>

//       {/* RIGHT: TOOLS SIDEBAR */}
//       <div className="w-full lg:w-80 bg-[#0a0a0a] border-l border-white/10 flex flex-col h-[40vh] lg:h-screen overflow-y-scroll shrink-0 z-99">
//         <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-999">
//           <div className="flex items-center gap-2">
//             <Link to="/">
//               <button className="hover:bg-white/10 p-2 rounded transition-colors">
//                 <Home size={18} />
//               </button>
//             </Link>
//             <h2 className="text-base font-bold text-white tracking-wide">
//               Studio Tools
//             </h2>
//           </div>
//           <button
//             onClick={() => setVideoSrc(null)}
//             className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="p-5 space-y-6">
//           {controlPoint && (
//             <div className="space-y-2">
//               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
//                 <Gamepad2 size={12} /> Adjust Curve
//               </div>
//               <VirtualJoystick
//                 onMove={(dx, dy) => {
//                   if (controlPoint) {
//                     setControlPoint({
//                       x: controlPoint.x + dx,
//                       y: controlPoint.y + dy,
//                     });
//                   }
//                 }}
//               />
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-2">
//             <button
//               onClick={() => {
//                 setPlacingMode("impact");
//                 setImpactPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "impact"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set Start
//             </button>
//             <button
//               onClick={() => {
//                 setPlacingMode("landing");
//                 setLandingPoint(null);
//               }}
//               className={`py-3 rounded-lg border text-xs font-bold transition-all ${
//                 placingMode === "landing"
//                   ? "bg-amber-500 border-amber-500 text-black"
//                   : "bg-zinc-900 border-white/10 text-gray-300"
//               }`}
//             >
//               Set End
//             </button>
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           <div className="space-y-4">
//             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <Settings2 size={12} className="inline mr-1" />
//               Tracer Style
//             </div>
//             <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
//               {["solid", "comet", "hybrid"].map((m) => (
//                 <button
//                   key={m}
//                   onClick={() => setTracerMode(m as any)}
//                   className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
//                     tracerMode === m
//                       ? "bg-amber-500 text-black"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {m}
//                 </button>
//               ))}
//             </div>

//             <div className="flex items-center gap-2 mt-8 mb-8">
//               {/* Custom color (color wheel) */}
//               <div className="relative w-7 h-7 rounded-full cursor-pointer">
//                 {/* Color input MUST be on top */}
//                 <input
//                   type="color"
//                   value={tracerColor}
//                   onChange={(e) => setTracerColor(e.target.value)}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                 />

//                 {/* Visual layer */}
//                 <div className="w-7 h-7 rounded-full flex items-center justify-center relative pointer-events-none">
//                   {/* Color wheel */}
//                   <div
//                     className="w-full h-full rounded-full"
//                     style={{
//                       background:
//                         "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
//                     }}
//                   />

//                   {/* Center dot */}
//                   <div
//                     className="absolute w-5 h-5 rounded-full border-4"
//                     style={{
//                       backgroundColor: tracerColor,
//                       boxShadow: `0 0 4px ${tracerColor}`,
//                       borderColor: "black",
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Preset colors */}
//               {["#ff0000", "#3b82f6", "#eab308", "#ffffff"].map((c) => (
//                 <button
//                   key={c}
//                   onClick={() => setTracerColor(c)}
//                   className={`w-6 h-6 rounded-full border-2 transition ${
//                     tracerColor === c
//                       ? "border-white scale-110"
//                       : "border-transparent"
//                   }`}
//                   style={{ backgroundColor: c }}
//                 />
//               ))}
//             </div>

//             {/* Opacity & Width Sliders */}
//             <div className="space-y-1 mt-2">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Opacity</span>
//                 <span>{Math.round(tracerOpacity * 100)}%</span>
//               </div>
//               <input
//                 type="range"
//                 min={0}
//                 max={1}
//                 step={0.01}
//                 value={tracerOpacity}
//                 onChange={(e) => setTracerOpacity(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <div className="flex justify-between text-[10px] text-gray-400">
//                 <span>Width</span>
//                 <span>{tracerWidth}px</span>
//               </div>
//               <input
//                 type="range"
//                 min={8}
//                 max={20}
//                 value={tracerWidth}
//                 onChange={(e) => setTracerWidth(Number(e.target.value))}
//                 className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500"
//               />
//             </div>
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           {/* WIDGETS CONFIG */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//               <span>Graphics</span>
//             </div>
//             {[
//               {
//                 label: "Target",
//                 icon: Target,
//                 val: showTarget,
//                 set: setShowTarget,
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-white/5 flex-col gap-3"
//               >
//                 <div className="flex w-full justify-between">
//                   <div className="flex items-center gap-2 text-xs font-bold text-gray-300 mr-6">
//                     <item.icon size={14} className="text-gray-500" />{" "}
//                     {item.label}
//                   </div>

//                   <button
//                     onClick={() => item.set(!item.val)}
//                     className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ml-6 ${
//                       item.val
//                         ? "bg-amber-500 border-amber-500"
//                         : "border-gray-600 bg-transparent"
//                     }`}
//                   >
//                     {item.val && (
//                       <Check size={10} className="text-black" strokeWidth={4} />
//                     )}
//                   </button>
//                 </div>

//                 {showTarget && (
//                   <div className="pb-3 animate-in slide-in-from-top-2 w-full border-t border-white/10">
//                     {/* Target widget scale slider */}
//                     <div className="pt-2">
//                       <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                         <span>Scale</span>
//                         <span className="text-[9px]">
//                           {targetScale.toFixed(1)}x
//                         </span>
//                       </div>
//                       <input
//                         type="range"
//                         min={0.3}
//                         max={2.0}
//                         step={0.1}
//                         value={targetScale}
//                         onChange={(e) => setTargetScale(Number(e.target.value))}
//                         className="w-full h-1 bg-zinc-800 rounded-lg accent-amber-500 mt-1"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             <div className="bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden">
//               <div
//                 className="flex items-center justify-between p-3 cursor-pointer"
//                 onClick={() => setShowDistance(!showDistance)}
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <Ruler size={14} className="text-gray-500" /> Distance
//                 </div>
//                 <div
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     showDistance
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {showDistance && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </div>
//               </div>
//               {showDistance && (
//                 <div className="px-3 pb-3 flex gap-2 animate-in slide-in-from-top-2 align-center justify-center">
//                   <div className="flex gap-2 items-end mr-2">
//                     <input
//                       value={yardage}
//                       onChange={(e) => setYardage(e.target.value)}
//                       className="bg-black border border-white/20 rounded px-2 py-1.5 text-xs text-white w-16 h-8"
//                       placeholder="Distance"
//                     />
//                     <button
//                       onClick={() => setUnit(unit === "yd" ? "m" : "yd")}
//                       className="bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold border border-white/20 w-10 h-8"
//                     >
//                       {unit}
//                     </button>
//                   </div>

//                   {/* Distance widget scale slider */}
//                   <div className="pt-2 border-t border-white/10">
//                     <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                       <span>Scale</span>
//                       <span className="text-[9px]">
//                         {distanceScale.toFixed(1)}x
//                       </span>
//                     </div>
//                     <input
//                       type="range"
//                       min={0.5}
//                       max={1.5}
//                       step={0.1}
//                       value={distanceScale}
//                       onChange={(e) => setDistanceScale(Number(e.target.value))}
//                       className="w-full h-1 bg-zinc-800 rounded-lg accent-amber-500 mt-1"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden">
//               <div
//                 className="flex items-center justify-between p-3 cursor-pointer"
//                 onClick={() => setShowHoleInfo(!showHoleInfo)}
//               >
//                 <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                   <Info size={14} className="text-gray-500" /> Hole Info
//                 </div>
//                 <div
//                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
//                     showHoleInfo
//                       ? "bg-amber-500 border-amber-500"
//                       : "border-gray-600 bg-transparent"
//                   }`}
//                 >
//                   {showHoleInfo && (
//                     <Check size={10} className="text-black" strokeWidth={4} />
//                   )}
//                 </div>
//               </div>
//               {showHoleInfo && (
//                 <div className="px-3 pb-3 space-y-3 animate-in slide-in-from-top-2">
//                   <div className="grid grid-cols-4 gap-2">
//                     <input
//                       value={holeData.num}
//                       onChange={(e) =>
//                         setHoleData({ ...holeData, num: e.target.value })
//                       }
//                       placeholder="#"
//                       className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center col-span-1"
//                     />
//                     <input
//                       value={holeData.par}
//                       onChange={(e) =>
//                         setHoleData({ ...holeData, par: e.target.value })
//                       }
//                       placeholder="Par"
//                       className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center col-span-1"
//                     />
//                     <input
//                       value={holeData.dist}
//                       onChange={(e) =>
//                         setHoleData({ ...holeData, dist: e.target.value })
//                       }
//                       placeholder="Dist"
//                       className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-center flex-1"
//                     />
//                     <button
//                       onClick={() => setUnit(unit === "yd" ? "m" : "yd")}
//                       className="bg-zinc-800 px-1 rounded text-[9px] font-bold border border-white/20 w-8"
//                     >
//                       {unit}
//                     </button>
//                   </div>

//                   <div className="pt-2 border-t border-white/10">
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
//                         <UserRoundPen size={14} className="text-gray-500" />{" "}
//                         Player Info
//                       </div>
//                       <button
//                         onClick={() => setShowPlayerInfo(!showPlayerInfo)}
//                         className={`w-8 h-4 rounded-full relative transition-colors ${
//                           showPlayerInfo ? "bg-amber-500" : "bg-gray-700"
//                         }`}
//                       >
//                         <div
//                           className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
//                             showPlayerInfo ? "left-4.5" : "left-0.5"
//                           }`}
//                         />
//                       </button>
//                     </div>
//                     {showPlayerInfo && (
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10">
//                           <User size={12} className="text-gray-500" />
//                           <input
//                             value={playerData.name}
//                             onChange={(e) =>
//                               setPlayerData({
//                                 ...playerData,
//                                 name: e.target.value,
//                               })
//                             }
//                             className="bg-transparent text-xs text-white w-full outline-none"
//                             placeholder="Player Name"
//                           />
//                         </div>
//                         <div className="flex gap-2">
//                           <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10 flex-1">
//                             <Trophy size={12} className="text-gray-500" />
//                             <input
//                               value={playerData.score}
//                               onChange={(e) =>
//                                 setPlayerData({
//                                   ...playerData,
//                                   score: e.target.value,
//                                 })
//                               }
//                               className="bg-transparent text-xs text-white w-full outline-none"
//                               placeholder="Score"
//                             />
//                           </div>
//                           <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10 flex-1">
//                             <Hash size={12} className="text-gray-500" />
//                             <input
//                               value={playerData.shot}
//                               onChange={(e) =>
//                                 setPlayerData({
//                                   ...playerData,
//                                   shot: e.target.value,
//                                 })
//                               }
//                               className="bg-transparent text-xs text-white w-full outline-none"
//                               placeholder="Shot"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="pt-2 border-t border-white/10">
//                     <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                       <span>Scale</span>
//                       <span className="text-[9px]">
//                         {holeInfoScale.toFixed(1)}x
//                       </span>
//                     </div>
//                     <input
//                       type="range"
//                       min={0.5}
//                       max={1.5}
//                       step={0.1}
//                       value={holeInfoScale}
//                       onChange={(e) => setHoleInfoScale(Number(e.target.value))}
//                       className="w-full h-1 bg-zinc-800 rounded-lg accent-amber-500 mt-1"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {[
//               {
//                 label: "Shadow",
//                 icon: MousePointer2,
//                 val: showShadow,
//                 set: setShowShadow,
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-white/5 flex-col gap-3"
//               >
//                 <div className="flex w-full justify-between">
//                   <div className="flex items-center gap-2 text-xs font-bold text-gray-300 mr-6">
//                     <item.icon size={14} className="text-gray-500" />{" "}
//                     {item.label}
//                   </div>

//                   <button
//                     onClick={() => item.set(!item.val)}
//                     className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ml-6 ${
//                       item.val
//                         ? "bg-amber-500 border-amber-500"
//                         : "border-gray-600 bg-transparent"
//                     }`}
//                   >
//                     {item.val && (
//                       <Check size={10} className="text-black" strokeWidth={4} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="w-full h-px bg-white/5" />

//           <button
//             onClick={handleExport}
//             disabled={isExporting}
//             className="w-full bg-[#165B94] hover:bg-white hover:text-[#165B94] text-white font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
//           >
//             {isExporting ? (
//               "Processing..."
//             ) : (
//               <>
//                 <Download size={18} /> Export Video
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
