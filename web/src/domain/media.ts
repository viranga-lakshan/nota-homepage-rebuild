/**
 * Media, as the rest of the app wants it: absolute URL, alt text always
 * present, dimensions known.
 *
 * Nothing here reflects how the CMS stores media. Strapi returns relative
 * URLs, a nullable `alternativeText`, and a pile of generated format
 * variants; resolving all of that is the mapper's job so that a component
 * rendering an image never has to think about any of it.
 */

export interface Image {
  /** Absolute URL, already prefixed with the media host. */
  url: string;
  /**
   * Never empty. Alt text is a required field on every component that holds
   * an image (see CLAUDE.md §7), precisely so this can be a plain string
   * rather than `string | null` that every caller has to handle.
   */
  alt: string;
  width: number;
  height: number;
}

export interface Video {
  /** Absolute URL, already prefixed with the media host. */
  url: string;
  /** e.g. "video/mp4" — needed for the <source type> attribute. */
  mime: string;
}
