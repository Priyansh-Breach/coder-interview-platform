export function deleteLocalStorageKey(key: string): void {
  if (key && localStorage.getItem(key)) {
    localStorage.removeItem(key);

  } else {
    console.log(`The key "${key}" does not exist in localStorage.`);
  }
}
