function seriesName(_val) {
  if (!arguments.length || _val === false) return this.__attrs__.seriesName;
  else if (typeof _val === 'boolean' && _val) {
    return this.__attrs__.seriesName.split('.').join(' ').trim();
  }
  else if (typeof _val === 'string') {
    this.__attrs__.seriesName = _val;
    //this.__attrs__.seriesName.split('.').join(' ').trim();
  }
  return this;
}

export default seriesName;
