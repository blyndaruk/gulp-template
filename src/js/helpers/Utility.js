import { DOM, CLASSES } from '../_consts';

export default class Utility {

  static addBodyHidden() {
    // TODO: rename modal class

    const isMobile = window.matchMedia('(max-width: 599px)').matches;
    const { $body, $burger, $header, $moveScrollEl } = DOM;
    if (!isMobile && $body.hasClass('js-prevent-scroll-move')) return;

    sessionStorage.scrollTop = DOM.$window.scrollTop();
    $body.addClass(CLASSES.modalOpened);
    // $body.css('top', `${-sessionStorage.scrollTop}px`);
    $body.css('margin-left', `-${ Utility.getScrollbarWidth() / 2 }px`); // TODO: Has to be tested more properly
    $burger.css('margin-right', `${ Utility.getScrollbarWidth() }px`); // TODO: Has to be tested more properly
    if ($header.hasClass('is-sticky')) {
      $header.css('padding-right', `${ Utility.getScrollbarWidth() }px`); // TODO: Has to be tested more properly
    }
    if ($moveScrollEl) {
      $moveScrollEl.css('margin-left', `${ Utility.getScrollbarWidth() / 2 }px`);
    }
  };

  static removeBodyHidden() {
    const isMobile = window.matchMedia('(max-width: 599px)').matches;
    const { $body, $burger, $header, $moveScrollEl } = DOM;
    if (!isMobile && $body.hasClass('js-prevent-scroll-move')) return;

    $body.removeClass(CLASSES.modalOpened);
    // const bodyFromTop = parseInt($body.css('top'), 10) * -1;
    $burger.css('margin-right', 0);
    $header.css('padding-right', 0);
    // $window.scrollTop(bodyFromTop);
    // $body.css('top', 0);
    $body.css('margin-left', 0);
    if ($moveScrollEl) {
      $moveScrollEl.css('margin-left', 0);
    }
  }

  static getScrollbarWidth() {
    // check if webkit-scrollbar supported
    const isMobile = window.matchMedia('(max-width: 599px)').matches;
    const isWebkit = navigator.userAgent.indexOf('AppleWebKit') !== -1;
    const isEdge = /Edge/.test(navigator.userAgent);
    const customScrollSupported = isWebkit && !isEdge && !isMobile;

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = customScrollSupported ? 6 : (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }

  static getElemHeight(elem) {
    return $(elem).outerHeight();
  };

}
