/** @enum { number } */
export const Categories = Object.freeze({
  ALL: "all",
  VIDEO: 2145,
  AUDIO: 2139,
  SOFTWARE: 2144,
  GAME: 2142,
  EBOOK: 2140,
  EMULATION: 2141,
});

/**
 * @enum { Object<String, number> }
 */

export const SubCategories = Object.freeze({
  /** @enum { number } */
  2145: {
    all: "all",
    Movie: 2183,
    Serie: 2184,
    Documentary: 2181,
    "TV Show": 2182,
    "Animated movie": 2178,
    Animé: 2179,
    Concert: 2180,
    Show: 2185,
    Sport: 2186,
    Clip: 2187,
  },
  /** @enum { number } */
  2139: {
    all: "all",
    Music: 2148,
    Karaoke: 2147,
    Podcast: 2150,
    Sample: 2149,
  },
  /** @enum { number } */
  2144: {
    ALL: "all",
    WINDOWS: 2173,
    MACOS: 2172,
    LINUX: 2171,
    SMARTPHONE: 2174,
    FORMATION: 2176,
    TABLET: 2175,
    OTHER: 2177,
  },
  /** @enum { number } */
  2142: {
    ALL: "all",
    WINDOWS: 2161,
    MICROSOFT: 2162,
    NINTENDO: 2163,
    SONY: 2164,
    SMARTPHONE: 2165,
    MACOS: 2160,
    LINUX: 2159,
    TABLET: 2166,
    OTHER: 2167,
  },
  /** @enum { number } */
  2140: {
    ALL: "all",
    AUDIO: 2151,
    STRIP: 2152,
    COMICS: 2153,
    BOOKS: 2154,
    MANGA: 2155,
    PRESSE: 2156,
  },
  /** @enum { number } */
  2141: {
    ALL: "all",
    EMULATORS: 2157,
    ROMS: 2158,
  },
});

/**
 * @enum { String }
 */
export const SortBy = Object.freeze({
  NAME: "name",
  PUBLISH_DATE: "publish_date",
  SIZE: "size",
  COMPLETED: "completed",
  SEED: "seed",
  LEECH: "leech",
});

/**
 * @enum { String }
 */
export const SortOrder = Object.freeze({
  ASCENDING: "asc",
  DESCENDING: "desc",
});
