import { useMap } from "ahooks";
import { useMemo } from "react";

const Filters = {
  category: {
    custom: false,
  },
  subCat: {
    custom: false,
  },
  season: {
    custom: false,
    items: Array.from(Array(10).keys()).map((i) => (i + 1).toString()),
    label: "Saison",
  },
  episode: {
    custom: false,
    items: Array.from(Array(30).keys()).map((i) => i.toString()),
    label: "Episode",
  },
  resolution: {
    custom: true,
    items: ["2160p", "1080p", "720p"],
    label: "Résolution",
  },
  language: {
    custom: true,
    items: ["vff", "vfi", "vostfr", "vost", "vo"],
    label: "Langue",
  },
  source: {
    custom: true,
    items: [ "blu-ray", "web", "webrip", "hdr"],
    label: "Source",
  },
  audio: {
    custom: true,
    items: ["atmos", "truehd", "dts-hd", "ac3", "aac", "flac"],
    label: "Audio",
  },
};


export const FiltersArray = Object.entries(Filters).map(([key, v]) => ({
  key,
  ...v,
})) as [{ key: string; label: string; items: string[]; custom: boolean }];

export default function useFiltersState() {
  const [filters, { set, get }] = useMap<string, string[]>([
    ["category", ["all"]],
    ["subCat", ["all"]],
  ]);

  const [customFilters, apiFilters] = useMemo(() => {
    return [
      new Map<string, string[]>(
        [...filters.entries()].filter(([key, v]) => {
          return Filters[key].custom;
        })
      ),
      new Map<string, string[]>(
        [...filters.entries()].filter(([key]) => !Filters[key].custom)
      ),
    ].map((m) =>
      [...m.entries()].filter(([_, values]) => values && values.length)
    );
  }, [filters]);

  function setFilters(key: string, ...toAdd: string[]) {
    const catFilters = new Set();
    toAdd.forEach((add) => catFilters.add(add));
    set(key, [...catFilters]);
  }

  function addFilters(key: string, ...toAdd: string[]) {
    const catFilters = new Set(filters.get(key) || []);
    toAdd.forEach((add) => catFilters.add(add));
    set(key, [...catFilters]);
  }

  function removeFilters(key: string, ...toRemove: string[]) {
    const catFilters = new Set(get(key) || []);
    toRemove.forEach((del) => catFilters.delete(del));
    set(key, [...catFilters]);
  }

  return {
    filters,
    customFilters,
    apiFilters,
    setFilters,
    addFilters,
    removeFilters,
    category: filters.get("category")?.[0],
    subCat: filters.get("subCat")?.[0],
  };
}
