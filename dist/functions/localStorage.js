import fs from "fs";
const data = {
    address_count: 1,
};
let init = false;
export function setData(key, value) {
    data[key] = value;
    fs.writeFileSync(".data.json", JSON.stringify(data));
}
export function getData(key) {
    if (!init) {
        try {
            const local = fs.readFileSync(".data.json", "utf8");
            if (local) {
                Object.assign(data, JSON.parse(local));
            }
            init = true;
        }
        catch (e) {
            fs.writeFileSync(".data.json", JSON.stringify(data));
        }
        init = true;
    }
    return data[key];
}
