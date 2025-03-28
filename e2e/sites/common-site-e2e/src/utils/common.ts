const domain = process.env["DOMAIN"] || "fbi.com";

export function getSiteUrl(siteName: string, path = "") {
  if (siteName === "home") {
    return `https://${domain}`;
  } else {
    return `https://${siteName}.${domain}${path}`;
  }
}

export function extractConfirmationLink(emailBody: string): string | null {
  const regex =
    /https?:\/\/[^\s"]*\/self-service\/verification\?code=[0-9]+&flow=[a-z0-9-]+/gi;
  const matches = emailBody.match(regex);
  return matches ? matches[0] : null;
}
