export const hex2Text = (hex: string) => {
  try {
    return hex.startsWith("0x")
      ? decodeURIComponent(
          hex.replace(/^0x/, "").replace(/[0-9a-f]{2}/g, "%$&")
        )
      : hex;
  } catch {
    return hex;
  }
};
