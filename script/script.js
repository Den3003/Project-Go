import {
  navigationControl,
  modalControl,
  accControl,
} from './modules/control.js';

const init = () => {
  const {closeNavList} = navigationControl();
  modalControl(closeNavList);
  accControl();
};

init();

new Swiper('.swiper', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-right',
    prevEl: '.swiper-button-left',
  },
});
