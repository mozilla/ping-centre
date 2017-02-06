module.exports = {
  endpoint: process.env.NODE_ENV === "production" ?
    "https://tiles.services.mozilla.com/v3/links/ping-centre" :
    "https://onyx_tiles.stage.mozaws.net/v3/links/ping-centre"
};
