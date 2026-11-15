/**
 * Names shared between the app's view transitions and the CSS that animates
 * them (see "Page transitions" in app/globals.css).
 */

/** Going deeper: list to essay, essay to topic, essay to the next one. */
export const NAV_FORWARD = "nav-forward";
/** Going back up: essay to list, essay to the previous one. */
export const NAV_BACK = "nav-back";
/** The theme toggle's reveal. Set by hooks/useTheme.ts. */
export const THEME_SWITCH = "theme-switch";

/**
 * The shared `view-transition-name` for a post's title, so the title in the
 * writing log morphs into the essay heading. Slugs can hold `/` and other
 * characters that are not valid in a CSS identifier, so those become `-`.
 */
export function postTitleTransitionName(slug: string): string {
  return `post-title-${slug.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}
