const header = document.querySelector('header');
let recalcAccordionHeight;

window.addEventListener('load', () => {
    // Custom VH
    let vh = window.innerHeight * 0.01;
    let vw = document.documentElement.clientWidth;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        let vw = document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    });

    if (header){
        document.documentElement.style.setProperty('--header-height', `${header.clientHeight}px`);
    }

    // Accordion height
    let accordion_items = document.querySelectorAll('.js-accordion');

    if (accordion_items.length > 0) {
        accordion_items.forEach(item => {
            const btn = item.querySelector('.js-accordion-btn'),
                content = item.querySelector('.js-accordion-content');

            if (btn) {
                btn.addEventListener('click', () => {
                    item.classList.toggle('active');
                    if (item.querySelector('.js-accordion')) {
                        console.log(item.querySelectorAll('.js-accordion'));
                        item.querySelectorAll('.js-accordion').forEach(item => {
                            recalcAccordionHeight(item);
                        })
                    }
                })
            }

            if (content) {
                item.style.setProperty('--height', `${content.clientHeight}px`);
                item.classList.add('_init');
            }
        })
    }
    recalcAccordionHeight = (accordion) => {
        console.log(accordion);
        const content_wrapper = accordion.querySelector('.js-accordion-content .accordion-content__wrapper');


        if (content_wrapper) {
            accordion.style.setProperty('--height', `${content_wrapper.clientHeight}px`);
            accordion.classList.add('_init');
        }
    }

    // Show more
    if(document.querySelectorAll('.js-btn-show-more').length > 0){
        document.querySelectorAll('.js-btn-show-more').forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.js-parent-show-more');
                console.log(parent);
                
                if (parent) {
                    const elemsHolder = parent.querySelectorAll('[data-holder]');

                    elemsHolder.forEach(elem => {
                        if (elem.classList.contains('hide')) {
                            elem.classList.remove('hide');
                        }else{
                            elem.classList.add('hide');    
                        }
                    })

                    
                    const btntText = btn.dataset.text;
                    btn.dataset.text = btn.textContent;
                    btn.innerHTML = btntText;
                    
                    if (btn.closest('.js-accordion')) {
                        recalcAccordionHeight(btn.closest('.js-accordion'));
                    }
                    
                }
            })
        })
    }


})


// Remove class
function removeClass(nodes, className) {
    nodes.forEach(node => {
        node.classList.remove(className);
    })
}

function addClass(nodes, className) {
    nodes.forEach(node => {
        node.classList.add(className);
    })
}

const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

