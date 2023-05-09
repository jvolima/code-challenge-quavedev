export function timePassedInSeconds(time) {
  const present = new Date();

  return Math.floor((present - time) / 1000);
}
