"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var header = document.querySelector('header');
var recalcAccordionHeight;
window.addEventListener('load', function () {
  // Custom VH
  var vh = window.innerHeight * 0.01;
  var vw = document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
  document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
  window.addEventListener('resize', function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
    var vw = document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
  });
  if (header) {
    document.documentElement.style.setProperty('--header-height', "".concat(header.clientHeight, "px"));
  }

  // Accordion height
  var accordion_items = document.querySelectorAll('.js-accordion');
  if (accordion_items.length > 0) {
    accordion_items.forEach(function (item) {
      var btn = item.querySelector('.js-accordion-btn'),
        content = item.querySelector('.js-accordion-content');
      if (btn) {
        btn.addEventListener('click', function () {
          item.classList.toggle('active');
        });
      }
      if (content) {
        item.style.setProperty('--height', "".concat(content.clientHeight, "px"));
        item.classList.add('_init');
      }
    });
  }
  recalcAccordionHeight = function recalcAccordionHeight(accordion) {
    console.log(accordion);
    var content_wrapper = accordion.querySelector('.js-accordion-content .accordion-content__wrapper');
    if (content_wrapper) {
      accordion.style.setProperty('--height', "".concat(content_wrapper.clientHeight, "px"));
      accordion.classList.add('_init');
    }
  };

  // Show more
  if (document.querySelectorAll('.js-btn-show-more').length > 0) {
    document.querySelectorAll('.js-btn-show-more').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parent = btn.closest('.js-parent-show-more');
        console.log(parent);
        if (parent) {
          var elemsHolder = parent.querySelectorAll('[data-holder]');
          elemsHolder.forEach(function (elem) {
            if (elem.classList.contains('hide')) {
              elem.classList.remove('hide');
            } else {
              elem.classList.add('hide');
            }
          });
          var btntText = btn.dataset.text;
          btn.dataset.text = btn.textContent;
          btn.innerHTML = btntText;
          if (btn.closest('.js-accordion')) {
            recalcAccordionHeight(btn.closest('.js-accordion'));
          }
        }
      });
    });
  }
});

