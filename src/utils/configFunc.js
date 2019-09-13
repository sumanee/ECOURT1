module.exports.forEachAsync = () => {
  Array.prototype.forEachAsync = async function(fn) {
    for (const t of this) {
      await fn(t);
    }
  };
};
module.exports.forEachAsyncParallel = () => {
  Array.prototype.forEachAsyncParallel = async function(fn) {
    await Promise.all(this.map(fn));
  };
};

module.exports.mapAsync = () => {
  Array.prototype.mapAsync = async function(iteratorFunction) {
    const newMap = [];
    let indexer = 0;
    for (const data of this) {
      newMap[indexer] = await iteratorFunction(data, indexer, this);
      indexer++;
    }
    return newMap;
  };
};
