const navigationButton = document.querySelector('.js-navigation-menu');
const header = document.querySelector('.header');
const navigationList = document.querySelector('.navigation');
const navigationLink = navigationList.querySelectorAll('.navigation__link');
const modalOpenButtons = document.querySelectorAll('.header__button');
const modalOverlay = document.querySelector('.js-overlay');
const faqItems = document.querySelectorAll('.faq__item');
const faqButtons = document.querySelectorAll('.faq__question');
const faqTextWrapper = document.querySelectorAll('.faq__text-wrapper');


export default {
  navigationButton,
  navigationList,
  navigationLink,
  header,
  modalOpenButtons,
  modalOverlay,
  faqItems,
  faqButtons,
  faqTextWrapper,
};
