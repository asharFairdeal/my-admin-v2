// Debounce function to avoid rapid firing of search requests
export default function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (...args: any) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  