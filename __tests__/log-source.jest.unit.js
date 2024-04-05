const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");

describe("Log Source Behaviors", () => {
  test("It should synchronously drain a log source", () => {
    const source = new LogSource();
    let entry = source.pop();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    entry = source.pop();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    source.last.date = new Date();
    entry = source.pop();
    expect(entry).toBeFalsy();
  });

  test("It should asynchronously drain a log source", async () => {
    const source = new LogSource();
    let entry = await source.popAsync();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    entry = await source.popAsync();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    source.last.date = new Date();
    entry = await source.popAsync();
    expect(entry).toBeFalsy();
  });
});

describe("Sorted Merge Behaviors", () => {
  const sourceCount = 10;
  
  test("It should synchronously drain all log sources", () => {
    const syncLogSources = [];
    for (let i = 0; i < sourceCount; i++) {
      syncLogSources.push(new LogSource());
    }
    require("../solution/sync-sorted-merge")(syncLogSources, new Printer());
    syncLogSources.forEach((source) => {
      expect(source.drained).toBeTruthy();
    });
  });

  test("It should asynchronously drain all log sources", () => {
    const asyncLogSources = [];
    for (let i = 0; i < sourceCount; i++) {
      asyncLogSources.push(new LogSource());
    }
    require("../solution/async-sorted-merge")(asyncLogSources, new Printer())
        .then(() => {
          asyncLogSources.forEach((source) => {
            expect(source.drained).toBeTruthy();
          });
        })
  });
});