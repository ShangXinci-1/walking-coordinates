export function RouteMap() {
  return (
    <div className="route-map">
      <svg viewBox="0 0 800 640" fill="none" xmlns="http://www.w3.org/2000/svg" className="route-map-svg">
        {/* 北京简化地图轮廓 */}
        <defs>
          <linearGradient id="routeA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4444" /><stop offset="100%" stopColor="#ff8888" />
          </linearGradient>
          <linearGradient id="routeB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6644" /><stop offset="100%" stopColor="#ffaa66" />
          </linearGradient>
          <linearGradient id="routeC" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ee5533" /><stop offset="100%" stopColor="#ff9977" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* 北京轮廓 - 简化的多边形 */}
        <path d="M250,80 L380,40 L520,50 L620,90 L680,160 L700,280 L660,380 L580,440 L460,480 L340,460 L240,400 L160,320 L140,220 L160,140 Z"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="8 4" />

        {/* 内城轮廓 */}
        <rect x="280" y="120" width="280" height="240" rx="4"
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" strokeDasharray="6 3" />

        {/* 路线 A - 觉醒之路 波浪线 */}
        <path d="M310,420 C340,380 320,340 350,300 C380,260 340,230 370,200 C400,170 360,140 390,120"
          stroke="url(#routeA)" strokeWidth="3" fill="none" filter="url(#glow)" strokeLinecap="round" />
        {/* A 路线节点 */}
        {["北大红楼","《新青年》编辑部","李大钊故居","京报馆旧址"].map((name, i) => {
          const cx = [310, 350, 370, 390][i];
          const cy = [420, 300, 200, 120][i];
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="6" fill="#ff4444" stroke="#fff" strokeWidth="2" filter="url(#glow)" />
              <circle cx={cx} cy={cy} r="12" fill="none" stroke="#ff4444" strokeWidth="1" opacity="0.3" />
              <text x={cx + (i < 2 ? 16 : -16)} y={cy - 8} fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600"
                textAnchor={i < 2 ? "start" : "end"}>{name}</text>
            </g>
          );
        })}

        {/* 路线 B - 烽火之路 波浪线 */}
        <path d="M130,480 C180,440 160,380 200,340 C240,300 200,250 240,210 C280,170 250,130 300,100 C350,70 400,50 450,60"
          stroke="url(#routeB)" strokeWidth="3" fill="none" filter="url(#glow)" strokeLinecap="round" />
        {/* B 路线节点 */}
        {["抗战纪念馆","卢沟桥","百望山","贝家花园"].map((name, i) => {
          const cx = [130, 200, 240, 350][i];
          const cy = [480, 340, 210, 90][i];
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="6" fill="#ff6644" stroke="#fff" strokeWidth="2" filter="url(#glow)" />
              <circle cx={cx} cy={cy} r="12" fill="none" stroke="#ff6644" strokeWidth="1" opacity="0.3" />
              <text x={cx + (i < 2 ? 14 : -14)} y={cy - 8} fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600"
                textAnchor={i < 2 ? "start" : "end"}>{name}</text>
            </g>
          );
        })}

        {/* 路线 C - 进京之路 波浪线 */}
        <path d="M580,440 C560,390 530,350 500,300 C470,250 440,200 400,150 C360,100 320,80 280,60"
          stroke="url(#routeC)" strokeWidth="3" fill="none" filter="url(#glow)" strokeLinecap="round" />
        {/* C 路线节点 */}
        {["香山纪念地","双清别墅","清华园车站"].map((name, i) => {
          const cx = [580, 500, 400][i];
          const cy = [440, 300, 150][i];
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="6" fill="#ee5533" stroke="#fff" strokeWidth="2" filter="url(#glow)" />
              <circle cx={cx} cy={cy} r="12" fill="none" stroke="#ee5533" strokeWidth="1" opacity="0.3" />
              <text x={cx - 14} y={cy - 8} fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600"
                textAnchor="end">{name}</text>
            </g>
          );
        })}

        {/* 图例 */}
        <g transform="translate(540, 520)">
          {[{color:"#ff4444",label:"觉醒之路"},{color:"#ff6644",label:"烽火之路"},{color:"#ee5533",label:"进京之路"}].map((item, i) => (
            <g key={i} transform={`translate(0,${i * 24})`}>
              <line x1="0" y1="0" x2="40" y2="0" stroke={item.color} strokeWidth="3" filter="url(#glow)" />
              <circle cx="20" cy="0" r="4" fill={item.color} stroke="#fff" strokeWidth="1" />
              <text x="50" y="4" fill="rgba(255,255,255,0.6)" fontSize="11">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
