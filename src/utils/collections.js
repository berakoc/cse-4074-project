/**
 * Converts a given array of keys and values to a map.
 * @param {Array} arr
 */
exports.arrayToMap = (arr) => {
    if (arr.length % 2) {
        throw new Error(
            'Array that is intended to convert to a map should have even length.'
        )
    }
    const map = new Map()
    for (let i = 0; i < arr.length; ++i) {
        map.set(arr[i], arr[++i])
    }
    return map
}