// Remove class
function removeClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.remove(className);
  });
}
function addClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.add(className);
  });
}
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
var btns_anchor = document.querySelectorAll('._js-anchor');
btns_anchor.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    var href = btn.href;
    var url = new URL(href);
    href = url.hash;
    if (href !== '') {
      var target = document.querySelector("".concat(href));
      if (target) {
        var topOffset = target.offsetTop - document.querySelector('header').clientHeight;
        window.scrollTo({
          top: topOffset,
          behavior: "smooth"
        });
        if (btn.closest('nav')) {
          removeClass(btn.closest('nav').querySelectorAll('._js-anchor'), 'active');
          btn.classList.add('active');
        }
      } else {
        window.location.href = btn.href;
      }
    } else {
      window.location.href = btn.href;
    }
  });
});
if (document.querySelector('.scroll-top')) {
  document.querySelector('.scroll-top').addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// Tabs
var tabBlocks = document.querySelectorAll('._js-tab');
if (tabBlocks.length > 0) {
  var buttonsOffset = function buttonsOffset(tabBlock, btn) {
    var block_wrapper = tabBlock.querySelector('.tabs-btns');
    var paddingLeft = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-left');
    var paddingRight = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-right');
    if (paddingLeft !== '') {
      paddingLeft = +paddingLeft.replace('px', '') * 3;
    }
    if (paddingRight !== '') {
      paddingRight = +paddingRight.replace('px', '') * 3;
    }
    var btn_pos = btn.getBoundingClientRect(),
      block_wrapper_pos = block_wrapper.getBoundingClientRect();
    var need_scroll = false;
    var scroll = 0;
    // Виходе за правий край екрану
    if (btn_pos.right > block_wrapper_pos.right) {
      scroll = block_wrapper.scrollLeft + (btn_pos.right - block_wrapper_pos.right);

      // У випадку якщо таб більший ніж розмір екрану і якщо він після скролу буде виходити за лівий край
      if (btn_pos.width > block_wrapper_pos.width && btn_pos.left - scroll < block_wrapper_pos.left) {
        scroll = scroll - (btn_pos.left - scroll - block_wrapper_pos.left) * -1;
      }
      scroll = scroll + paddingRight;
      need_scroll = true;
    }

    // Виходе за лівий край екрану
    if (btn_pos.left < block_wrapper_pos.left) {
      scroll = block_wrapper.scrollLeft - (btn_pos.left * -1 + block_wrapper_pos.left);
      need_scroll = true;
      scroll = scroll - paddingLeft;
    }
    if (need_scroll) {
      block_wrapper.scrollTo({
        left: scroll,
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  tabBlocks.forEach(function (tabBlock) {
    var btns = tabBlock.querySelectorAll('._js-tab-btn'),
      tabItems = tabBlock.querySelectorAll('._js-tab-item');
    if (btns.length > 1) {
      if (tabBlock.classList.contains('animation')) {
        var activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
        tabBlock.querySelector('.tab-content').style.height = "".concat(activeBlock.clientHeight, "px");
      }
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var activeBlock = tabBlock.querySelector("._js-tab-item[data-id='".concat(btn.dataset.id, "']"));
          removeClass(btns, 'active');
          removeClass(tabItems, 'active');
          btn.classList.add('active');
          activeBlock.classList.add('active');

          // If block have animation
          if (tabBlock.classList.contains('animation')) {
            var _activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
            tabBlock.querySelector('.tab-content').style.height = "".concat(_activeBlock.clientHeight, "px");
          } else {
            // If block have swiper
            if (tabBlock.querySelector('.swiper-tabs')) {
              initSwiperTabs();
            }
          }

          // Скролл якщо елемент виходе за рамки екрану
          buttonsOffset(tabBlock, btn);
        });
      });
    } else {
      tabBlock.classList.add('inactive');
    }
  });
}

// Заблокувати крол та прибрати стрибок
var bodyLockStatus = true;
function bodyLockToggle() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
}
function bodyUnlock() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  console.log('body unlock');
  var body = document.querySelector("body");
  if (bodyLockStatus) {
    var lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(function () {
      for (var index = 0; index < lock_padding.length; index++) {
        var el = lock_padding[index];
        //el.style.paddingRight = '0px';
      }
      // body.style.paddingRight = '0px';
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
function bodyLock() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  console.log('body lock');
  var body = document.querySelector("body");
  if (bodyLockStatus) {
    var lock_padding = document.querySelectorAll("[data-lp]");
    for (var index = 0; index < lock_padding.length; index++) {
      var el = lock_padding[index];
      // el.style.paddingRight = window.innerWidth - document.querySelector('.main').offsetWidth + 'px';
    }
    // body.style.paddingRight = window.innerWidth - document.querySelector('.main').offsetWidth + 'px';

    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
var overlayModal = document.querySelector('.modal-overlay');
if (overlayModal) {
  overlayModal.addEventListener('click', function () {
    fadeOut(overlayModal);
    closeAllModal();
    bodyUnlock();
  });
}
function closeAllModal() {
  // fadeOut(overlayModal);
  document.querySelectorAll('.js-modal').forEach(function (modal) {
    modal.classList.remove('active');
  });
}

// Show modal
var btnsOpenModal = document.querySelectorAll('._js-btn-show-modal'),
  btnsCloseModal = document.querySelectorAll('._js-btn-close-modal');
if (btnsOpenModal.length) {
  btnsOpenModal.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = btn.dataset.modal;
      if (modal !== '' && modal !== undefined) {
        var modal_node = document.querySelector(".js-modal-".concat(modal));
        console.log(modal_node);
        if (modal_node) {
          // Якщо необхідно кліком на одну й ту ж саму кнопку показувати/ховати модалку
          if (modal_node.dataset.toggle === '') {
            document.querySelectorAll('.js-modal').forEach(function (modal1) {
              if (modal1 !== modal_node) {
                modal1.classList.remove('active');
              }
            });
            if (modal_node.classList.contains('active')) {
              modal_node.classList.remove('active');
              bodyUnlock();

              // If need show blur overlay
              if (modal_node.dataset.overlay === '') {
                fadeOut(overlayModal);
              }
            } else {
              modal_node.classList.add('active');
              bodyLock();

              // If need show blur overlay
              if (modal_node.dataset.overlay === '') {
                fadeIn(overlayModal);
              }
            }
          } else {
            closeAllModal();
            fadeIn(overlayModal, 200);
            fadeIn(modal_node, 300);
            // modal_node.classList.add('active');
            bodyLock();
          }
        }
      }
    });
  });
}
if (btnsCloseModal.length > 0) {
  btnsCloseModal.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = btn.closest('.js-modal');
      if (modal) {
        modal.classList.remove('active');
      }
      bodyUnlock();
      fadeOut(overlayModal);
    });
  });
}
function fadeIn(elem) {
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  elem.classList.remove('fade-in');
  elem.classList.remove('fade-out');
  elem.classList.add('active');
  setTimeout(function () {
    elem.classList.add('fade-in');
  }, speed);
}
function fadeOut(elem) {
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  elem.style.opacity = "0";
  setTimeout(function () {
    elem.classList.remove('active');
    elem.classList.remove('fade-in');
    elem.classList.remove('fade-out');
    elem.style = "";
  }, speed);
}

