import Deluge from "@comp/apis/Deluge";
import Ygg from "@comp/apis/Ygg";
import type { NextResponse as NextRepType } from "next/server";
import { NextResponse } from "next/server";

const DelugeApi = new Deluge();
const YggApi = new Ygg();

export async function POST(request: NextRepType) {
  try {
    const { id } = await request.json();
    await YggApi.login();
    const torrentFile = await YggApi.downloadTorrentFile(id);
    await DelugeApi.login();
    await DelugeApi.addTorrentFile(torrentFile);

    return new NextResponse(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error(`Add torrent error:`, e);
    return new NextResponse(
      JSON.stringify({
        ok: false,
        reason: e,
      }),
      { status: 400 }
    );
  }
}
