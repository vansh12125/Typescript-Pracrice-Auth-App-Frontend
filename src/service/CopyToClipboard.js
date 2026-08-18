export default async function CopyToClipboard(text) {
  if (!text || !text.trim()) return;
  await navigator.clipboard.writeText(text);
}
