interface RoutePoint { cx: number; cy: number; name: string; }

interface RouteMapRoute {
  id: string;
  title: string;
  color: string;
  path: string;
  points: RoutePoint[];
}

interface RouteMapProps {
  routes: RouteMapRoute[];
  activeRoute: number;
  activeSite: number;
  onSelectSite: (routeIndex: number, siteIndex: number) => void;
}

export function RouteMap({ routes, activeRoute, activeSite, onSelectSite }: RouteMapProps) {
  return (
    <div className="route-map">
      <svg viewBox="0 0 900 640" fill="none" xmlns="http://www.w3.org/2000/svg" className="route-map-svg">
        <defs>
          <filter id="dotGlow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lineGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* 背景 - 中国地图最简轮廓 */}
        <path d="M420,60 L480,40 L540,45 L600,55 L660,70 L720,90 L780,120 L820,170 L850,220 L860,290 L850,360 L820,420 L770,470 L710,510 L640,540 L560,560 L480,550 L400,530 L320,490 L260,440 L210,380 L180,310 L170,240 L190,170 L230,110 L320,70 Z"
          fill="rgba(255,255,255,.02)" stroke="rgba(255,255,255,.06)" strokeWidth="1.5" />

        {/* 北京区域高亮 */}
        <circle cx="520" cy="180" r="80" fill="rgba(255,50,50,.04)" stroke="rgba(255,100,100,.08)" strokeWidth="1" strokeDasharray="4 3" />
        <text x="520" y="300" textAnchor="middle" fill="rgba(255,255,255,.08)" fontSize="13" fontWeight="700" letterSpacing=".1em">北京</text>

        {/* 三条波浪路线 */}
        {routes.map((route, ri) => (
          <g key={route.id}>
            <path d={route.path}
              stroke={route.color}
              strokeWidth={activeRoute === ri ? 3.5 : 2}
              fill="none"
              filter={activeRoute === ri ? "url(#lineGlow)" : undefined}
              strokeLinecap="round"
              opacity={activeRoute === ri ? 1 : 0.35}
              style={{ transition: "all .4s ease" }} />
            {/* 地点圆点 */}
            {route.points.map((pt, si) => {
              const isActive = activeRoute === ri && activeSite === si;
              return (
                <g key={pt.name}
                   onClick={() => onSelectSite(ri, si)}
                   style={{ cursor: "pointer" }}
                   className="map-dot-group">
                  {/* 可点击区域 */}
                  <circle cx={pt.cx} cy={pt.cy} r="20" fill="transparent" />
                  {/* 外圈脉冲 */}
                  {isActive && <circle cx={pt.cx} cy={pt.cy} r="16" fill="none" stroke={route.color} strokeWidth="1" opacity=".3">
                    <animate attributeName="r" from="10" to="22" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" from=".4" to="0" dur="2s" repeatCount="indefinite"/>
                  </circle>}
                  {/* 圆点 */}
                  <circle cx={pt.cx} cy={pt.cy} r={isActive ? 8 : 5}
                    fill={isActive ? "#fff" : route.color}
                    stroke={isActive ? route.color : "#fff"}
                    strokeWidth={isActive ? 3 : 1.5}
                    filter={isActive ? "url(#dotGlow)" : undefined}
                    style={{ transition: "all .3s ease" }} />
                  {/* 标签 */}
                  <text x={pt.cx + (pt.cx > 700 ? -12 : 12)}
                    y={pt.cy - 10}
                    fill={isActive ? "#fff" : "rgba(255,255,255,.55)"}
                    fontSize={isActive ? 12 : 10}
                    fontWeight={isActive ? 700 : 500}
                    textAnchor={pt.cx > 700 ? "end" : "start"}
                    style={{ transition: "all .3s ease", pointerEvents: "none" }}>
                    {pt.name}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        {/* 图例 */}
        <g transform="translate(680, 560)">
          {routes.map((r, i) => (
            <g key={i} transform={`translate(0,${i*22})`}>
              <line x1="0" y1="0" x2="30" y2="0" stroke={r.color} strokeWidth="2.5" filter="url(#lineGlow)"/>
              <circle cx="15" cy="0" r="4" fill={r.color} stroke="#fff" strokeWidth="1"/>
              <text x="40" y="4" fill="rgba(255,255,255,.55)" fontSize="11" fontWeight="600">{r.title}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
