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

