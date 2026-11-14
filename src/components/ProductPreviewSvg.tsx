import React from 'react';
import { MaterialId, PatternId, ProductCategory } from '../types/businessModel';

interface ProductPreviewSvgProps {
  category: ProductCategory;
  primaryColor: string;
  accentColor: string;
  material: MaterialId;
  pattern: PatternId;
  engraving: string;
  showProtectionLayers?: boolean;
  className?: string;
}

export const ProductPreviewSvg: React.FC<ProductPreviewSvgProps> = ({
  category,
  primaryColor,
  accentColor,
  material,
  pattern,
  engraving,
  showProtectionLayers = false,
  className = 'w-full h-full max-w-full max-h-full block',
}) => {
  const cleanEngraving = engraving.trim().toUpperCase().slice(0, 10);
  const normalizedHex = primaryColor.toUpperCase();
  const isLightPrimary =
    normalizedHex === '#E2E8F0' || normalizedHex === '#EDEAE2' || normalizedHex === '#EAB308';
  const engravingFill = isLightPrimary ? '#14221B' : '#FAFAF7';
  const subtleStroke = isLightPrimary ? 'rgba(20,34,27,0.22)' : 'rgba(255,255,255,0.26)';
  const uid = `pat-${category}-${pattern}-${primaryColor.replace('#', '')}-${accentColor.replace('#', '')}`;

  const renderDefs = () => (
    <defs>
      <linearGradient id={`${uid}-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={material === 'anodized-guard' ? 0.34 : 0.18} />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.03} />
        <stop offset="100%" stopColor="#000000" stopOpacity={0.2} />
      </linearGradient>

      <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
        <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
      </radialGradient>

      {pattern === 'topographic' && (
        <pattern id={uid} width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M0 14 Q 11 4, 22 14 T 44 14 M0 28 Q 11 18, 22 28 T 44 28 M0 42 Q 11 32, 22 42 T 44 42"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeOpacity="0.52"
          />
        </pattern>
      )}

      {pattern === 'kinetic-grid' && (
        <pattern id={uid} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke={subtleStroke} strokeWidth="1" />
          <circle cx="0" cy="0" r="1.6" fill={accentColor} fillOpacity="0.65" />
        </pattern>
      )}

      {material === 'recycled-knit' && (
        <pattern id={`${uid}-knit`} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="none" stroke={subtleStroke} strokeWidth="0.8" />
        </pattern>
      )}
    </defs>
  );

  if (category === 'phone') {
    return (
      <svg
        viewBox="0 0 320 310"
        preserveAspectRatio="xMidYMid meet"
        className={className}
        role="img"
        aria-label="Custom Active Grip Phone Armor preview"
      >
        {renderDefs()}
        <circle cx="160" cy="150" r="130" fill={`url(#${uid}-glow)`} />
        <ellipse cx="160" cy="288" rx="68" ry="9" fill="#14221B" fillOpacity="0.14" />

        {/* Outer shock bumper */}
        <rect
          x="94"
          y="22"
          width="132"
          height="254"
          rx="28"
          fill={primaryColor}
          stroke={material === 'anodized-guard' ? accentColor : subtleStroke}
          strokeWidth={material === 'anodized-guard' ? 4 : 2}
        />

        {/* Corner air-pocket bumpers */}
        <path d="M94 54 L94 46 Q94 22 118 22 L126 22" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M226 54 L226 46 Q226 22 202 22 L194 22" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M94 244 L94 252 Q94 276 118 276 L126 276" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M226 244 L226 252 Q226 276 202 276 L194 276" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />

        {/* Pattern overlay */}
        {(pattern === 'topographic' || pattern === 'kinetic-grid') && (
          <rect x="99" y="27" width="122" height="244" rx="24" fill={`url(#${uid})`} />
        )}
        {material === 'recycled-knit' && (
          <rect x="99" y="27" width="122" height="244" rx="24" fill={`url(#${uid}-knit)`} />
        )}
        {pattern === 'pace-stripe' && (
          <>
            <rect x="148" y="24" width="11" height="250" fill={accentColor} fillOpacity="0.92" />
            <rect x="163" y="24" width="4" height="250" fill={accentColor} fillOpacity="0.58" />
          </>
        )}

        {/* Camera module bezel */}
        <rect x="108" y="36" width="54" height="58" rx="14" fill="#14221B" stroke={accentColor} strokeWidth="2.5" />
        <circle cx="123" cy="51" r="8.5" fill="#1F352A" stroke="#6E9475" strokeWidth="1.5" />
        <circle cx="123" cy="78" r="8.5" fill="#1F352A" stroke="#6E9475" strokeWidth="1.5" />
        <circle cx="147" cy="64" r="8.5" fill="#1F352A" stroke="#6E9475" strokeWidth="1.5" />
        <circle cx="147" cy="46" r="3" fill="#FAFAF7" />

        {/* Active Grip Magnetic Ring */}
        <circle cx="160" cy="156" r="32" fill="none" stroke={accentColor} strokeWidth="5.5" strokeOpacity="0.9" />
        <line x1="160" y1="194" x2="160" y2="210" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" />

        {/* Side grip ribs */}
        {[90, 102, 114, 126, 138, 150, 162, 174, 186, 198].map((y) => (
          <g key={y}>
            <line x1="89" y1={y} x2="95" y2={y} stroke={accentColor} strokeWidth="2.8" strokeLinecap="round" />
            <line x1="225" y1={y} x2="231" y2={y} stroke={accentColor} strokeWidth="2.8" strokeLinecap="round" />
          </g>
        ))}

        {/* Custom Monogram Engraving */}
        {cleanEngraving && (
          <text
            x="160"
            y="244"
            textAnchor="middle"
            fill={engravingFill}
            fontSize="13"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
            letterSpacing="2"
          >
            {cleanEngraving}
          </text>
        )}

        <rect x="94" y="22" width="132" height="254" rx="28" fill={`url(#${uid}-sheen)`} pointerEvents="none" />

        {showProtectionLayers && (
          <g>
            <rect x="86" y="14" width="148" height="270" rx="34" fill="none" stroke="#15803D" strokeWidth="2" strokeDasharray="5 4" />
            <line x1="226" y1="42" x2="246" y2="42" stroke="#14221B" strokeWidth="1.5" />
            <text x="249" y="45" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#14221B" fontWeight="600">
              AIR POCKET
            </text>
            <line x1="231" y1="150" x2="246" y2="150" stroke="#14221B" strokeWidth="1.5" />
            <text x="249" y="153" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#14221B" fontWeight="600">
              SWEAT RAIL
            </text>
          </g>
        )}
      </svg>
    );
  }

  if (category === 'earbuds') {
    return (
      <svg
        viewBox="0 0 320 310"
        preserveAspectRatio="xMidYMid meet"
        className={className}
        role="img"
        aria-label="Custom Carabiner Earbud Shell preview"
      >
        {renderDefs()}
        <circle cx="155" cy="155" r="126" fill={`url(#${uid}-glow)`} />
        <ellipse cx="152" cy="272" rx="74" ry="10" fill="#14221B" fillOpacity="0.14" />

        {/* Carabiner Sport Clip */}
        <path
          d="M220 100 L254 100 A 18 18 0 0 1 254 136 L224 136"
          fill="none"
          stroke={accentColor}
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        <rect x="212" y="104" width="18" height="28" rx="4" fill="#14221B" />

        {/* Main Armored Shell */}
        <rect
          x="74"
          y="72"
          width="152"
          height="178"
          rx="44"
          fill={primaryColor}
          stroke={material === 'anodized-guard' ? accentColor : subtleStroke}
          strokeWidth="3"
        />
        {(pattern === 'topographic' || pattern === 'kinetic-grid') && (
          <rect x="78" y="76" width="144" height="170" rx="40" fill={`url(#${uid})`} />
        )}
        {material === 'recycled-knit' && (
          <rect x="78" y="76" width="144" height="170" rx="40" fill={`url(#${uid}-knit)`} />
        )}
        {pattern === 'pace-stripe' && (
          <rect x="108" y="74" width="14" height="174" fill={accentColor} fillOpacity="0.9" />
        )}

        {/* Hinge Latch Seam */}
        <line x1="76" y1="134" x2="224" y2="134" stroke="#14221B" strokeWidth="4" strokeOpacity="0.55" />
        <rect x="130" y="124" width="40" height="20" rx="6" fill={accentColor} />
        <circle cx="150" cy="134" r="3" fill="#14221B" />

        {/* LED Charge Window */}
        <circle cx="150" cy="168" r="4.5" fill="#16A34A" />

        {/* Tactile Grip Corner Bumpers */}
        <path d="M74 192 L74 208 Q74 250 116 250 L130 250" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M226 192 L226 208 Q226 250 184 250 L170 250" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />

        {cleanEngraving && (
          <text
            x="150"
            y="214"
            textAnchor="middle"
            fill={engravingFill}
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
            letterSpacing="2"
          >
            {cleanEngraving}
          </text>
        )}
        <rect x="74" y="72" width="152" height="178" rx="44" fill={`url(#${uid}-sheen)`} pointerEvents="none" />

        {showProtectionLayers && (
          <g>
            <rect x="66" y="64" width="168" height="194" rx="50" fill="none" stroke="#15803D" strokeWidth="2" strokeDasharray="5 4" />
            <text x="150" y="48" textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#14221B" fontWeight="600">
              SWEAT-SEALED HINGE LOCK
            </text>
          </g>
        )}
      </svg>
    );
  }

  if (category === 'laptop') {
    return (
      <svg
        viewBox="0 0 340 280"
        preserveAspectRatio="xMidYMid meet"
        className={className}
        role="img"
        aria-label="Custom 360 Ribbed Laptop Sleeve preview"
      >
        {renderDefs()}
        <circle cx="170" cy="140" r="135" fill={`url(#${uid}-glow)`} />
        <ellipse cx="170" cy="252" rx="124" ry="11" fill="#14221B" fillOpacity="0.14" />

        {/* Sleeve Body */}
        <rect
          x="30"
          y="44"
          width="280"
          height="192"
          rx="18"
          fill={primaryColor}
          stroke={material === 'anodized-guard' ? accentColor : subtleStroke}
          strokeWidth="3"
        />

        {(pattern === 'topographic' || pattern === 'kinetic-grid') && (
          <rect x="34" y="48" width="272" height="184" rx="15" fill={`url(#${uid})`} />
        )}
        {material === 'recycled-knit' && (
          <rect x="34" y="48" width="272" height="184" rx="15" fill={`url(#${uid}-knit)`} />
        )}
        {pattern === 'pace-stripe' && (
          <>
            <rect x="70" y="46" width="18" height="188" fill={accentColor} fillOpacity="0.92" />
            <rect x="94" y="46" width="6" height="188" fill={accentColor} fillOpacity="0.58" />
          </>
        )}

        {/* Suspended Corner Shock Cradles */}
        <path d="M30 74 L30 60 Q30 44 46 44 L62 44" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M310 74 L310 60 Q310 44 294 44 L278 44" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M30 206 L30 220 Q30 236 46 236 L62 236" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M310 206 L310 220 Q310 236 294 236 L278 236" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />

        {/* Armor Compression Ribs */}
        {[128, 156, 184, 212].map((x) => (
          <line key={x} x1={x} y1="64" x2={x} y2="216" stroke={subtleStroke} strokeWidth="3" strokeLinecap="round" />
        ))}

        {/* Quick-Access Utility Pocket Seam */}
        <line x1="34" y1="184" x2="306" y2="184" stroke={accentColor} strokeWidth="2.5" strokeDasharray="6 4" />

        {/* Brand & Custom Monogram Patch */}
        <rect x="206" y="196" width="88" height="26" rx="6" fill="#14221B" stroke={accentColor} strokeWidth="1.5" />
        <text
          x="250"
          y="213"
          textAnchor="middle"
          fill="#FAFAF7"
          fontSize="10.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          letterSpacing="1.5"
        >
          {cleanEngraving || 'CADENCE'}
        </text>
        <rect x="30" y="44" width="280" height="192" rx="18" fill={`url(#${uid}-sheen)`} pointerEvents="none" />

        {showProtectionLayers && (
          <g>
            <rect x="22" y="36" width="296" height="208" rx="22" fill="none" stroke="#15803D" strokeWidth="2" strokeDasharray="5 4" />
            <text x="170" y="25" textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#14221B" fontWeight="600">
              360° SUSPENDED CORNER CRADLE
            </text>
          </g>
        )}
      </svg>
    );
  }

  // Bottle + Grip Sleeve
  return (
    <svg
      viewBox="0 0 320 310"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Custom Insulated Bottle and Grip Sleeve preview"
    >
      {renderDefs()}
      <circle cx="160" cy="155" r="130" fill={`url(#${uid}-glow)`} />
      <ellipse cx="160" cy="292" rx="58" ry="8" fill="#14221B" fillOpacity="0.14" />

      {/* Carry Loop & Insulated Cap */}
      <path d="M132 32 C132 14, 188 14, 188 32" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
      <rect x="130" y="32" width="60" height="24" rx="6" fill="#14221B" />
      <rect x="136" y="56" width="48" height="12" fill="#94A3B8" />

      {/* Upper 316 Steel Vessel */}
      <path
        d="M114 94 Q114 68 136 68 L184 68 Q206 68 206 94 L206 116 L114 116 Z"
        fill={primaryColor}
        stroke={subtleStroke}
        strokeWidth="2"
      />

      {/* Customizable Mid-Body Protective Grip Sleeve */}
      <rect
        x="112"
        y="114"
        width="96"
        height="146"
        rx="6"
        fill={primaryColor}
        stroke={material === 'anodized-guard' ? accentColor : subtleStroke}
        strokeWidth="2"
      />
      {(pattern === 'topographic' || pattern === 'kinetic-grid') && (
        <rect x="114" y="116" width="92" height="142" fill={`url(#${uid})`} />
      )}
      {material === 'recycled-knit' && (
        <rect x="114" y="116" width="92" height="142" fill={`url(#${uid}-knit)`} />
      )}
      {pattern === 'pace-stripe' && (
        <>
          <rect x="150" y="70" width="10" height="188" fill={accentColor} fillOpacity="0.92" />
          <rect x="164" y="70" width="4" height="188" fill={accentColor} fillOpacity="0.58" />
        </>
      )}

      {/* Lower Shock-Absorbing Dent Boot */}
      <path d="M111 248 L209 248 L209 272 Q209 284 197 284 L123 284 Q111 284 111 272 Z" fill={accentColor} />

      {/* Hydration Pacing Scale Marks */}
      {[133, 158, 183, 208, 233].map((y, idx) => (
        <g key={y}>
          <line x1="118" y1={y} x2="129" y2={y} stroke={engravingFill} strokeWidth="1.8" strokeOpacity="0.75" />
          <text x="133" y={y + 3} fill={engravingFill} fillOpacity="0.78" fontSize="7.5" fontFamily="JetBrains Mono, monospace">
            {750 - idx * 150}ml
          </text>
        </g>
      ))}

      {/* Custom Monogram Engraving */}
      {cleanEngraving && (
        <text
          x="160"
          y="270"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="11.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          letterSpacing="2"
        >
          {cleanEngraving}
        </text>
      )}
      <rect x="112" y="68" width="96" height="216" rx="18" fill={`url(#${uid}-sheen)`} pointerEvents="none" />

      {showProtectionLayers && (
        <g>
          <rect x="104" y="62" width="112" height="228" rx="22" fill="none" stroke="#15803D" strokeWidth="2" strokeDasharray="5 4" />
          <line x1="208" y1="150" x2="228" y2="150" stroke="#14221B" strokeWidth="1.5" />
          <text x="231" y="153" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#14221B" fontWeight="600">
            316 STEEL
          </text>
          <line x1="209" y1="266" x2="228" y2="266" stroke="#14221B" strokeWidth="1.5" />
          <text x="231" y="269" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#14221B" fontWeight="600">
            DENT BOOT
          </text>
        </g>
      )}
    </svg>
  );
};
