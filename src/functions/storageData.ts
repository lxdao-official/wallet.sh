import fs from "fs";
type DataKey = "address_count" | "address_active" | "chain_id";
const data: Record<any, any> = {
  // address_count: 1,
};
let init = false;
export function setData(key: DataKey, value: any) {
  data[key] = value;
  fs.writeFileSync(".data.json", JSON.stringify(data));
}

export function getData(key: DataKey) {
  if (!init) {
    try {
      const local = fs.readFileSync(".data.json", "utf8");
      if (local) {
        Object.assign(data, JSON.parse(local));
      }
      init = true;
    } catch (e) {
      fs.writeFileSync(".data.json", JSON.stringify(data));
    }
    init = true;
  }

  return data[key];
}
