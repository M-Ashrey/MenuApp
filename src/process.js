// process.js

const fs = require('fs');
const path = require('path');

module.exports.processData = (data) => {
    console.log("received");
    console.log(data);
    process(data);
};

function process(data) {
    const baseDir = data.directory;
    const nameDir = path.join(baseDir, data.name);
    const dataDir = path.join(nameDir, 'Data');
    const meshesDir = path.join(dataDir, 'meshes', 'interface', 'logo');
    const musicDir = path.join(dataDir, 'music', 'special');
    const texturesDir = path.join(dataDir, 'textures', 'interface', 'objects');

    createDirectory(meshesDir);
    createDirectory(musicDir);
    createDirectory(texturesDir);

    // Copy and rename files
    let musicExtension = path.extname(data.music); // Get the extension of the original music file
    fs.copyFileSync(data.image, path.join(texturesDir, 'mainmenuwallpaper.dds'));
    fs.copyFileSync(data.music, path.join(musicDir, 'mus_maintheme' + musicExtension)); // Use the original extension
    fs.copyFileSync(path.join(__dirname, 'logo.nif'), path.join(meshesDir, 'logo.nif'));

    console.log('Directories created and files copied');
}

function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
