export default defineEventHandler(async () => {
  const result = await $fetch("https://zenquotes.io/api/random");

  return result[0];
});
