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
      <svg viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="route-map-svg">
        <defs>
          <filter id="dotGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lineGlow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="bgGlow"><feGaussianBlur stdDeviation="15" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* 背景光晕 */}
        <circle cx="500" cy="280" r="250" fill="rgba(255,60,60,.03)" filter="url(#bgGlow)" />

        {/* 中国地图形似轮廓 */}
        <path d="M450,60 L510,40 L570,45 L630,55 L690,70 L750,90 L810,120 L850,170 L880,220 L890,290 L880,360 L850,420 L800,470 L740,510 L670,540 L590,560 L510,550 L430,530 L350,490 L290,440 L240,380 L210,310 L200,240 L220,170 L260,110 L350,70 Z"
          fill="rgba(255,255,255,.015)" stroke="rgba(255,255,255,.04)" strokeWidth="1.2" />

        {/* 北京圈 */}
        <circle cx="540" cy="200" r="100" fill="rgba(255,50,50,.02)" stroke="rgba(255,100,100,.05)" strokeWidth="1" strokeDasharray="4 4" />
        <text x="540" y="320" textAnchor="middle" fill="rgba(255,255,255,.06)" fontSize="14" fontWeight="700" letterSpacing=".15em">北京市</text>

        {/* 路线切换 */}
        {routes.map((route, ri) => {
          const isActiveRoute = activeRoute === ri;
          return (
            <g key={route.id}>
              {/* 波浪路线 */}
              <path d={route.path}
                stroke={route.color}
                strokeWidth={isActiveRoute ? 4 : 2}
                fill="none"
                filter={isActiveRoute ? "url(#lineGlow)" : undefined}
                strokeLinecap="round"
                opacity={isActiveRoute ? 1 : 0.3}
                style={{ transition: "all .4s var(--ease)" }} />
              {/* 路线发光底线 */}
              <path d={route.path}
                stroke={route.color}
                strokeWidth={isActiveRoute ? 8 : 0}
                fill="none"
                opacity={isActiveRoute ? .15 : 0}
                strokeLinecap="round" />

              {/* 地点点 */}
              {route.points.map((pt, si) => {
                const isActiveDot = isActiveRoute && activeSite === si;
                return (
                  <g key={pt.name}
                     onClick={() => onSelectSite(ri, si)}
                     style={{ cursor: "pointer" }}
                     className="map-dot-group">
                    <circle cx={pt.cx} cy={pt.cy} r="26" fill="transparent" />
                    {isActiveDot && <circle cx={pt.cx} cy={pt.cy} r="18" fill="none" stroke={route.color} strokeWidth="1.5" opacity=".25">
                      <animate attributeName="r" from="12" to="24" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" from=".35" to="0" dur="2s" repeatCount="indefinite"/>
                    </circle>}
                    <circle cx={pt.cx} cy={pt.cy} r={isActiveDot ? 9 : 6}
                      fill={isActiveDot ? "#fff" : route.color}
                      stroke={isActiveDot ? route.color : "#fff"}
                      strokeWidth={isActiveDot ? 3.5 : 2}
                      filter={isActiveDot ? "url(#dotGlow)" : undefined}
                      style={{ transition: "all .3s var(--ease)" }} />
                    {isActiveDot && (
                      <rect x={pt.cx + (pt.cx > 700 ? -120 : 16)} y={pt.cy - 28} width={120} height={32} rx="4"
                        fill="rgba(0,0,0,.75)" />
                    )}
                    <text x={pt.cx + (pt.cx > 700 ? -16 : 16)}
                      y={pt.cy + 10}
                      fill={isActiveDot ? "#fff" : "rgba(255,255,255,.6)"}
                      fontSize={isActiveDot ? 13 : 11}
                      fontWeight={isActiveDot ? 700 : 500}
                      textAnchor={pt.cx > 700 ? "end" : "start"}
                      style={{ transition: "all .3s var(--ease)", pointerEvents: "none" }}>
                      {pt.name}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* 图例 */}
        <g transform="translate(720, 600)">
          {routes.map((r, i) => (
            <g key={i} transform={`translate(0,${i*26})`}>
              <line x1="0" y1="0" x2="30" y2="0" stroke={r.color} strokeWidth="3" filter="url(#lineGlow)"/>
              <circle cx="15" cy="0" r="4" fill={r.color} stroke="#fff" strokeWidth="1"/>
              <text x="40" y="4" fill="rgba(255,255,255,.5)" fontSize="12" fontWeight="600">{r.title}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
