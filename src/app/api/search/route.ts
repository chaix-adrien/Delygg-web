import type { NextResponse as NextRepType } from "next/server";
import { NextResponse } from "next/server";
import Ygg from "@comp/apis/Ygg";

const argsMap = {
  episode: "option_episode[]",
  category: "category",
  subCat: "sub_category",
  season: "option_saison[]",
};

const YggApi = new Ygg();
export async function POST(request: NextRepType) {
  const {
    search,
    sort = "size",
    order = "desc",
    page = "1",
    filters,
  } = await request.json();
  const formatedFilters = [];
  const offset = { episode: 1, season: 3 };
  filters.forEach(([key, value]) => {
    value.forEach((f) =>
      formatedFilters.push(
        `${argsMap[key]}=${
          ["episode", "season"].includes(key) ? parseInt(f) + offset[key] : f
        }`
      )
    );
  });
  const url = encodeURI(
    `/engine/search?name=${search.name}&${formatedFilters.join(
      "&"
    )}&do=search&order=${order}&sort=${sort}&page=${page}`
  );
  const results = await YggApi.extractTorrents(url);

  return new NextResponse(
    JSON.stringify({ results, baseUrl: YggApi.shortUrl }),
    {
      status: 200,
    }
  );
}
