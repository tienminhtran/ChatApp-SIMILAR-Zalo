export const extractPublicIdFromUrl = (url) => {
  const regex = /\/v\d+\/([^\.\/]+)\.[^\/]+$/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];  // Đây là public_id
  }
  return null;
}
