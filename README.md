# MenuApp

A small Electron desktop tool that packages an image and a music file into the exact folder structure and filenames a Skyrim "main menu replacer" mod needs, so the result can be dropped straight into a game's `Data` folder.

## What it is

Skyrim main-menu-replacer mods work by overwriting three specific files: the main menu background image, the main menu music, and the logo mesh, each at a fixed path inside the game's `Data` folder. MenuApp gives you a form instead of a file explorer: pick (or drag-and-drop) an image and a music file, pick a destination folder, give it a name, and the app builds the following structure for you and copies your files into place with the filenames Skyrim expects:

```
<destination>/<name>/Data/
├── meshes/interface/logo/logo.nif
├── music/special/mus_maintheme.<ext>
└── textures/interface/objects/mainmenuwallpaper.dds
```

If you don't supply your own image/music, it falls back to a bundled placeholder wallpaper and track (and always uses a bundled `logo.nif` for the logo mesh).

## Stack

- Electron 25 (main + renderer + preload process split)
- Node.js `fs`/`path` for directory creation and file copying
- `@electron/remote` for renderer-side native dialogs (open file/open directory)
- Electron Forge (`@electron-forge/cli`) for the dev/build/package tooling
- Plain HTML/CSS/JS on the renderer side — no frontend framework

## What it demonstrates

- Electron's main/renderer/preload architecture and IPC (`ipcMain`/`ipcRenderer`) to hand form data from the UI to filesystem code running in the main process
- Native file/directory picker dialogs and custom drag-and-drop handling (including filtering dropped files by extension)
- Scripted, idempotent directory creation and file copying with `fs`/`path`
- Small persisted app state (last-used destination folder, written to a local `settings.json`)

## Run it locally

Requires Node.js (works on Windows/macOS/Linux — Electron apps need a desktop/display environment to actually open a window).

```bash
git clone https://github.com/M-Ashrey/MenuApp.git
cd MenuApp
npm install
npm start
```

`npm install` was verified to complete cleanly against the pinned `package-lock.json` (Electron 25.0.1 + Electron Forge 6). `npm start` runs `electron-forge start`, which launches the app in dev mode with live reload.

## Features

- Name field (falls back to the image's filename, or a random "menu ####" name, if left blank)
- Drag-and-drop **or** browse-dialog selection for the image (`.dds`) and music (`.xwm`/`.wav`) files, with extension validation on drop
- Directory picker for the destination, remembered between runs via a local `settings.json`
- One "Make" button that creates the full nested folder structure and copies/renames every file to the exact path and name Skyrim's main-menu-replacer convention expects
- Bundled fallback assets (wallpaper, music, logo mesh) so the tool produces a complete output even if you don't provide your own image or music

## Status

Built in 2023 as a personal Skyrim-modding utility and a first pass at Electron desktop app development; kept public as portfolio history.
