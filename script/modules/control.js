import domElements from "./domElements.js";
import variables from "./variables.js";

//  Navigation

const controlOverlay = (timestamp, hideNav) => {
  variables.startTime ||= timestamp;
  const progress = (timestamp - variables.startTime) /
    variables.durationOpacity;
  const opacity = variables
      .toggleNavList ? progress : 1 - progress;
  domElements.navigationList.style.opacity = opacity;

  if (progress < 1) {
    requestAnimationFrame((newTimestamp) => {
      controlOverlay(newTimestamp, hideNav);
    });
  } else {
    variables.startTime = NaN;
    hideNav();
  }
};

export const navigationControl = () => {
  const openNavList = () => {
    const scrollbarWidth = window.innerWidth - document
        .documentElement.clientWidth;
    domElements.navigationList.classList.add('is-visible');
    domElements.navigationButton.classList.add('is-open');
    document.body.style.overflowY = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    variables.toggleNavList = true;
    requestAnimationFrame((timestamp) => {
      controlOverlay(timestamp, () => {});
    });
  };

  const closeNavList = () => {
    requestAnimationFrame((timestamp) => {
      controlOverlay(timestamp, () => {
        domElements.navigationList.classList.remove('is-visible');
        domElements.navigationButton.classList.remove('is-open');
        document.body.style.overflowY = 'unset';
        document.body.style.paddingRight = '';
      });
    });
    variables.toggleNavList = false;
  };

  domElements.navigationButton.addEventListener('click', e => {
    if (e.target.classList.contains('is-open') ||
      (e.target.closest('.is-open') &&
      e.target.classList.contains('navigation-menu__line'))) {
      closeNavList();
    } else {
      openNavList();
    }
  });

  domElements.navigationList.addEventListener('click', e => {
    if (domElements.navigationButton.classList.contains('is-open') &&
      e.target.classList.contains('navigation__link')) {
      closeNavList();
    }
  });

  return {
    closeNavList,
  };
};

//  Modal

export const modalControl = (closeNavList) => {
  const openModal = () => {
    if (domElements.navigationButton.classList.contains('is-open')) {
      closeNavList();
    }
    domElements.modalOverlay.classList.add('is-visible');
    document.body.style.overflowY = 'hidden';
    document.body.style.paddingRight = `${variables.scrollbarWidth}px`;
  };

  const closeModal = () => {
    domElements.modalOverlay.classList.remove('is-visible');
    document.body.style.overflowY = 'unset';
    document.body.style.paddingRight = '';
  };

  domElements.modalOpenButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });
  domElements.modalOverlay.addEventListener('click', e => {
    if (e.target === domElements.modalOverlay ||
      e.target.closest('.js-modal-close')) {
      closeModal();
    }
  });
};

// Acc

export const accControl = () => {
  let heightWrapper = 0;

  domElements.faqTextWrapper.forEach(elem => {
    if (heightWrapper < elem.scrollHeight) {
      heightWrapper = elem.scrollHeight;
    }
  });

  domElements.faqButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      for (let i = 0; i < domElements.faqItems.length; i += 1) {
        if (index === i) {
          domElements.faqTextWrapper[i].style.height =
          domElements.faqItems[i].classList.contains('faq__item_active') ?
            '' : `${heightWrapper}px`;
          domElements.faqItems[i].classList.toggle('faq__item_active');
        } else {
          domElements.faqItems[i].classList.remove('faq__item_active');
          domElements.faqTextWrapper[i].style.height = '';
        }
      }
    });
  });
};
