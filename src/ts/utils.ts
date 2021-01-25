export const injectElements =
    (elems: Array<HTMLElement> | NodeListOf<HTMLElement>) => {
  elems[0].parentNode?.insertBefore(elems[1], elems[0]);
};

export const swapElements =
    (elems: Array<HTMLElement> | NodeListOf<HTMLElement>) => {
  elems[0].parentNode?.insertBefore(elems[1], elems[0]);
  elems[0].parentNode?.removeChild(elems[0]);
};