let btns_anchor = document.querySelectorAll('._js-anchor');
btns_anchor.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        let href = btn.href;

        let url = new URL(href);
        href = url.hash;

        if (href !== ''){
            const target = document.querySelector(`${href}`);
            if (target){
                const topOffset = target.offsetTop - document.querySelector('header').clientHeight;
                window.scrollTo({
                    top: topOffset,
                    behavior: "smooth"
                });

                if (btn.closest('nav')) {
                    removeClass(btn.closest('nav').querySelectorAll('._js-anchor'), 'active');
                    btn.classList.add('active');
                }
            }else {
                window.location.href = btn.href;
            }
        }else {
            window.location.href = btn.href;
        }
    })
})
if (document.querySelector('.scroll-top')) {
    document.querySelector('.scroll-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    })
}


// Tabs
let tabBlocks = document.querySelectorAll('._js-tab');
if (tabBlocks.length > 0) {
    tabBlocks.forEach(tabBlock => {
        const btns = tabBlock.querySelectorAll('._js-tab-btn'),
            tabItems = tabBlock.querySelectorAll('._js-tab-item');


        if (btns.length > 1) {
            if (tabBlock.classList.contains('animation')) {
                let activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
                tabBlock.querySelector('.tab-content').style.height = `${activeBlock.clientHeight}px`;
            }

            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    let activeBlock = tabBlock.querySelector(`._js-tab-item[data-id='${btn.dataset.id}']`);

                    removeClass(btns, 'active');
                    removeClass(tabItems, 'active');

                    btn.classList.add('active');
                    activeBlock.classList.add('active');

                    // If block have animation
                    if (tabBlock.classList.contains('animation')) {
                        let activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
                        tabBlock.querySelector('.tab-content').style.height = `${activeBlock.clientHeight}px`;
                    } else {
                        // If block have swiper
                        if (tabBlock.querySelector('.swiper-tabs')) {
                            initSwiperTabs();
                        }
                    }

                    // Скролл якщо елемент виходе за рамки екрану
                    buttonsOffset(tabBlock, btn);
                })
            })
        } else {
            tabBlock.classList.add('inactive');
        }
    })

    function buttonsOffset(tabBlock, btn) {
        const block_wrapper = tabBlock.querySelector('.tabs-btns');
        let paddingLeft = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-left');
        let paddingRight = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-right');
        if (paddingLeft !== '') {
            paddingLeft = +paddingLeft.replace('px', '') * 3;
        }
        if (paddingRight !== '') {
            paddingRight = +paddingRight.replace('px', '') * 3;
        }

        let btn_pos = btn.getBoundingClientRect(),
            block_wrapper_pos = block_wrapper.getBoundingClientRect();

        let need_scroll = false;

        let scroll = 0;
        // Виходе за правий край екрану
        if (btn_pos.right > block_wrapper_pos.right) {
            scroll = block_wrapper.scrollLeft + (btn_pos.right - block_wrapper_pos.right);

            // У випадку якщо таб більший ніж розмір екрану і якщо він після скролу буде виходити за лівий край
            if (btn_pos.width > block_wrapper_pos.width && btn_pos.left - scroll < block_wrapper_pos.left) {
                scroll = scroll - ((btn_pos.left - scroll - block_wrapper_pos.left) * -1);
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
    }
}


// Заблокувати крол та прибрати стрибок
let bodyLockStatus = true;

function bodyLockToggle(delay = 500) {
    if (document.documentElement.classList.contains('lock')) {
        bodyUnlock(delay);
    } else {
        bodyLock(delay);
    }
}

function bodyUnlock(delay = 0) {
    console.log('body unlock');
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
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

function bodyLock(delay = 0) {
    console.log('body lock');
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
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

let overlayModal = document.querySelector('.modal-overlay');
if (overlayModal) {
    overlayModal.addEventListener('click', () => {
        fadeOut(overlayModal);
        closeAllModal();
        bodyUnlock();
    });
}

function closeAllModal() {
    // fadeOut(overlayModal);
    document.querySelectorAll('.js-modal').forEach(modal => {
        modal.classList.remove('active');
    })
}

// Show modal
let btnsOpenModal = document.querySelectorAll('._js-btn-show-modal'),
    btnsCloseModal = document.querySelectorAll('._js-btn-close-modal');


if (btnsOpenModal.length) {
    btnsOpenModal.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.dataset.modal;

            if (modal !== '' && modal !== undefined) {
                const modal_node = document.querySelector(`.js-modal-${modal}`);
                console.log(modal_node);
                if (modal_node) {

                    // Якщо необхідно кліком на одну й ту ж саму кнопку показувати/ховати модалку
                    if (modal_node.dataset.toggle === '') {
                        document.querySelectorAll('.js-modal').forEach(modal1 => {
                            if (modal1 !== modal_node) {
                                modal1.classList.remove('active');
                            }
                        })

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
        })
    })
}
if (btnsCloseModal.length > 0) {
    btnsCloseModal.forEach(btn => {
        btn.addEventListener('click', () => {
            let modal = btn.closest('.js-modal');

            if (modal) {
                modal.classList.remove('active');
            }
            bodyUnlock();
            fadeOut(overlayModal);
        })
    })
}

function fadeIn(elem, speed = 500) {
    elem.classList.remove('fade-in');
    elem.classList.remove('fade-out');

    elem.classList.add('active');

    setTimeout(() => {
        elem.classList.add('fade-in');
    }, speed)
}

function fadeOut(elem, speed = 500) {
    elem.style.opacity = "0";

    setTimeout(() => {
        elem.classList.remove('active');
        elem.classList.remove('fade-in');
        elem.classList.remove('fade-out');

        elem.style = "";
    }, speed)
}



// Init custom select
let defaultCustomSelects = document.querySelectorAll('._js-custom-select[data-default]');

if (defaultCustomSelects.length) {
    defaultCustomSelects.forEach(selectNode => {
        const select = new CustomSelect(selectNode, {});
    })
}

// Mask Phone
function initMaskPhone() {
    let mask_phones = document.querySelectorAll('._js-mask-phone');
    if (mask_phones.length !== 0) {
        mask_phones.forEach(phone => {
            let mask = new Inputmask({
                showMaskOnHover: false,
                regex: '^\\+380[35-9][0-9]{8}$',
                placeholder: " ",
                onBeforeMask: function (value, opts) {
                    return value.replace(/^(0|\+?380)/, "")
                },
            });
            mask.mask(phone);
        })
    }
}

// Mask Email
function initMaskEmail() {
    let mask_email = document.querySelectorAll('._js-mask-email');

    if (mask_email.length !== 0) {
        mask_email.forEach(email => {
            let mask = new Inputmask({
                showMaskOnHover: false,
                mask: "*{1,100}[.*{1,100}][.*{1,100}][.*{1,100}]@*{1,50}[.*{2,20}][.*{1,20}]",
                placeholder: " ",
                greedy: false,
                onBeforePaste: function (pastedValue, opts) {
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
        })
    }
}

if (document.querySelector('#maskinput-script')) {
    document.querySelector('#maskinput-script').addEventListener('load', function () {
        initMaskPhone();
        initMaskEmail();
    });
}

// Validate inputs
let form_groups_required = document.querySelectorAll('.form-group.required, .form-group.valid-not-required');
form_groups_required.forEach(form_group => validate(form_group))

function validate(form_group) {
    const valid_type_arr = form_group.dataset.valid.split(',');

    if (valid_type_arr.length > 0) {
        let error_count = 0;
        for (let i = 0; i < valid_type_arr.length; i++) {
            let valid_type = valid_type_arr[i];
            if (valid_type_arr[i].indexOf('maxlength') !== -1) {
                valid_type = 'maxlength';
            }

            switch (valid_type) {
                case 'empty': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (form_group.classList.contains('required') || form_group.classList.contains('required-merged')) {
                            if (i === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            } else {
                                if (error_count === 0) {
                                    error_count = +!validateField(form_group, valid_type);
                                }
                            }
                        }
                    })
                    break;
                }
                case 'vanilla-select': {
                    form_group.querySelector('select').addEventListener('change', () => {
                        console.log(1488)
                        if (form_group.classList.contains('required') || form_group.classList.contains('required-merged')) {
                            if (i === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            } else {
                                if (error_count === 0) {
                                    error_count = +!validateField(form_group, valid_type);
                                }
                            }
                        }
                    })
                    break;
                }
                case 'mask': {
                    // console.log(form_group);
                    form_group.querySelector('input').addEventListener('blur', () => {
                        if (form_group.classList.contains('required') || form_group.classList.contains('required-merged')) {
                            if (i === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            } else {
                                if (error_count === 0) {
                                    error_count = +!validateField(form_group, valid_type);
                                }
                            }
                        }
                    })
                    break;
                }
                case 'checkbox': {
                    form_group.querySelector('input').addEventListener('change', () => {
                        if (form_group.classList.contains('required')) {
                            if (i === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            } else {
                                if (error_count === 0) {
                                    error_count = +!validateField(form_group, valid_type);
                                }
                            }
                        }
                    })
                    break;
                }
                case 'maxlength': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (i === 0) {
                            error_count = +!validateField(form_group, valid_type_arr[i]);
                        } else {
                            if (error_count === 0) {
                                error_count = +!validateField(form_group, valid_type_arr[i]);
                            }
                        }
                    })
                    break;
                }
                case 'cyrillic': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (i === 0) {
                            error_count = +!validateField(form_group, valid_type);
                        } else {
                            if (error_count === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            }
                        }
                    })
                    break;
                }
                case 'number': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (i === 0) {
                            error_count = +!validateField(form_group, valid_type);
                        } else {
                            if (error_count === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            }
                        }
                    })
                    break;
                }
            }
        }
    }
}

