// filters through boolians and only keeps the ones with true.
export function cc(...classes) {
  return classes.filter((c) => typeof c == "string").join(" ");
}
