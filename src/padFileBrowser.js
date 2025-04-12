// src/padFileBrowser.js

export function createFileTree(treeData, onSelect) {
    const container = document.createElement('div');
    container.classList.add('file-tree');

    function buildList(data, currentPath = '') {
        const ul = document.createElement('ul');
        data.forEach(item => {
            const li = document.createElement('li');
            const itemPath = currentPath ? currentPath + '/' + item.name : item.name;
            if (item.children) {
                li.textContent = item.name;
                li.classList.add('folder');
                const childList = buildList(item.children, itemPath);
                li.appendChild(childList);
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    li.classList.toggle('expanded');
                });
            } else {
                li.textContent = item.name;
                li.classList.add('file');
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (onSelect) onSelect(itemPath);
                });
            }
            ul.appendChild(li);
        });
        return ul;
    }

    container.appendChild(buildList(treeData));
    return container;
}
