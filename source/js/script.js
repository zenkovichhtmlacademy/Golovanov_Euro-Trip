'use strict';

let navMain = document.querySelector('.main-nav');
let navToggle = document.querySelector('.main-nav__toggle');
let navContainer = document.querySelector('.container--nojs');
let descriptionTabs = document.querySelectorAll('.description__names-link');
let descriptionList = document.querySelector('.description__list');
let placesLinks = document.querySelectorAll('.places__link');

navMain.classList.remove('main-nav--nojs');
navContainer.classList.remove('container--nojs');
descriptionList.classList.remove('description__list--nojs');

navToggle.addEventListener('click', () => {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});

descriptionTabs.forEach((item) => {
  item.addEventListener('click', (evt) => {
    evt.preventDefault();
    const id = evt.target.id.split('-')[0];

    document.querySelectorAll('.description__names-link').forEach((item) => {
      item.classList.remove('description__names-link--active');
    });
    document.querySelectorAll('.description__item').forEach((item) => {
      item.classList.remove('description__item--current');
    });

    item.classList.add('description__names-link--active');
    document.querySelector('#' + id + '-desc').classList.add('description__item--current');
  });
});

placesLinks.forEach((item) => {
  item.addEventListener('click', (evt) => {
    document.querySelectorAll('.description__names-link').forEach((item) => {
      item.classList.remove('description__names-link--active');
    });
    document.querySelectorAll('.description__item').forEach((item) => {
      item.classList.remove('description__item--current');
    });

    if (!evt.target.hasAttribute('id')) {
      let id = evt.target.parentElement.id.split('-')[0];
      document.querySelector('#' + id + '-tab').classList.add('description__names-link--active');
      document.querySelector('#' + id + '-desc').classList.add('description__item--current');
    } else {
      let id = evt.target.id.split('-')[0];
      document.querySelector('#' + id + '-tab').classList.add('description__names-link--active');
      document.querySelector('#' + id + '-desc').classList.add('description__item--current');
    }
  });
});

let buyButton = document.querySelectorAll('.description__button');
let priceButton = document.querySelectorAll('.price__button');

let buyModal = document.querySelector('.body__modal-overlay');
let allert = document.querySelector('.body__modal-overlay--allert');
let buyModalClose = document.querySelector('.modal__close');
let allertClose = allert.querySelector('.allert__close');

let modalForm = document.querySelector('.modal__form');
let modalInputPhone = modalForm.querySelector('.input__field--phone');
let modalInputEmail = modalForm.querySelector('.input__field--email');
let modalInputExtra = modalForm.querySelector('.input__extra');

let isStorageSupport = true;
let storageInputPhone = '';
let storageInputEmail = '';

try {
  storageInputPhone = localStorage.getItem('phone');
  storageInputEmail = localStorage.getItem('email');
} catch (err) {
  isStorageSupport = false;
}

buyButton.forEach((item) => {
  item.addEventListener('click', (evt) => {
    evt.preventDefault();
    buyModal.classList.add('body__modal-overlay--show');

    if (storageInputPhone && storageInputEmail) {
      modalInputPhone.value = storageInputPhone;
      modalInputEmail.value = storageInputEmail;
      modalInputPhone.focus();
    } else {
      modalInputPhone.focus();
    }
  });
});

priceButton.forEach((item) => {
  item.addEventListener('click', (evt) => {
    evt.preventDefault();
    buyModal.classList.add('body__modal-overlay--show');

    if (storageInputPhone && storageInputEmail) {
      modalInputPhone.value = storageInputPhone;
      modalInputEmail.value = storageInputEmail;
      modalInputPhone.focus();
    } else {
      modalInputPhone.focus();
    }
  });
});

buyModal.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('body__modal-overlay')) {
    buyModal.classList.remove('body__modal-overlay--show');
  }
});

allert.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('body__modal-overlay--allert')) {
    buyModal.classList.remove('body__modal-overlay--show');
    allert.classList.remove('body__modal-overlay--show');
  }
});

buyModalClose.addEventListener('click', (evt) => {
  evt.preventDefault();
  buyModal.classList.remove('body__modal-overlay--show');
  allert.classList.remove('body__modal-overlay--show');
});

allertClose.addEventListener('click', (evt) => {
  evt.preventDefault();
  buyModal.classList.remove('body__modal-overlay--show');
  allert.classList.remove('body__modal-overlay--show');
});

modalForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (!modalInputPhone.value) {
    evt.preventDefault();
    modalInputPhone.classList.add('input__field--invalid');
    modalInputExtra.classList.add('input__extra--invalid');
  } else {
    if (isStorageSupport) {
      localStorage.setItem('login', modalInputPhone.value);
      localStorage.setItem('email', modalInputEmail.value);
    }

    buyModal.classList.remove('body__modal-overlay--show');
    allert.classList.add('body__modal-overlay--show');
  }
});

window.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    if (buyModal.classList.contains('body__modal-overlay--show')) {
      evt.preventDefault();
      buyModal.classList.remove('body__modal-overlay--show');
      allert.classList.remove('body__modal-overlay--show');
    }
  }
});


