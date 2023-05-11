import { setWallpaper } from "wallpaper";
import fetch from "node-fetch";
import { promises } from "fs";
import { config } from "dotenv";

config();

async function main() {
    try {
        const apiKey = process.env.API_KEY || "YOUR_API_KEY_HERE";
        const tags = "photography -insect -spider -anime -game -cartoon";
        const url = `https://wallhaven.cc/api/v1/search?sorting=random&q=${tags}&resolutions=${3840}x${2160}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        const randomImage = data.data[Math.floor(Math.random() * data.data.length)];
        const imageResponse = await fetch(randomImage.path);
        const buffer = await imageResponse.arrayBuffer();

        await promises.writeFile("image.jpg", Buffer.from(buffer));
        console.log(`Downloaded image from ${randomImage.path}`);
        await setWallpaper("image.jpg");
        console.log("Wallpaper set successfully");
    } catch (error) {
        console.error(error);
    }
}

main();
