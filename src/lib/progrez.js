function Progrez() {
  if (!(this instanceof Progrez)) return new Progrez();

  this._total = 0;
  this._processed = 0;
}

Progrez.prototype.total = function(total) {
  this._total = total;
  return this;
}

Progrez.prototype.callback = function(callback) {
  this._callback = callback;
  return this;
}

Progrez.prototype.set = function(progress) {
  this._progress = progress;
  if (this._callback) this._callback(progress);
  return this;
}

Progrez.prototype.get = function() {
  return this.progress;
}

Progrez.prototype.inc = function() {
  var progress = ++this._processed / this._total;
  this.set(progress);
  return this;
}

// Returns true if progress can be automatically calculated based on the
// given total and number of items processed.
Progrez.prototype.auto = function() {
  return !!this._total;
}

module.exports = Progrez;
