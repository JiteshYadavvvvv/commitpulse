// lib/svg/generator.ts
import { StreakStats, BadgeParams } from '../../types';

export function generateSVG(stats: StreakStats, params: BadgeParams) {
  // Set fallback defaults if the user didn't provide custom colors in the URL
  const bg = params.bg || '0d1117';
  const text = params.text || 'c9d1d9';
  const accent = params.accent || '58a6ff';
  const radius = params.radius || '8';

  // We format the colors with a # tag (URL params usually omit the # symbol)
  const bgColor = `#${bg.replace('#', '')}`;
  const textColor = `#${text.replace('#', '')}`;
  const accentColor = `#${accent.replace('#', '')}`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
      <style>
        .header { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${accentColor}; }
        .stat-value { font: 700 28px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${textColor}; }
        .stat-label { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${textColor}; opacity: 0.8; }
      </style>
      
      <rect x="0.5" y="0.5" rx="${radius}" width="399" height="149" fill="${bgColor}" stroke="${accentColor}" stroke-opacity="0.2"/>
      
      <g transform="translate(25, 35)">
        <text x="0" y="0" class="header">${params.user}'s GitHub Streak</text>
      </g>

      <g transform="translate(25, 90)">
        <text x="0" y="0" class="stat-value">${stats.currentStreak}</text>
        <text x="0" y="20" class="stat-label">Current Streak</text>

        <text x="130" y="0" class="stat-value">${stats.longestStreak}</text>
        <text x="130" y="20" class="stat-label">Longest Streak</text>

        <text x="260" y="0" class="stat-value">${stats.totalContributions}</text>
        <text x="260" y="20" class="stat-label">Total (1 Year)</text>
      </g>
    </svg>
  `;
}