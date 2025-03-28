export function getRootDomain(hostname: string): string {
  const parts = hostname.split(".");
  return parts.slice(-2).join(".");
}
