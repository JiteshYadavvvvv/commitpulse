// lib/calculate.ts
import { StreakStats } from '../types';

export function calculateStreak(calendar: any): StreakStats {
  const weeks = calendar.weeks;
  let currentStreak = 0;
  let longestStreak = 0;
  let todayCount = 0;

  // Flatten the array of weeks into a single, continuous array of days
  const days = weeks.flatMap((week: any) => week.contributionDays);

  // Iterate backwards, starting from today (the last day in the array)
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    
    // Day index for today
    if (i === days.length - 1) {
      todayCount = day.contributionCount;
      if (todayCount > 0) currentStreak++;
      continue;
    }

    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      // If the user hasn't committed TODAY (todayCount === 0), but they committed YESTERDAY,
      // the streak is still alive. 
      // If they missed yesterday too, the streak is officially broken.
      if (currentStreak > 0 && !(i === days.length - 2 && todayCount === 0)) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      } else if (i < days.length - 2) {
        // We reached a day in the past where the streak was broken. Stop counting.
        break; 
      }
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalContributions: calendar.totalContributions,
  };
}