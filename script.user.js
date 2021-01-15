// ==UserScript==
// @name         Remove ads yandex mail
// @version      0.1
// @description  Удаляет рекламу из почты yandex
// @author       BaHeK
// @include      /^https?:\/\/mail\.yandex\.ru/
// @grant        none
// @downloadUrl  https://github.com/BaHeK1994/remove-ads-yandex-mail/raw/main/script.user.js
// @updateUrl    https://github.com/BaHeK1994/remove-ads-yandex-mail/raw/main/script.user.js
// ==/UserScript==

(function() {
    'use strict';

    let remove = function() {
        // Ищем элементы с атрибутом data-key="view=*"
        let elements = document.querySelectorAll('[data-key^="view="]');
        if(elements.length) {
            elements.forEach(function(e) {
                // Получаем dataset key
                let key = e.dataset['key'];
                // У элементов с рекламой после view= идут только английские буквы
                let matches = key.match(/^view=([a-z]+)$/);
                if(matches == null) {
                    return;
                }
                // Нужные элементы, их не надо удалять
                if(['notifications', 'labels', 'footer'].indexOf(matches[1]) !== -1) {
                    return;
                }
                // Отключаем листенер изменения DOM, иначе будет рекурсия
                document.body.removeEventListener('DOMSubtreeModified', remove, false);
                // Удаляем элемент рекламы
                e.parentNode.removeChild(e);
                // Включаем листенер обратно, т.к. реклама может появиться после обновления списка писем
                document.body.addEventListener('DOMSubtreeModified', remove, false);
            });
        }
    };

    // Если запустить раньше, то будет ошибка: https://img-host.su/JQrL.png
    setTimeout(function() {
        // Включаем листенер, чтобы удалять рекламу сразу после ее появления
        document.body.addEventListener('DOMSubtreeModified', remove, false);
    }, 3000);
})();
