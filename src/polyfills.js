// src/polyfills.js
// MessageChannel polyfill for Cloudflare Workers
if (typeof MessageChannel === "undefined") {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      const channel = new BroadcastChannel("polyfill-channel-" + Math.random());

      this.port1 = {
        postMessage: (data) => {
          channel.postMessage({ source: "port1", data });
        },
        onmessage: null,
        addEventListener: (type, listener) => {
          if (type === "message") {
            channel.addEventListener("message", (e) => {
              if (e.data.source === "port2") {
                listener({ data: e.data.data });
              }
            });
          }
        },
        removeEventListener: () => {},
        start: () => {},
        close: () => {},
      };

      this.port2 = {
        postMessage: (data) => {
          channel.postMessage({ source: "port2", data });
        },
        onmessage: null,
        addEventListener: (type, listener) => {
          if (type === "message") {
            channel.addEventListener("message", (e) => {
              if (e.data.source === "port1") {
                listener({ data: e.data.data });
              }
            });
          }
        },
        removeEventListener: () => {},
        start: () => {},
        close: () => {},
      };
    }
  };
}

// Additional polyfills that might be needed
if (typeof setImmediate === "undefined") {
  globalThis.setImmediate = (fn, ...args) => {
    return setTimeout(fn, 0, ...args);
  };
}

if (typeof clearImmediate === "undefined") {
  globalThis.clearImmediate = (id) => {
    clearTimeout(id);
  };
}
