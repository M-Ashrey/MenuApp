const { ipcRenderer } = require('electron');
const { dialog } = require('@electron/remote');
const fs = require('fs');
const path = require('path');

const nameField = document.getElementById('nameField');
const imageField = document.getElementById('imageField');
const musicField = document.getElementById('musicField');
const directoryField = document.getElementById('directoryField');
const form = document.getElementById('uploadForm');

document.body.ondragover = document.body.ondrop = (ev) => {
    ev.preventDefault();
    document.body.classList.add("drag-over");
    if (ev.type === 'drop') {
        document.body.classList.remove("drag-over");
        const files = ev.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const ext = file.name.split('.').pop();
            if (ext === 'dds') {
                imageInput.value = file.path;
                imageField.innerText = "Image file: " + file.name;
            } else if (ext === 'xwm') {
                musicInput.value = file.path;
                musicField.innerText = "Music file: " + file.name;
            } else {
                alert("Invalid file type: " + ext);
            }
        }
    }
};

document.body.ondragleave = (ev) => {
    ev.preventDefault();
    document.body.classList.remove("drag-over");
}

directoryField.addEventListener('click', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (!result.canceled) {
        directoryField.textContent = result.filePaths[0];
        
        const settings = {
            directory: result.filePaths[0]
        };
        
        fs.writeFileSync(path.join(__dirname, 'settings.json'), JSON.stringify(settings));
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let name = nameField.value.trim();
    if (!name && imageInput.value) {
        name = path.basename(imageInput.value, path.extname(imageInput.value));
    }

    let data = {
        name: name,
        image: imageInput.value,
        music: musicInput.value,
        directory: directoryField.textContent,
    };
    
    ipcRenderer.send('submitForm', data);
    nameField.value = '';
    imageField.innerText = 'Drag & Drop image file here (.dds)';
    imageInput.value = '';
    musicField.innerText = 'Drag & Drop music file here (.xwm)';
    musicInput.value = '';
});

window.onload = function() {
    try {
        const settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf-8'));
        if (settings.directory) {
            directoryField.textContent = settings.directory;
        }
    } catch (error) {
        console.log('Failed to read settings:', error);
    }
}
