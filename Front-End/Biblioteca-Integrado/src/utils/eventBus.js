const listeners = {};

export const on = (event, cb) => {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(cb);
  return () => off(event, cb);
};

export const off = (event, cb) => {
  if (!listeners[event]) return;
  listeners[event].delete(cb);
};

export const emit = (event, data) => {
  if (!listeners[event]) return;
  listeners[event].forEach((cb) => {
    try {
      cb(data);
    } catch (e) {
      console.error("eventBus listener error", e);
    }
  });
};
