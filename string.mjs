// string.mjs

/**
 * Appends a character to the end of a string a specified number of times.
 * @param {string} source - The original string.
 * @param {number} count - Number of times to append the character.
 * @param {string} char - The character to append.
 * @returns {string} - The resulting string.
 */
function appendToEnd(source, count, char) {
    let output = source;
    for (let i = 0; i < count; i++) {
        output += char;
    }
    return output;
}

String.prototype.appendToEnd = function (count, char) {
    return appendToEnd(this, count, char);
};

export default appendToEnd;
