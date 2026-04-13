// app/api/streak/route.ts
import { NextResponse } from 'next/server';
import { fetchGitHubContributions } from '../../../lib/github';
import { calculateStreak } from '../../../lib/calculate';
import { generateSVG } from '../../../lib/svg/generator';
import { getSecondsUntilUTCMidnight } from '../../../utils/time';
import { BadgeParams } from '../../../types';

export async function GET(request: Request) {
  try {
    // 1. Parse URL Parameters
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    
    if (!user) {
      return new NextResponse('Missing "user" parameter', { status: 400 });
    }

    const params: BadgeParams = {
      user,
      bg: searchParams.get('bg') || undefined,
      text: searchParams.get('text') || undefined,
      accent: searchParams.get('accent') || undefined,
      radius: searchParams.get('radius') || undefined,
    };

    // 2. Fetch Data & Calculate Stats
    const calendar = await fetchGitHubContributions(user);
    const stats = calculateStreak(calendar);

    // 3. Generate the SVG string
    const svg = generateSVG(stats, params);

    // 4. Calculate Cache Control (The most important part for real-time streaks)
    const secondsToMidnight = getSecondsUntilUTCMidnight();
    const cacheControl = `public, s-maxage=${secondsToMidnight}, stale-while-revalidate=86400`;

    // 5. Return the Image Response
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': cacheControl,
        // Crucial for security, prevents XSS attacks in SVGs
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline';",
      },
    });

  } catch (error: any) {
    console.error('Streak API Error:', error);
    // Return a visible error image so the user knows what went wrong on their README
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
      <rect width="100%" height="100%" fill="#2d0000"/>
      <text x="20" y="75" fill="#ffcccc" font-family="sans-serif">Error: ${error.message}</text>
    </svg>`;
    
    return new NextResponse(errorSvg, { 
      status: 500,
      headers: { 
        'Content-Type': 'image/svg+xml', 
        'Cache-Control': 'no-cache' 
      } 
    });
  }
}