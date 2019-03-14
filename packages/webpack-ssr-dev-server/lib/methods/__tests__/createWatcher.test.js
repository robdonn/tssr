const nodemon = require("nodemon");
const EventEmitter = require("events");
const { createWatcher } = require("../createWatcher");

jest.mock("nodemon");

const mockConfig = {
  paths: {
    serverBuild: "serverBuild"
  }
};

let mockEvent;

const { log, error } = global.console;
const { exit } = global.process;

describe("createWatcher", () => {
  beforeAll(() => {
    global.console.log = jest.fn();
    global.console.error = jest.fn();
    global.process.exit = jest.fn();
  });

  beforeEach(() => {
    global.console.log.mockClear();
    global.console.error.mockClear();
    global.process.exit.mockClear();
    mockEvent = new EventEmitter();
    nodemon.mockReturnValueOnce(mockEvent);
  });

  afterAll(() => {
    global.console.log = log;
    global.console.error = error;
    global.process.exit = exit;
  });

  it("should create a watcher", () => {
    createWatcher.call(mockConfig);

    expect(nodemon).toHaveBeenCalledTimes(1);
    expect(nodemon).toHaveBeenNthCalledWith(1, {
      ignore: ["src", "scripts", "config", "./*.*", "build/client"],
      script: "serverBuild/server.js"
    });

    expect(mockConfig.watcher).toBe(mockEvent);
  });

  it("should handle restart event", () => {
    createWatcher.call(mockConfig);

    mockEvent.emit("restart");

    expect(global.console.log).toHaveBeenCalledTimes(1);
    expect(global.console.log).toHaveBeenNthCalledWith(
      1,
      "Server side app has been restarted."
    );

    expect(global.console.error).toHaveBeenCalledTimes(0);
    expect(global.process.exit).toHaveBeenCalledTimes(0);
  });

  it("should handle quit event", () => {
    createWatcher.call(mockConfig);

    mockEvent.emit("quit");

    expect(global.console.log).toHaveBeenCalledTimes(1);
    expect(global.console.log).toHaveBeenNthCalledWith(1, "Process ended");

    expect(global.console.error).toHaveBeenCalledTimes(0);

    expect(global.process.exit).toHaveBeenCalledTimes(1);
    expect(global.process.exit).toHaveBeenNthCalledWith(1, 0);
  });

  it("should handle error event", () => {
    const mockError = new Error("Quit due to bad things");
    createWatcher.call(mockConfig);

    mockEvent.emit("error", mockError);

    expect(global.console.log).toHaveBeenCalledTimes(1);
    expect(global.console.log).toHaveBeenNthCalledWith(
      1,
      "An error has occured"
    );

    expect(global.console.error).toHaveBeenCalledTimes(1);
    expect(global.console.error).toHaveBeenNthCalledWith(1, mockError);

    expect(global.process.exit).toHaveBeenCalledTimes(1);
    expect(global.process.exit).toHaveBeenNthCalledWith(1, 1);
  });
});
