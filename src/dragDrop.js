import Sortable from 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/modular/sortable.esm.js';


let sortableInstance = null;

/**
 * Включает drag & drop на элементе грида.
 * @param {HTMLElement} gridElement - Элемент грида.
 * @param {Array} currentMap - Массив с текущей конфигурацией пэдов.
 * @param {Function} renderPads - Функция для перерисовки пэдов.
 */
export function enableDragDrop(gridElement, currentMap, renderPads) {
    if (sortableInstance) return; // уже включено
    sortableInstance = new Sortable(gridElement, {
        animation: 150,
        onEnd: (evt) => {
            const from = evt.oldIndex;
            const to = evt.newIndex;
            if (from === to) return;
            const moved = currentMap.splice(from, 1)[0];
            currentMap.splice(to, 0, moved);
            renderPads(currentMap);
        }
    });
}

/**
 * Выключает drag & drop.
 */
export function disableDragDrop() {
    if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null;
    }
}
