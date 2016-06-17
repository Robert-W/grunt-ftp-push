var cache = {};

module.exports = {
  get: function () { return cache; },
  set: function (newCache) { cache = newCache; }
};
