// ==UserScript==
// @name         Remove ads yandex mail
// @version      0.6
// @description  Удаляет рекламу из почты yandex
// @author       BaHeK
// @match        http*://mail.yandex.ru/*
// @grant        none
// @downloadUrl  https://github.com/BaHeK1994/remove-ads-yandex-mail/raw/main/script.user.js
// @updateUrl    https://github.com/BaHeK1994/remove-ads-yandex-mail/raw/main/script.user.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;

    // Отслеживаем изменения HTML через observer
    let startObserver = () => {
        observer = new MutationObserver(() => {
            remove();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    };

    let remove = () => {
        // Ищем div с class="message-list-banner-portal"
        document.querySelectorAll('[class="message-list-banner-portal"]').forEach((e) => {
            let banner = e.nextSibling;

            // Уже скрыто
            if (banner.style.display === "none") {
                return;
            }

            // Отключаем листенер изменения DOM, иначе будет рекурсия
            if (observer !== null) {
                observer.disconnect();
                observer = null;
            }

            // Скрываем элемент рекламы
            banner.style.display = 'none';
        });

        // Ищем элементы с атрибутом data-key="view=*"
        // TODO: проверить актуально ли это
        document.querySelectorAll('[data-key^="view="]').forEach((e) => {
            // Получаем dataset key
            let key = e.dataset['key'];
            // У элементов с рекламой после view= идут только английские буквы
            let matches = key.match(/^view=([a-z]+)$/);
            if (matches == null) {
                return;
            }
            // Нужные элементы, их не надо удалять
            if (['notifications', 'labels', 'footer', 'app'].indexOf(matches[1]) !== -1) {
                return;
            }

            // Уже скрыто
            if (e.style.display === "none") {
                return;
            }

            // Отключаем листенер изменения DOM, иначе будет рекурсия
            if (observer !== null) {
                observer.disconnect();
                observer = null;
            }

            // Скрываем элемент рекламы
            e.style.display = 'none';
        });

        // Скрываем родительский элемент .BannersBlock
        document.querySelectorAll('.BannersBlock').forEach((e) => {
            let parent = e.parentElement;

            // Уже скрыто
            if (parent.style.display === "none") {
                return;
            }

            // Отключаем листенер изменения DOM, иначе будет рекурсия
            if (observer !== null) {
                observer.disconnect();
                observer = null;
            }

            // Скрываем
            parent.style.display = 'none';
        });

        // Запускаем observer
        if (observer === null) {
            startObserver();
        }
    };

    // Моментально скрываем рекламу, не дожидаясь изменений на странице
    remove();
})();
