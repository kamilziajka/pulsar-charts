'use strict';

export function range(size) {
  const g = function *(n) {
    while (n--) yield 0;
  };

  return [ ...g(size) ];
}
