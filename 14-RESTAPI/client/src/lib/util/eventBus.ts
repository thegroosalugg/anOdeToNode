type EventListener = () => void;
type EventMap = {
  [eventKey: string]: Set<EventListener>;
};

const events: EventMap = {};

export const eventBus = {
  on: (eventKey: string, callback: EventListener) => {
    if (!events[eventKey]) {
      events[eventKey] = new Set(); // create events array for each eventKey
    }
    events[eventKey].add(callback); // add callback to array
    return () => void events[eventKey]?.delete(callback); // returns cleanup function. Voids return value so useEffect returns can call it on unmount
  },

  emit: (eventKey: string) => {
    events[eventKey]?.forEach((cb) => cb()); // calls every registered callback for event name
  },
};

// Usage:
// eventBus.on("logout", () => setUser(null));
// eventBus.emit("logout"); // only triggers logout listeners
