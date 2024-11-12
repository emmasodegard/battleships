function create2DArrayWithFill(rows, columns, fillValue = 0) {
    let arr = [];
    for (let row = 0; row < rows; row++) {
        let rowData = [];
        for (let column = 0; column < columns; column++) {
            rowData.push(fillValue);
        }
        arr.push(rowData);
    }
    return arr;
}
export { create2DArrayWithFill };
