export function toProperCase(str: string): string {
  // Handle empty or null strings
  if (!str) return str;

  // Split on spaces and hyphens
  return str
    .toLowerCase()
    .split(/[\s-]/)
    .map((word) => {
      // Skip empty strings
      if (!word) return word;

      // Handle apostrophes (e.g., "o'connor" → "O'Connor")
      if (word.includes("'")) {
        return word
          .split("'")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("'");
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
