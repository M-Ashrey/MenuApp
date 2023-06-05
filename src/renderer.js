const { ipcRenderer } = require('electron');
const { dialog } = require('@electron/remote');
const fs = require('fs');
const path = require('path');

const nameField = document.getElementById('nameField');
const imageField = document.getElementById('imageField');
const imageInput = document.getElementById('imageInput');
const musicField = document.getElementById('musicField');
const musicInput = document.getElementById('musicInput');
const imageBrowse = document.getElementById('browseImage');
const musicBrowse = document.getElementById('browseMusic');
const directoryField = document.getElementById('directoryField');
const form = document.getElementById('uploadForm');
const clearImageButton = document.getElementById('clearImage');
const clearMusicButton = document.getElementById('clearMusic');

let dropTarget = document.body;
dropTarget.ondragover = dropTarget.ondrop = (ev) => {
    ev.preventDefault();
    if (ev.type === 'drop') {
        const file = ev.dataTransfer.files[0];
        const ext = file.name.split('.').pop();
        if (ext === 'dds') {
            imageInput.value = file.path;
            imageField.innerText = "Image file: " + file.name;
        } else if (ext === 'xwm' || ext === 'wav') { // Modified this line
            musicInput.value = file.path;
            musicField.innerText = "Music file: " + file.name;
        } else {
            alert("Invalid file type. Please provide a .dds image or a .xwm/.wav music file.");
        }
    }
};

imageBrowse.addEventListener('click', async () => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: 'Image Files', extensions: ['dds'] }],
        properties: ['openFile']
    });
    if (!result.canceled) {
        imageInput.value = result.filePaths[0];
        imageField.innerText = "Image file: " + path.basename(result.filePaths[0]);
    }
});

musicBrowse.addEventListener('click', async () => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: 'Music Files', extensions: ['xwm', 'wav'] }], // Modified this line
        properties: ['openFile']
    });
    if (!result.canceled) {
        musicInput.value = result.filePaths[0];
        musicField.innerText = "Music file: " + path.basename(result.filePaths[0]);
    }
});

imageInput.addEventListener('change', () => {
    if (imageInput.value) {
        const fileName = path.basename(imageInput.value);
        imageField.innerText = "Image file: " + fileName;
        clearImageButton.style.display = 'inline';
    } else {
        imageField.innerText = "Drag & Drop image file here (.dds) or";
        clearImageButton.style.display = 'none';
    }
});

musicInput.addEventListener('change', () => {
    if (musicInput.value) {
        const fileName = path.basename(musicInput.value);
        musicField.innerText = "Music file: " + fileName;
        clearMusicButton.style.display = 'inline';
    } else {
        musicField.innerText = "Drag & Drop music file here (.xwm or .wav) or";
        clearMusicButton.style.display = 'none';
    }
});

clearImageButton.addEventListener('click', () => {
    imageInput.value = '';
    imageField.innerText = "Drag & Drop image file here (.dds) or";
    clearImageButton.style.display = 'none';
});

clearMusicButton.addEventListener('click', () => {
    musicInput.value = '';
    musicField.innerText = "Drag & Drop music file here (.xwm or .wav) or";
    clearMusicButton.style.display = 'none';
});

directoryField.addEventListener('click', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (!result.canceled) {
        directoryField.textContent = result.filePaths[0];
        // write the selected directory to settings.json
        fs.writeFileSync('settings.json', JSON.stringify({ directory: result.filePaths[0] }), 'utf8');
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if(directoryField.textContent === "" || directoryField.textContent === "Choose a directory") {
        alert("Please choose a directory before submitting.");
        return;
    }
   
    let data = {
        name: nameField.value || path.parse(imageInput.value).name || `menu ${Math.round(Math.random() * 10000).toString()}`,
        image: imageInput.value || path.join(__dirname, 'mainmenuwallpaper.dds'),
        music: musicInput.value || path.join(__dirname, 'untitled.wav'),
        directory: directoryField.textContent,
    };

    ipcRenderer.send('submitForm', data);
    nameField.value = '';
    imageField.innerText = 'Image: Drag & Drop or ';
    imageInput.value = '';
    musicField.innerText = 'Music: Drag & Drop or ';
    musicInput.value = '';
});

window.addEventListener('DOMContentLoaded', (event) => {
    if (fs.existsSync('settings.json')) { // Check if settings.json exists
        let directoryData = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
        if (directoryData && directoryData.directory) {
            directoryField.textContent = directoryData.directory;
        }
    }
});
