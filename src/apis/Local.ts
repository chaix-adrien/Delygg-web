import { Movie } from "@comp/components/MoviesList";

function search(
  searchString: string,
  filters: any[],
  sortBy: { sort: string[]; order: string[] }
): Promise<Movie[]> {
  return fetch("api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      search: { name: searchString },
      filters,
      sortBy,
    }),
  }).then((r) => r.json());
}

async function download(link: string, setDlState: Function) {
  setDlState?.(true);
  const id = link.match(/\/(\d*)-/)?.[1];
  await fetch("api/download", {
    cache: "no-cache",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  setDlState?.(false);
}

function getTorrentsList() {
  return fetch("api/list", { cache: "no-cache" })
    .then((r) => r.json())
    .then((r) => r.list);
}

const LocalApi = { search, download, getTorrentsList };
export default LocalApi;