function validateField(form_group, valid_type) {
    // console.log(form_group);
    let maxlength;
    if (valid_type.indexOf('maxlength') !== -1) {
        maxlength = valid_type.split('-')[1];
        valid_type = 'maxlength';
    }

    let isMergedFields = form_group.closest('._js-validate-merged-field');

    let helpBock = form_group.querySelector('.help-block');
    if (isMergedFields) {
        helpBock = form_group.closest('._js-validate-merged-field').querySelector('.help-block-merged');
    }

    let result;

    switch (valid_type) {
        case 'empty': {
            const input = form_group.querySelector('input, textarea');

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
        case 'mask': {
            const input = form_group.querySelector('input');

            if (input.inputmask.isComplete()) {
                form_group.classList.remove('has-error');
                result = true;
            } else {
                form_group.classList.add('has-error');
                helpBock.innerHTML = helpBock.dataset.empty;
                result = false;
            }
            

            break;
        }
        case 'checkbox': {
            const input = form_group.querySelector('input');
            if (input.checked) {
                form_group.classList.remove('has-error');
                result = true;
            } else {
                form_group.classList.add('has-error');
                helpBock.innerHTML = helpBock.dataset.empty;
                result = false;
            }
            

            break;
        }
        case 'select': {
            let select_target = form_group.querySelector('[data-select]');
            let val = '';

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
        case 'vanilla-select': {
            const select = form_group.querySelector('select');

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
        case 'maxlength': {
            const input = form_group.querySelector('input, textarea');

            if (input.value.length > maxlength) {
                form_group.classList.add('has-error');
                helpBock.innerHTML = helpBock.dataset.maxlength;
                result = true;
            } else {
                form_group.classList.remove('has-error');
                result = false;
            }


            break;
        }
        case 'cyrillic': {
            const input = form_group.querySelector('input, textarea');
            // let regex = /^[а-яіїє' -]+$/gi;
            let regex = /^([а-яіїє' -]+)?$/gi;


            if (!regex.test(input.value)) {
                form_group.classList.add('has-error');
                helpBock.innerHTML = helpBock.dataset.cyrillic;

                result = false;
            } else {
                form_group.classList.remove('has-error');
                result = true;
            }


            break;
        }
        case 'number': {
            const input = form_group.querySelector('input, textarea');
            // let regex = /^[а-яіїє' -]+$/gi;
            let regex = /^\d+$/;

            if (!regex.test(input.value)) {
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
    let required_fields = form.querySelectorAll('.required');
    let errors = 0;
    let errors_fields = [];


    required_fields.forEach(form_group => {
        const valid_type_arr = form_group.dataset.valid.split(',');
        let error_valid_count = 0;

        for (let i = 0; i < valid_type_arr.length; i++) {
            let valid_type = valid_type_arr[i];

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
            block: "center",
        });
        return false;
    }
}

function resetForm(form) {
    form.reset();
    let form_groups = form.querySelectorAll('.form-group');

    form_groups.forEach(form_group => {
        form_group.classList.remove('focus');
    })
}

function toggleRequired(block, action) {
    let requiredElems = block.querySelectorAll('[data-required]');

    if (action === 'add') {
        requiredElems.forEach(item => {
            item.classList.add('required');
            validate(item);
        })
    } else {
        requiredElems.forEach(item => {
            item.classList.remove('required');
            item.classList.remove('has-error');
        })
    }
}

// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}


function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
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
            prevEl: '.review-prev',
        },
        breakpoints: {
            320: {
                spaceBetween: 20,
                slidesPerView: 1,
            },
            1024: {
                spaceBetween: 30,
                slidesPerView: 2,
            }
        }
    })
}


// Show hidden menu
if (document.querySelector('.js-show-menu')) {
    document.querySelectorAll('.js-show-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            header.classList.toggle('show-hidden-menu');
            bodyLockToggle();
        })
    })
}

// Initial default select2
$(document).ready(function() {
    if (document.querySelectorAll('.js-select2').length > 0) {
        document.querySelectorAll('.js-select2').forEach(select2 => {
            let params = {
                minimumResultsForSearch: -1,
                dropdownCssClass: 'test-4'
            };

            if (select2.dataset.placeholder !== undefined && select2.dataset.placeholder !== null) {
                params.placeholder = select2.dataset.placeholder;
            }
            
            if (select2.dataset.search !== undefined && select2.dataset.search !== null) {
                params.minimumResultsForSearch = 0;
            }

            if (select2.dataset.customTheme !== undefined && select2.dataset.customTheme !== null && select2.dataset.customTheme.trim() !== '') {
                params.dropdownCssClass = select2.dataset.customTheme;
            }      
            
            $(select2).select2(params);     

            if (select2.nextElementSibling && select2.dataset.customTheme !== undefined && select2.dataset.customTheme !== null && select2.dataset.customTheme.trim() !== '') {
                select2.nextElementSibling.classList.add(select2.dataset.customTheme);
            }      
        })
        
    }
    
});