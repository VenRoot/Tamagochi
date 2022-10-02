import chokidar from "chokidar";
import fs from "fs";

process.chdir(__dirname);

const watcher = chokidar.watch("./Web/src", {ignored: /^\./, persistent: true});

watcher.on("change", path => {
    //Check if the file is a .html file
    if (path.match(/.*\.html$/)) {
        console.log(`HTML file ${path} changed`);

        //Copy the file to the dist folder
        fs.copyFileSync(path, path.replace("Web/src", "Web/bin"));
    }
})