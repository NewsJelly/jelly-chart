function* TraverseElements(el) {
  yield el;
  el = el.firstElementChild;
  while (el) {
    yield* TraverseElements(el);
    el = el.nextElementSibling;
  }
}
module.exports = TraverseElements;