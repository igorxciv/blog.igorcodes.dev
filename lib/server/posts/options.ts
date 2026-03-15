export function resolveIncludeDrafts(includeDrafts?: boolean) {
  if (typeof includeDrafts === "boolean") {
    return includeDrafts;
  }

  return process.env.NODE_ENV !== "production";
}
