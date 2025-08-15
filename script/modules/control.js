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
    domElements.header.classList.add('header_active');
    domElements.navigationList.style.visibility = 'visible';
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
        domElements.header.classList.remove('header_active');
        domElements.navigationList.style.visibility = 'hidden';
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


// !Применение Inputmask
const telMask = new Inputmask('+7 (999)-999-99-99');
telMask.mask(variables.modalInputTel);

// !Применение валидации модального окна
const justValidate = new JustValidate('.js-modal-form', {
  errorLabelStyle: {
    color: '#f90404ff', // цвет текста ошибки
    fontSize: '14px',
  },
  tooltip: { // !Добавляем tooltip чтоб модальное окно не прыгало
    position: 'bottom',
  },

});
justValidate
    .addField('.js-modal-input-name', [
      {
        rule: 'required',
        errorMessage: 'Укажите ваше имя',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Не короче 2 символов',
      },
    ])
    .addField('.js-modal-input-tel', [
      {
        rule: 'required',
        errorMessage: 'Укажите ваш номер телефона',
      },
      {
        validator(value) {
          const phone = variables.modalInputTel.inputmask.unmaskedvalue();
          return !!(Number(phone) && phone.length === 10);
        },
        errorMessage: 'Телефон не корректный',
      },
    ]);

// !Использование flatpickr

flatpickr.localize(flatpickr.l10ns.ru);

flatpickr(variables.reservationDateInput, {
  dateFormat: "d.m",
  minDate: "today",
  onReady: function (selectedDates, dateStr, instance) {
    instance.calendarContainer
      .querySelector('.flatpickr-next-month')
      .innerHTML = 
      `
      <svg class="flatpickr-arrow-right" width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 12.0001C0.5 11.6686 0.631696 11.3507 0.866116 11.1162C1.10054 10.8818 1.41848 10.7501 1.75 10.7501H31.2325L23.365 2.88511C23.1303 2.6504 22.9984 2.33205 22.9984 2.00011C22.9984 1.66817 23.1303 1.34983 23.365 1.11511C23.5997 0.880397 23.9181 0.748535 24.25 0.748535C24.5819 0.748535 24.9003 0.880397 25.135 1.11511L35.135 11.1151C35.2514 11.2312 35.3438 11.3692 35.4068 11.521C35.4698 11.6729 35.5022 11.8357 35.5022 12.0001C35.5022 12.1645 35.4698 12.3273 35.4068 12.4792C35.3438 12.6311 35.2514 12.769 35.135 12.8851L25.135 22.8851C24.9003 23.1198 24.5819 23.2517 24.25 23.2517C23.9181 23.2517 23.5997 23.1198 23.365 22.8851C23.1303 22.6504 22.9984 22.3321 22.9984 22.0001C22.9984 21.6682 23.1303 21.3498 23.365 21.1151L31.2325 13.2501H1.75C1.41848 13.2501 1.10054 13.1184 0.866116 12.884C0.631696 12.6496 0.5 12.3316 0.5 12.0001Z" fill="black"/>
      </svg>
      `;
    instance.calendarContainer
      .querySelector('.flatpickr-prev-month')
      .innerHTML = 
      `
      <svg class="flatpickr-arrow-left" width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M35.5 12.0001C35.5 11.6686 35.3683 11.3507 35.1339 11.1162C34.8995 10.8818 34.5815 10.7501 34.25 10.7501H4.7675L12.635 2.88511C12.8697 2.6504 13.0016 2.33205 13.0016 2.00011C13.0016 1.66817 12.8697 1.34983 12.635 1.11511C12.4003 0.880397 12.0819 0.748535 11.75 0.748535C11.4181 0.748535 11.0997 0.880397 10.865 1.11511L0.864998 11.1151C0.748592 11.2312 0.656235 11.3692 0.59322 11.521C0.530205 11.6729 0.497765 11.8357 0.497765 12.0001C0.497765 12.1645 0.530205 12.3273 0.59322 12.4792C0.656235 12.6311 0.748592 12.769 0.864998 12.8851L10.865 22.8851C11.0997 23.1198 11.4181 23.2517 11.75 23.2517C12.0819 23.2517 12.4003 23.1198 12.635 22.8851C12.8697 22.6504 13.0016 22.3321 13.0016 22.0001C13.0016 21.6682 12.8697 21.3498 12.635 21.1151L4.7675 13.2501H34.25C34.5815 13.2501 34.8995 13.1184 35.1339 12.884C35.3683 12.6496 35.5 12.3316 35.5 12.0001Z" fill="black"/>
      </svg>
      `;
  },
});

// !Использование choice js

const choices = new Choices('.reservation-time', {
  itemSelectText: '',
  searchEnabled: false,
});


