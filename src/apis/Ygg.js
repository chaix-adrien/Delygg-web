import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import streamToBlob from "stream-to-blob";
import { CookieJar } from "tough-cookie";
import { DOMParser } from "react-native-html-parser";
import { Parser, addDefaults } from "parse-torrent-title";

const parser = new Parser();
addDefaults(parser);
parser.addHandler("season", /S([0-9]{2})/i, { type: "integer" });
parser.addHandler("source", /(blu-ray|hdr10|hdr|web)/i, { type: "string" });

const { YGG_USER, YGG_PASSWORD } = process.env;

const duplicateMap = Object.entries({
  language: [
    { target: "vff", clone: ["fr", "truefrench", "vff", "french"] },
    {
      target: "vfi",
      clone: ["vfq", "vfi", "vfb"],
    },
  ],
  source: [
    { target: "blu-ray", clone: ["bluray"] },
    { target: "web", clone: ["web-dl"] },
    { target: "hdr", clone: ["hdr10"] },
  ],
});

function DOMparse(content) {
  return new DOMParser({
    errorHandler: { warning: function () {} },
  }).parseFromString(content, "text/html");
}

export default class Ygg {
  constructor() {
    const jar = new CookieJar();
    this.Axios = wrapper(axios.create({ jar, withCredentials: true }));
    this.findBaseUrl();
  }

  async findBaseUrl() {
    if (this.baseUrl && this.shortUrl) return this.baseUrl;
    const wikiRep = await this.Axios(
      "https://fr.wikipedia.org/wiki/YggTorrent"
    );
    this.shortUrl = wikiRep.data.match(/>(yggtorrent.\w+)</m)[1];
    const yggRep = await this.Axios(`https://${this.shortUrl}`);
    this.baseUrl = yggRep.data
      .match(/https:\/\/www\d?\.yggtorrent\.\w+\/user\/donate/gm)[0]
      .replace("/user/donate", "");
    return this.baseUrl;
  }

  async login() {
    await this.findBaseUrl();
    const fdYgg = new FormData();
    fdYgg.append("id", YGG_USER);
    fdYgg.append("pass", YGG_PASSWORD);
    fdYgg.append("ci_csrf_token", "");

    const out = await this.Axios({
      url: `${this.baseUrl}/user/login`,
      method: "POST",
      data: fdYgg,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return out;
  }

  async extractTorrents(searchUrl) {
    await this.findBaseUrl();
    const fullUrl = `${this.baseUrl}${searchUrl}`;
    const repSearch = await this.Axios.get(fullUrl);
    if (repSearch.status !== 200) throw "Impossible d'acceder à Ygg.";

    const doc = DOMparse(repSearch.data);
    const results = doc.querySelect('a[id="torrent_name"]');
    const dates = doc.querySelect('span[class="ico_clock-o"]');

    const formatedResults = results
      .map((e, idx) => ({
        name: e.firstChild.data.split("\r")[0],
        link: e.attributes[1].nodeValue,
        date: dates[idx].nextSibling.data.trim(),
        size: e.childNodes[2].firstChild.childNodes[6].firstChild.data,
      }))
      .map((movie) => {
        const out = { ...movie, ...parser.parse(movie.name) };
        if (out.season && !out.episode) out.complete = true;
        if (out.complete) out.episode = 0;
        duplicateMap.forEach(([key, patterns]) => {
          patterns.forEach(({ target, clone }) => {
            if (clone.includes(out[key])) out[key] = target;
          });
        });
        return out;
      });

    return formatedResults;
  }

  async downloadTorrentFile(id) {
    await this.login();
    const fileRep = await this.Axios({
      responseType: "stream",
      url: `${this.baseUrl}/engine/download_torrent?id=${id}`,
    });

    return streamToBlob(fileRep.data);
  }
}
