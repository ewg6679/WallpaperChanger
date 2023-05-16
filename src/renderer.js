const { ipcRenderer } = require("electron");

const changeWallpaperButton = document.getElementById("changeWallpaperButton");
changeWallpaperButton.addEventListener("click", () => {
    ipcRenderer.send("changeWallpaper");
});
