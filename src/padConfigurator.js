// src/padConfigurator.js

import { createFileTree } from './padFileBrowser.js';
import { sampleTree } from './sampleTree.js';

let configModeEnabled = false;
let modal = null;

export function enablePadConfigurationMode(gridElement, currentMap, renderPads) {
    configModeEnabled = true;
    const pads = gridElement.querySelectorAll('.fingerpad__pad');
    pads.forEach(btn => {
        if (btn.querySelector('.configure-icon')) return;
        const configIcon = document.createElement('span');
        configIcon.classList.add('configure-icon');
        configIcon.textContent = '✎';
        configIcon.style.position = 'absolute';
        configIcon.style.top = '2px';
        configIcon.style.right = '2px';
        configIcon.style.fontSize = '0.8rem';
        configIcon.style.cursor = 'pointer';
        configIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const padIndex = btn.dataset.index;
            openFileBrowser(newFilePath => {
                if (newFilePath) {
                    // Формируем путь относительно корня
                    currentMap[padIndex].sound = "./Drum_One_Shots/" + newFilePath;
                    renderPads(currentMap);
                }
            });
        });
        btn.style.position = 'relative';
        btn.appendChild(configIcon);
    });
}

export function disablePadConfigurationMode(gridElement) {
    configModeEnabled = false;
    const icons = gridElement.querySelectorAll('.configure-icon');
    icons.forEach(icon => icon.remove());
    closeFileBrowser();
}

export function isPadConfigurationModeEnabled() {
    return configModeEnabled;
}

function openFileBrowser(onSelect) {
    if (modal) return;
    modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    const browserContainer = document.createElement('div');
    browserContainer.classList.add('file-browser-container');
    browserContainer.style.backgroundColor = '#222';
    browserContainer.style.padding = '10px';
    browserContainer.style.maxHeight = '80%';
    browserContainer.style.overflowY = 'auto';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginBottom = '10px';
    closeBtn.addEventListener('click', () => {
        closeFileBrowser();
    });
    browserContainer.appendChild(closeBtn);
    const treeEl = createFileTree(sampleTree, (filePath) => {
        onSelect(filePath);
        closeFileBrowser();
    });
    browserContainer.appendChild(treeEl);
    modal.appendChild(browserContainer);
    document.body.appendChild(modal);
}

function closeFileBrowser() {
    if (modal) {
        document.body.removeChild(modal);
        modal = null;
    }
}
