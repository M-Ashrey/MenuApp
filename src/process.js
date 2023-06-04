const fs = require('fs');
const path = require('path');


function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFile(source, destination, newName) {
  if(newName) {
    destination = path.join(path.dirname(destination), newName);
  }
  fs.copyFileSync(source, destination);
}

function process(data) {
  let name = data.name.trim();
  if (!name && data.image) {
    name = path.basename(data.image, path.extname(data.image));
  }

  const baseDir = data.directory;
  const nameDir = path.join(baseDir, data.name);
  const dataDir = path.join(nameDir, 'Data');
  const meshesDir = path.join(dataDir, 'meshes');
  const musicDir = path.join(dataDir, 'music', 'special');
  const texturesDir = path.join(dataDir, 'textures', 'interface', 'objects');

  [nameDir, dataDir, meshesDir, musicDir, texturesDir].forEach(createDir);

  copyFile(data.image, path.join(texturesDir, path.basename(data.image)), 'mainmenuwallpaper.dds');
  copyFile(data.music, path.join(musicDir, path.basename(data.music)), 'mus_maintheme.xwm');

  const logoDir = path.join(meshesDir, 'interface', 'logo');
  createDir(logoDir);
  const logoSource = path.join(__dirname, 'logo.nif');
  const logoDestination = path.join(logoDir, 'logo.nif');
  copyFile(logoSource, logoDestination);

  console.log('Directories created and files copied');
}

module.exports.processData = (data) => {
  console.log("Received:");
  console.log(data);
  process(data);
};
