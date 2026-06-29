interface TimelinePoint {
  date: string;
  percentage: number;
}

interface WellbeingChartProps {
  timeline: TimelinePoint[] | undefined;
  onViewDetails: () => void;
}

function generateChartPath(timeline: TimelinePoint[] | undefined) {
  if (!timeline || timeline.length === 0) {
    return {
      area: "M 0 220 L 1000 220 L 1000 256 L 0 256 Z",
      line: "M 0 220 L 1000 220",
      points: undefined,
    };
  }

  const pts = timeline.map((report, idx) => {
    const N = timeline.length;
    const xVal = N > 1 ? Math.round((idx / (N - 1)) * 1000) : 500;
    const yVal = Math.round(220 - (report.percentage / 100) * 160);
    return { x: xVal, y: yVal };
  });

  if (pts.length === 1) {
    return {
      area: `M 0 256 L 0 ${pts[0].y} L 1000 ${pts[0].y} L 1000 256 Z`,
      line: `M 0 ${pts[0].y} L 1000 ${pts[0].y}`,
      points: pts,
    };
  }

  let linePath = `M ${pts[0].x} ${pts[0].y}`;
  for (let idx = 1; idx < pts.length; idx++) {
    linePath += ` L ${pts[idx].x} ${pts[idx].y}`;
  }
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} 256 L ${pts[0].x} 256 Z`;

  return { area: areaPath, line: linePath, points: pts };
}

export function WellbeingChart({ timeline, onViewDetails }: WellbeingChartProps) {
  const paths = generateChartPath(timeline);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900">Well-being Trajectory</h3>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Historical scores based on check-ins
          </p>
        </div>
        <button
          onClick={onViewDetails}
          className="text-sm font-bold text-plum hover:text-plum/90 bg-plum/10 hover:bg-plum/20 px-4 py-2 rounded-xl transition-colors cursor-pointer border-none"
        >
          View Details
        </button>
      </div>

      <div className="w-full h-64 relative flex items-end justify-between pl-8 pb-6 pr-4">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs font-bold text-slate-400">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-8 right-4 top-2 bottom-6 flex flex-col justify-between pointer-events-none">
          <div className="w-full h-px bg-slate-100" />
          <div className="w-full h-px bg-slate-100" />
          <div className="w-full h-px bg-slate-100" />
          <div className="w-full h-px bg-slate-100" />
          <div className="w-full h-px bg-slate-300" /> {/* Baseline */}
        </div>

        {/* Chart SVG */}
        <div className="absolute inset-0 left-8 bottom-6 right-4 overflow-hidden">
          <svg className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7A5B93" />
                <stop offset="100%" stopColor="#AD6A82" />
              </linearGradient>
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A5B93" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7A5B93" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={paths.area} fill="url(#area-gradient)" />
            <path
              d={paths.line}
              fill="none"
              stroke="url(#chart-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {paths.points &&
              paths.points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={idx === paths.points!.length - 1 ? "6" : "4"}
                  fill={idx === paths.points!.length - 1 ? "#fff" : "#7A5B93"}
                  stroke={idx === paths.points!.length - 1 ? "#7A5B93" : "none"}
                  strokeWidth={idx === paths.points!.length - 1 ? "3" : "0"}
                  className="drop-shadow-md"
                />
              ))}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-8 right-4 flex justify-between text-[10px] font-bold text-slate-400">
          {timeline && timeline.length > 0 ? (
            timeline.map((report, idx) => {
              const N = timeline.length;
              const step = Math.max(1, Math.round(N / 4));
              const isLabel = idx === 0 || idx === N - 1 || (idx % step === 0 && idx !== 0 && idx !== N - 1);
              const d = new Date(report.date);
              return (
                <span key={idx}>
                  {isLabel ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
                </span>
              );
            })
          ) : (
            <>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
