class Events {
  events = {};

  on(eventName, callback) {
    if (this.events[eventName]) return this.events[eventName].push(callback);
    return (this.events[eventName] = [callback]);
  }

  trigger(eventName, data) {
    const events = this.events[eventName] || [];

    events.forEach((cb) => cb(data));
  }
}

const events = new Events();

events.on("test", console.log);
events.on("test", console.log);
events.on("test", console.log);

// events.trigger("test", "ole");
