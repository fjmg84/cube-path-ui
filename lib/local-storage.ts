export function saveToLocalStorage(
  key: string,
  value: Record<string, unknown>,
) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function getFromLocalStorage(
  key: string,
): Record<string, unknown> | null {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error("Error getting from localStorage:", error);
    return null;
  }
}

export function removeFromLocalStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}
