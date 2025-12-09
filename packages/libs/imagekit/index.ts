// SDK initialization

import ImageKit = require("imagekit");

const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;


if (!PUBLIC_KEY || !PRIVATE_KEY) {
  throw new Error("❗ Missing IMAGEKIT environment variables");
}

export const imagekit = new ImageKit({
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
