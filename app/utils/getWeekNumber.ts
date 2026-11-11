export function getISOWeekNumber(date: Date = new Date(), offset: number = 0): number {
  // Create a copy in UTC to avoid Daylight Saving Time (DST) offset issues
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  target.setUTCDate(target.getUTCDate() + offset * 7);
  
  // Set to the nearest Thursday: current date + 4 - current day number (making Sunday = 7)
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  
  // Get January 1st of that same UTC year
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  
  // Calculate full weeks from yearStart to the nearest Thursday
  const weekNumber = Math.ceil((((target.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
  
  return weekNumber;
}
