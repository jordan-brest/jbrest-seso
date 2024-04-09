"use strict";

const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the *async* sources, in chronological order.
module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    //Populate the heap
    const queue = new MinHeap();
    const promises = logSources.map((logSource) => {
      const prom = logSource.popAsync().then((logEntry) => {
        const node = {
          logEntry,
          logSource,
          promise: logSource.popAsync(),
          weight: logEntry.date
        };
        queue.add(node);
      });
      return prom;
    });

    //Wait for all log sources to return before draining the heap
    Promise.all(promises).then(() => {
      //Print function
      function print() {
        printer.done();
        resolve(console.log("Async sort complete."));
      }
      //Function to async drain heap until empty
      function asyncPopQueue() {
        if (queue.size() > 0) {
          const node = queue.remove();
          if (node.logEntry) printer.print(node.logEntry);
          return node.promise.then((logEntry) => {
            if (logEntry) { 
              const item = {
                logEntry,
                logSource: node.logSource,
                promise: node.logSource.popAsync(),
                weight: logEntry.date
              };
              queue.add(item);
            };
            if (queue.size() > 0) {
              asyncPopQueue();
            } else {
              print();
            }
          });
        } else {
          print();
        }
      };

      asyncPopQueue()
  });
})};
