export default function (year: number): number {
  // December 28 is always in the last ISO week of the year
  const dec28 = new Date(Date.UTC(year, 11, 28));
  
  // Set to nearest Thursday: current date + 4 - current day number (making Sunday 7)
  dec28.setUTCDate(dec28.getUTCDate() + 4 - (dec28.getUTCDay() || 7));
  
  // Get first day of the year
  const yearStart = new Date(Date.UTC(dec28.getUTCFullYear(), 0, 1));
  
  // Calculate full weeks to nearest Thursday
  return Math.ceil((((dec28.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
