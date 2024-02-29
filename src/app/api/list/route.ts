import Deluge from "@comp/apis/Deluge";
import { NextResponse } from "next/server";

const DelugeApi = new Deluge();

export async function GET() {
  await DelugeApi.login();
  const { result } = await DelugeApi.getTorrentsList();

  return new NextResponse(
    JSON.stringify({
      list: Object.values(result.torrents || {}).map((t) =>
        t.name.replace(/\.\w*$/m, "")
      ),
    }),
    { status: 200 }
  );
}
