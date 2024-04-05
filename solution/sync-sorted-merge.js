"use strict";

const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the sources, in chronological order.
module.exports = (logSources, printer) => {
  //Populate the heap
  const queue = new MinHeap();
  logSources.forEach((logSource) => {
    const logEntry = logSource.pop();
    const node = {
      logEntry,
      logSource,
      weight: logEntry.date
    };
    queue.add(node);
  });
  //Drain heap and add as needed
  while(queue.size() > 0) {
    const node = queue.remove();
    if (node.logEntry) printer.print(node.logEntry);
    const logEntry = node.logSource?.pop();
    if (logEntry) { 
      const item = {
        logEntry,
        logSource: node.logSource,
        weight: logEntry.date
      };
      queue.add(item);
    };
  };
  printer.done();
  return console.log("Sync sort complete.");
};
