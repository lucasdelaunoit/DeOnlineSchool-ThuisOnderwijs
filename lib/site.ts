/**
 * Site-wide names and links (not the podcast: see lib/podcast-links.ts).
 * This site is Thuis Onderwijs.be. De Online School is a separate platform we link to.
 */

export const SITE_NAME = "Thuis Onderwijs.be";

export const MAIN_NAV = [
  { href: "/podcast", label: "Podcast" },
  { href: "/questions", label: "FAQ" },
];

const ONLINE_SCHOOL = "https://de-online-school.be";

/**
 * Link to De Online School with UTM tags, so sign-ups can be traced back to the page
 * they came from. `campaign` is usually the slug of the page.
 */
export function onlineSchoolUrl(
  path: string,
  { source = "thuisonderwijs", campaign = "site", content }: { source?: string; campaign?: string; content?: string } = {},
) {
  const query = new URLSearchParams({ utm_source: source, utm_medium: "website", utm_campaign: campaign });
  if (content) query.set("utm_content", content);
  return `${ONLINE_SCHOOL}${path}?${query}`;
}

export const LOGIN_URL = onlineSchoolUrl("/login/index.php", { content: "header" });
export const SIGNUP_URL = onlineSchoolUrl("/login/signup.php", { content: "header" });
