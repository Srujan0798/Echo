
export const safeGet = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    // Ensure item is not 'undefined' or 'null' as strings which JSON.parse would fail on
    if (item === null || item === 'undefined') {
        return fallback;
    }
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return fallback;
  }
};

export const safeSet = (key: string, value: any): boolean => {
  try {
    if (value === undefined) {
        // Don't store undefined
        localStorage.removeItem(key);
        return true;
    }
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
        console.error("Local storage quota exceeded.");
    }
    return false;
  }
};

export const checkQuotaExceeded = (error: any): boolean => {
    return error instanceof DOMException && (
        error.code === 22 || // Legacy browsers
        error.code === 1014 || // Firefox
        error.name === 'QuotaExceededError' || // Standard
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' // Old Firefox
    );
};
