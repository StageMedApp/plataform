export function mask(value, mask = "") {
  if (!mask) return value;

  return masker(value, mask, true, tokens);
}

export function unmask(value, mask = "") {
  let remove = mask.split("");

  remove.forEach((char) => {
    value = value.replaceAll(char, "");
  });

  return value;
}
