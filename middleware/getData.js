function getData(dataPath, sortBy, sortDir) {
    const fs = require("fs");
    const path = require("path");

    const tableSort = require("../public/js/tableSort")

    const file = fs.readFileSync(
        path.resolve(__dirname, dataPath)
    );

    return tableSort(JSON.parse(file), sortBy, sortDir)
}

module.exports = getData;