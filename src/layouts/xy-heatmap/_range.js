function _range() {
  const scale = this.scale();
  const field = this.__execs__.field;
  const xAt = this.axisX();
  const yAt = this.axisY();

  field.x.axis(xAt);
  field.y.axis(yAt);
  this.thickness(yAt, scale.y, false, true);
  this.thickness(xAt, scale.x, true, true);

  const innerSize = this.innerSize();  
  scale.x.rangeRound([0, innerSize.width]).padding(this.padding());
  scale.y.rangeRound([0, innerSize.height]).padding(this.padding());

  scale.color.range(this.color());
  return this;
}

export default _range;