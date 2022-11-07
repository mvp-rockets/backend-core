const { readdirSync, statSync, readFileSync, stat } = require("fs");
const path = require("path");

module.exports = class AutoImportApis {
    includes = false;
    apiFiles = [];
    constructor(options = {}) {
        const { includes, toload = ['api.js'] } = options;
        if (includes && Array.isArray(includes)) {
            this.includes = includes;
        }
        this.toLoad = toload;
        this.scanApp().forEach(source => this.getAllApiFiles(source));
        this.apiFiles.forEach(toRequire => {
            if (readFileSync(toRequire).length === 0) {
                console.log('\x1b[33m%s\x1b[0m', `[Warning]: ${source} is empty. Please check!`);
            } else {
                console.log(`[Loading]: ${toRequire}`)
            }
            require(toRequire);
        });
    }

    checkFileToLoad(filename) {
        let toLoad = false;
        this.toLoad.forEach(item => {
            if (filename.indexOf(item) !== -1) {
                toLoad = true;
            }
        });
        return toLoad;
    }

    checkDirectoryToLoad(dirName) {
        let toLoad = false;
        if (Array.isArray(this.includes)) {
            this.includes.forEach(item => {
                if (dirName.indexOf(item) !== -1) {
                    toLoad = true;
                }
            });
        }
        return toLoad;
    }

    scanApp() {
        const rootDirectories = []
        readdirSync(path.resolve())
            .forEach((item) => {
                item = path.join(path.resolve(), item);
                const stats = statSync(item);
                if (!stats.isDirectory() && this.checkFileToLoad(item)) {
                    this.apiFiles.push(item);
                } else if (stats.isDirectory() && this.checkDirectoryToLoad(item)) {
                    rootDirectories.push(item);
                }
            });

        return rootDirectories;
    }

    getAllApiFiles(source) {
        const stats = statSync(source);
        if (!stats.isDirectory() && this.checkFileToLoad(source)) {
            this.apiFiles.push(source);
        } else if (stats.isDirectory() && this.checkDirectoryToLoad(source)) {
            readdirSync(source)
                .map(item => `${source}/${item}`)
                .forEach(item => this.getAllApiFiles(item));
        }
    }
}