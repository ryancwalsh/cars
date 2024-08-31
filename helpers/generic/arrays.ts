type Primitive = string | number | boolean | null | undefined;

export function getUniqueObjects<T extends Record<string, Primitive>>(array: T[]): T[] {
  const seen = new Map<string, T>();

  for (const item of array) {
    // Convert the object to a JSON string to use as a unique key
    const key = JSON.stringify(item);
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  }

  return Array.from(seen.values());
}
