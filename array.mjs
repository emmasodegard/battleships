// array.mjs

/**
 * Creates a 2D array with the specified dimensions and fills it with the given value.
 * @param {number} dim - The dimension of the square array.
 * @param {*} fillValue - The value to fill the array with.
 * @returns {Array} - The created 2D array.
 */
function create2DArrayWithFill(dim, fillValue = null) {

    let arr = [];
    for (let row = 0; row < dim; row++) {
        let rowData = [];
        for (let column = 0; column < dim; column++) {
            rowData.push(fillValue);
        }
        arr.push(rowData);
    }

    return arr;
}

export { create2DArrayWithFill };
