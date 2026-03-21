export default function formatBytes(value: number) {
  if (!Number.isFinite(value)) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let currentValue = value;
  let unitIndex = 0;

  while (currentValue >= 1024 && unitIndex < units.length - 1) {
    currentValue /= 1024;
    unitIndex += 1;
  }

  const decimals = currentValue >= 10 ? 1 : 2;
  return `${currentValue.toFixed(decimals)} ${units[unitIndex]}`;
}
