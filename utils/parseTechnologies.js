export const parseTechnologies = (technologies) => {
  if (!technologies) return [];

  if (Array.isArray(technologies)) {
    return technologies.map((tech) => tech.trim()).filter(Boolean);
  }

  try {
    const parsed = JSON.parse(technologies);
    if (Array.isArray(parsed)) {
      return parsed.map((tech) => tech.trim()).filter(Boolean);
    }
  } catch {
    // Not JSON, fallback to comma-separated string
  }

  return String(technologies)
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
};