// Init custom select
var defaultCustomSelects = document.querySelectorAll('._js-custom-select[data-default]');
if (defaultCustomSelects.length) {
  defaultCustomSelects.forEach(function (selectNode) {
    var select = new CustomSelect(selectNode, {});
  });
}

// Mask Phone
function initMaskPhone() {
  var mask_phones = document.querySelectorAll('._js-mask-phone');
  if (mask_phones.length !== 0) {
    mask_phones.forEach(function (phone) {
      var mask = new Inputmask({
        showMaskOnHover: false,
        regex: '^\\+380[35-9][0-9]{8}$',
        placeholder: " ",
        onBeforeMask: function onBeforeMask(value, opts) {
          return value.replace(/^(0|\+?380)/, "");
        }
      });
      mask.mask(phone);
    });
  }
}

// Mask Email
function initMaskEmail() {
  var mask_email = document.querySelectorAll('._js-mask-email');
  if (mask_email.length !== 0) {
    mask_email.forEach(function (email) {
      var mask = new Inputmask({
        showMaskOnHover: false,
        mask: "*{1,100}[.*{1,100}][.*{1,100}][.*{1,100}]@*{1,50}[.*{2,20}][.*{1,20}]",
        placeholder: " ",
        greedy: false,
        onBeforePaste: function onBeforePaste(pastedValue, opts) {
          pastedValue = pastedValue.toLowerCase();
          return pastedValue.replace("mailto:", "");
        },
        definitions: {
          '*': {
            validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
            casing: "lower"
          }
        }
      });
      mask.mask(email);
    });
  }
}
if (document.querySelector('#maskinput-script')) {
  document.querySelector('#maskinput-script').addEventListener('load', function () {
    initMaskPhone();
    initMaskEmail();
  });
}

