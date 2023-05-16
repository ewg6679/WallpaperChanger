const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fetch = require("node-fetch");
const { promises: fs } = require("fs");
const wallpaper = require("win-wallpaper");

require("dotenv").config();

if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

async function changeWallpaper() {
    try {
        const apiKey = process.env.API_KEY || "YOUR_API_KEY_HERE"; // Replace with "YOUR_API_KEY_HERE";
        const tags = "photography -insect -spider -anime -game -cartoon";
        const url = `https://wallhaven.cc/api/v1/search?sorting=random&q=${tags}&resolutions=${3840}x${2160}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        const randomImage =
            data.data[Math.floor(Math.random() * data.data.length)];
        const imageResponse = await fetch(randomImage.path);
        const buffer = await imageResponse.buffer();
        await fs.writeFile("image.jpg", buffer);
        console.log(`Downloaded image from ${randomImage.path}`);
        const wallpaperPath = path.join(__dirname, "..", "image.jpg");
        await setWallpaper(wallpaperPath);
        console.log("Wallpaper set successfully");
    } catch (error) {
        console.error(error);
    }
}

async function setWallpaper(imagePath) {
    if (process.platform === "win32") {
        await wallpaper.set(imagePath);
    }
}

ipcMain.on("changeWallpaper", () => {
    changeWallpaper();
});
