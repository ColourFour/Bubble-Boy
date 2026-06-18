import { bootToybox } from "/static/toybox/scene.js";

bootToybox().catch((error) => {
  window.__toyboxLastError = error && error.stack ? error.stack : String(error);
  console.error("Toybox renderer failed.", error);
});
