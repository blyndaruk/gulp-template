import { DOM } from '../_consts';

const detectMouse = e => {
  if (e.type === 'mousemove') {
    document.body.classList.add('no-touch')
  } else if (e.type === 'touchstart' && window.matchMedia('(max-width: 1024px)').matches) {
    document.body.classList.remove('no-touch')
  }
  // remove event bindings, so it only runs once
  DOM.body.removeEventListener('mousemove', detectMouse);
  DOM.body.removeEventListener('touchstart', detectMouse);
};

// attach both events to body
DOM.body.addEventListener('mousemove', detectMouse);
DOM.body.addEventListener('touchstart', detectMouse);
