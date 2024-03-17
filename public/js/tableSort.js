// universal sort for products, customers, etc
// full table, index to sort by, str/num, asc/des
function tableSort(data, sortBy, sortDir = "asc") {
    console.log(data, sortBy, sortDir);
    const sortedTable = data.sort((a, b) => {
        if (sortDir === "asc") {
            return a[sortBy] > b[sortBy] ? 1 : -1;
        }
        else {
            return b[sortBy] > a[sortBy] ? 1 : -1;
        }
    });
    return sortedTable;
}

module.exports = tableSort;