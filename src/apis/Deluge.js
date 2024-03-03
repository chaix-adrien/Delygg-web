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
    this.Axios = wrapper(
      axios.create({
        jar,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  async delugeMethod(method, params = []) {
    const rep = await this.Axios.post(`${DELUGE_URL}/json`, {
      method,
      params,
      id: 1,
    }).then((r) => r.data);
    console.log(`🦊 - delugeMethod - rep:`, rep);
    if (rep.error)
      throw `Error while calling ${DELUGE_URL}:${method} - ${JSON.stringify(
        rep.error
      )}`;

    return rep.result;
  }

  async connectToHost() {
    const hosts = await this.delugeMethod("web.get_hosts");
    if (!hosts.length) throw "No Deluge host running.";
    const [hostId, hostStatus] = await this.delugeMethod(
      "web.get_host_status",
      [hosts[0][0]]
    );
    if (hostStatus !== "Connected") {
      const hostConnection = await this.delugeMethod("web.connect", [hostId]);
      console.log(`🦊 - connectToHost - hostConnection:`, hostConnection);
    }
  }

  async login() {
    const rep = await this.delugeMethod("auth.login", [DELUGE_PASSWORD]);
    await this.connectToHost();

    if (!rep.data.result)
      throw "Invalid deluge configuration. Check the config.json file.";
  }

  getTorrentsList() {
    return this.Axios("web.update_ui", [["name"], {}]);
  }

  async addTorrentFile(fileBlob) {
    await this.login();
    const fdDeluge = new FormData();
    fdDeluge.append("file", fileBlob, Math.random() + ".torrent");

    const uploadRep = await this.Axios.post(`${DELUGE_URL}/upload`, fdDeluge);
    console.log(`🦊 - addTorrentFile - uploadRep:`, uploadRep.data);

    const addRep = await this.Axios("web.add_torrents", [
      [
        {
          options: torrentConfig,
          path: uploadRep.data.files[0],
        },
      ],
    ]);
    console.log(`🦊 - addTorrentFile - addRep:`, addRep);
  }
}
