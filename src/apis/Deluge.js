import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const { DELUGE_URL, DELUGE_PASSWORD } = process.env;

const defaultTorrentConfig = {
  download_location: undefined,
  add_paused: false,
  max_connections: -1,
  max_download_speed: -1,
  max_upload_slots: -1,
  max_upload_speed: -1,
  move_completed: false,
  move_completed_path: "",
  pre_allocate_storage: false,
  prioritize_first_last_pieces: true,
  seed_mode: false,
  sequential_download: true,
  super_seeding: false,
};

const torrentConfig = {
  file_priorities: [1],
  ...Object.fromEntries(
    Object.entries(defaultTorrentConfig)
      .map(([key, defaultValue]) => [
        key,
        process.env[key.toUpperCase()]
          ? JSON.parse(process.env[key.toUpperCase()])
          : defaultValue,
      ])
      .filter(([_, value]) => value !== undefined)
  ),
};

export default class Deluge {
  constructor() {
    const jar = new CookieJar();
    this.logedIn = false;
    this.Axios = wrapper(axios.create({ jar, withCredentials: true }));
  }

  async login() {
    if (this.logedIn) return;

    const rep = await this.Axios(`${DELUGE_URL}/json`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      data: JSON.stringify({
        method: "auth.login",
        params: [DELUGE_PASSWORD],
        id: 1,
      }),
    });

    if (!rep.data.result)
      throw "Invalid deluge configuration. Check the config.json file.";
    this.logedIn = true;
  }

  getTorrentsList() {
    return this.Axios(`${DELUGE_URL}/json`, {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        method: "web.update_ui",
        params: [["name"], {}],
        id: 2727,
      }),
      method: "POST",
    }).then((r) => r.data);
  }

  async addTorrentFile(fileBlob) {
    const fdDeluge = new FormData();
    fdDeluge.append("file", fileBlob, Math.random() + ".torrent");

    const uploadRep = await this.Axios(`${DELUGE_URL}/upload`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      data: fdDeluge,
    });
    console.log(`🦊 - addTorrentFile - uploadRep:`, uploadRep.data)

    const addRep = await this.Axios(`${DELUGE_URL}/json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        method: "web.add_torrents",
        params: [
          [
            {
              options: torrentConfig,
              path: uploadRep.data.files[0],
            },
          ],
        ],
        id: 803,
      }),
    });
    console.log(`🦊 - addTorrentFile - addRep:`, addRep.data)

    if (addRep.data.error)
      throw "deluge add torrent error: " + addRep.data.error;
  }
}
