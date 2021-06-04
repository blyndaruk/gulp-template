/* eslint-disable */
/**
 * @param attribute
 * @returns {*}
 */
export default function lazy(attribute = 'data-src') {
  function replaceLazy() {
    const images = Array.prototype.slice.call(document.querySelectorAll('[data-src]'));

    if (!images.length) return;

    images.forEach((node) => {
      if (typeof node.src !== 'undefined') {
        node['src'] = node.getAttribute(attribute);
      }

      if (typeof node.srcset !== 'undefined') {
        node['srcset'] = node.getAttribute(attribute);
      }

      if (node.getAttribute('data-src-sizes')) {
        node.setAttribute('sizes', node.getAttribute('data-src-sizes'));
      }

      node.removeAttribute(attribute);
    });
  }

  window.addEventListener('mouseover', replaceLazy, { once: true })
  window.addEventListener('scroll', replaceLazy, { once: true })
}
/* eslint-enable */
