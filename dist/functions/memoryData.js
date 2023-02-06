const data = {
// address_count: 1,
};
let init = false;
export function setMemoryData(key, value) {
    data[key] = value;
}
export function getMemoryData(key) {
    return data[key];
}
