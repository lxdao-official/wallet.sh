import fs from "fs";
type DataKey = "connected_dapp";
const data: Record<any, any> = {
  // address_count: 1,
};
let init = false;
export function setMemoryData(key: DataKey, value: any) {
  data[key] = value;
}

export function getMemoryData(key: DataKey) {
  return data[key];
}
