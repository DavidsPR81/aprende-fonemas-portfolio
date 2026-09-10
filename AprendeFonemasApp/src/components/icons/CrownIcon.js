import React, { useId } from 'react';
import Svg, { Path, Circle, Ellipse, Defs, LinearGradient, Stop, G } from 'react-native-svg';

/**
 * Corona premium — diseño propio para app infantil (clara, alegre, legible en 28–48 px).
 */
export default function CrownIcon({ size = 24, color = '#FFD166' }) {
  const stroke = '#C47A12';
  const uid = useId().replace(/:/g, '');
  const gBody = `cb-${uid}`;
  const gJewel = `cj-${uid}`;
  const gBand = `cband-${uid}`;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        <LinearGradient id={gBody} x1="32" y1="8" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFF3C4" />
          <Stop offset="0.35" stopColor={color} />
          <Stop offset="0.75" stopColor="#F5A623" />
          <Stop offset="1" stopColor="#E09020" />
        </LinearGradient>
        <LinearGradient id={gBand} x1="32" y1="40" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFE39A" />
          <Stop offset="1" stopColor="#E8A317" />
        </LinearGradient>
        <LinearGradient id={gJewel} x1="32" y1="4" x2="32" y2="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.45" stopColor="#B8F0FF" />
          <Stop offset="1" stopColor="#5BC0EB" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="32" cy="56" rx="18" ry="3.2" fill="rgba(139, 90, 20, 0.18)" />

      <G>
        <Path
          d="M12 40 L8 18 L20 30 Z"
          fill={`url(#${gBody})`}
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <Path
          d="M52 40 L56 18 L44 30 Z"
          fill={`url(#${gBody})`}
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <Path
          d="M22 40 L32 10 L42 40 Z"
          fill={`url(#${gBody})`}
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <Path
          d="M28 34 L32 16 L36 34"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </G>

      <Path
        d="M12 40 C16 34 22 32 32 32 C42 32 48 34 52 40 L52 44 H12 Z"
        fill={`url(#${gBody})`}
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <Path
        d="M11 44 H53 V50 C53 52.8 50.8 55 48 55 H16 C13.2 55 11 52.8 11 50 V44 Z"
        fill={`url(#${gBand})`}
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <Path d="M14 47.5 H50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M14 51 H50" stroke="rgba(196, 122, 18, 0.25)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Gemas: rosa · cielo · lila (infantil y premium) */}
      <Circle cx="8.5" cy="16.5" r="3.4" fill="#FF8FAB" stroke={stroke} strokeWidth="1.2" />
      <Circle cx="7.8" cy="15.6" r="1.1" fill="rgba(255,255,255,0.9)" />

      <Circle cx="32" cy="9" r="4.1" fill={`url(#${gJewel})`} stroke={stroke} strokeWidth="1.3" />
      <Circle cx="30.8" cy="7.8" r="1.3" fill="rgba(255,255,255,0.95)" />

      <Circle cx="55.5" cy="16.5" r="3.4" fill="#CE93D8" stroke={stroke} strokeWidth="1.2" />
      <Circle cx="54.8" cy="15.6" r="1.1" fill="rgba(255,255,255,0.9)" />

      <Circle cx="20" cy="38.5" r="2.6" fill="#81C784" stroke={stroke} strokeWidth="1" />
      <Circle cx="19.4" cy="37.8" r="0.8" fill="rgba(255,255,255,0.85)" />

      <Circle cx="32" cy="37.5" r="3" fill={`url(#${gJewel})`} stroke={stroke} strokeWidth="1.1" />
      <Circle cx="31.1" cy="36.6" r="0.9" fill="rgba(255,255,255,0.9)" />

      <Circle cx="44" cy="38.5" r="2.6" fill="#FF8FAB" stroke={stroke} strokeWidth="1" />
      <Circle cx="43.4" cy="37.8" r="0.8" fill="rgba(255,255,255,0.85)" />
    </Svg>
  );
}