// Validate inputs
var form_groups_required = document.querySelectorAll('.form-group.required, .form-group.valid-not-required');
form_groups_required.forEach(function (form_group) {
  return validate(form_group);
});
function validate(form_group) {
  var valid_type_arr = form_group.dataset.valid.split(',');
  if (valid_type_arr.length > 0) {
    var error_count = 0;
    var _loop = function _loop(i) {
      var valid_type = valid_type_arr[i];
      if (valid_type_arr[i].indexOf('maxlength') !== -1) {
        valid_type = 'maxlength';
      }
      switch (valid_type) {
        case 'empty':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (form_group.classList.contains('required') || form_group.classList.contains('required-merged')) {
                if (i === 0) {
                  error_count = +!validateField(form_group, valid_type);
                } else {
                  if (error_count === 0) {
                    error_count = +!validateField(form_group, valid_type);
                  }
                }
              }
            });
            break;
          }
        case 'vanilla-select':
          {
            form_group.querySelector('select').addEventListener('change', function () {
              console.log(1488);
              if (form_group.classList.contains('required') || form_group.classList.contains('required-merged')) {
                if (i === 0) {
                  error_count = +!validateField(form_group, valid_type);
                } else {
                  if (error_count === 0) {
                    error_count = +!validateField(form_group, valid_type);
                  }
                }
              }
            });
            break;
          }
        case 'mask':
          {
            // console.log(form_group);
            form_group.querySelector('input').addEventListener('blur', function () {
              if (form_group.classList.contains('required') || form_group.classList.contains('required-merged')) {
                if (i === 0) {
                  error_count = +!validateField(form_group, valid_type);
                } else {
                  if (error_count === 0) {
                    error_count = +!validateField(form_group, valid_type);
                  }
                }
              }
            });
            break;
          }
        case 'checkbox':
          {
            form_group.querySelector('input').addEventListener('change', function () {
              if (form_group.classList.contains('required')) {
                if (i === 0) {
                  error_count = +!validateField(form_group, valid_type);
                } else {
                  if (error_count === 0) {
                    error_count = +!validateField(form_group, valid_type);
                  }
                }
              }
            });
            break;
          }
        case 'maxlength':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (i === 0) {
                error_count = +!validateField(form_group, valid_type_arr[i]);
              } else {
                if (error_count === 0) {
                  error_count = +!validateField(form_group, valid_type_arr[i]);
                }
              }
            });
            break;
          }
        case 'cyrillic':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (i === 0) {
                error_count = +!validateField(form_group, valid_type);
              } else {
                if (error_count === 0) {
                  error_count = +!validateField(form_group, valid_type);
                }
              }
            });
            break;
          }
        case 'number':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (i === 0) {
                error_count = +!validateField(form_group, valid_type);
              } else {
                if (error_count === 0) {
                  error_count = +!validateField(form_group, valid_type);
                }
              }
            });
            break;
          }
      }
    };
    for (var i = 0; i < valid_type_arr.length; i++) {
      _loop(i);
    }
  }
}
function validateField(form_group, valid_type) {
  // console.log(form_group);
  var maxlength;
  if (valid_type.indexOf('maxlength') !== -1) {
    maxlength = valid_type.split('-')[1];
    valid_type = 'maxlength';
  }
  var isMergedFields = form_group.closest('._js-validate-merged-field');
  var helpBock = form_group.querySelector('.help-block');
  if (isMergedFields) {
    helpBock = form_group.closest('._js-validate-merged-field').querySelector('.help-block-merged');
  }
  var result;
  switch (valid_type) {
    case 'empty':
      {
        var input = form_group.querySelector('input, textarea');
        if (input.value.trim() === "") {
          form_group.classList.add('has-error');
          helpBock.innerHTML = helpBock.dataset.empty;
          result = false;
        } else {
          form_group.classList.remove('has-error');
          result = true;
        }
        break;
      }
    case 'mask':
      {
        var _input = form_group.querySelector('input');
        if (_input.inputmask.isComplete()) {
          form_group.classList.remove('has-error');
          result = true;
        } else {
          form_group.classList.add('has-error');
          helpBock.innerHTML = helpBock.dataset.empty;
          result = false;
        }
        break;
      }
    case 'checkbox':
      {
        var _input2 = form_group.querySelector('input');
        if (_input2.checked) {
          form_group.classList.remove('has-error');
          result = true;
        } else {
          form_group.classList.add('has-error');
          helpBock.innerHTML = helpBock.dataset.empty;
          result = false;
        }
        break;
      }
    case 'select':
      {
        var select_target = form_group.querySelector('[data-select]');
        var val = '';
        if (select_target.dataset.type === 'button') {
          val = form_group.querySelector('button').value.trim();
        } else {
          val = form_group.querySelector('input[type="hidden"]').value.trim();
        }
        if (val === '') {
          form_group.classList.add('has-error');
          result = false;
        } else {
          form_group.classList.remove('has-error');
          result = true;
        }
        break;
      }
    case 'vanilla-select':
      {
        var select = form_group.querySelector('select');
        if (select.value.trim() === '-1') {
          form_group.classList.add('has-error');
          helpBock.innerHTML = helpBock.dataset.empty;
          result = false;
        } else {
          form_group.classList.remove('has-error');
          result = true;
        }
        break;
      }
    case 'maxlength':
      {
        var _input3 = form_group.querySelector('input, textarea');
        if (_input3.value.length > maxlength) {
          form_group.classList.add('has-error');
          helpBock.innerHTML = helpBock.dataset.maxlength;
          result = true;
        } else {
          form_group.classList.remove('has-error');
          result = false;
        }
        break;
      }
    case 'cyrillic':
      {
        var _input4 = form_group.querySelector('input, textarea');
        // let regex = /^[а-яіїє' -]+$/gi;
        var regex = /^([а-яіїє' -]+)?$/gi;
        if (!regex.test(_input4.value)) {
          form_group.classList.add('has-error');
          helpBock.innerHTML = helpBock.dataset.cyrillic;
          result = false;
        } else {
          form_group.classList.remove('has-error');
          result = true;
        }
        break;
      }
    case 'number':
      {
        var _input5 = form_group.querySelector('input, textarea');
        // let regex = /^[а-яіїє' -]+$/gi;
        var _regex = /^\d+$/;
        if (!_regex.test(_input5.value)) {
          form_group.classList.add('has-error');
          helpBock.innerHTML = helpBock.dataset.number;
          result = false;
        } else {
          form_group.classList.remove('has-error');
          result = true;
        }
        break;
      }
  }

  // console.log(result);
  return result;
}
function validateForm(form) {
  var required_fields = form.querySelectorAll('.required');
  var errors = 0;
  var errors_fields = [];
  required_fields.forEach(function (form_group) {
    var valid_type_arr = form_group.dataset.valid.split(',');
    var error_valid_count = 0;
    for (var i = 0; i < valid_type_arr.length; i++) {
      var valid_type = valid_type_arr[i];
      if (valid_type_arr[i].indexOf('maxlength') !== -1) {
        valid_type = 'maxlength';
      }
      if (i === 0) {
        if (!validateField(form_group, valid_type_arr[i])) {
          error_valid_count = 1;
          errors += 1;
          errors_fields.push(form_group);
        } else {
          error_valid_count = 0;
        }
      } else {
        if (error_valid_count === 0) {
          if (!validateField(form_group, valid_type_arr[i])) {
            error_valid_count = 1;
            errors += 1;
            errors_fields.push(form_group);
          } else {
            error_valid_count = 0;
          }
        }
      }
    }
  });
  if (errors === 0) {
    return true;
  } else {
    errors_fields[0].scrollIntoView({
      behavior: 'smooth',
      block: "center"
    });
    return false;
  }
}
function resetForm(form) {
  form.reset();
  var form_groups = form.querySelectorAll('.form-group');
  form_groups.forEach(function (form_group) {
    form_group.classList.remove('focus');
  });
}
function toggleRequired(block, action) {
  var requiredElems = block.querySelectorAll('[data-required]');
  if (action === 'add') {
    requiredElems.forEach(function (item) {
      item.classList.add('required');
      validate(item);
    });
  } else {
    requiredElems.forEach(function (item) {
      item.classList.remove('required');
      item.classList.remove('has-error');
    });
  }
}

// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  options = _objectSpread({
    path: '/'
  }, options);
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (var optionKey in options) {
    updatedCookie += "; " + optionKey;
    var optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}
function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  });
}

// Select default
var selects = document.querySelectorAll('select');
if (selects.length > 0) {
  selects.forEach(function (select) {
    if (select.querySelector('option[value="-1"]')) {
      var val = select.value;
      if (val === '-1') {
        select.closest('.form-group').classList.add('show-placeholder');
      }
      select.addEventListener('change', function () {
        var val = select.value;
        if (val === '-1') {
          select.closest('.form-group').classList.add('show-placeholder');
        } else {
          select.closest('.form-group').classList.remove('show-placeholder');
        }
      });
    }
  });
}

// Home review
if (document.querySelector('.review-swiper')) {
  new Swiper('.review-swiper', {
    speed: 500,
    navigation: {
      nextEl: '.review-next',
      prevEl: '.review-prev'
    },
    breakpoints: {
      320: {
        spaceBetween: 20,
        slidesPerView: 1
      },
      1024: {
        spaceBetween: 30,
        slidesPerView: 2
      }
    }
  });
}

// Show hidden menu
if (document.querySelector('.js-show-menu')) {
  document.querySelectorAll('.js-show-menu').forEach(function (btn) {
    btn.addEventListener('click', function () {
      header.classList.toggle('show-hidden-menu');
      bodyLockToggle();
    });
  });
}