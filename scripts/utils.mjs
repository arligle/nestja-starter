export function parseBoolean(value) {
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    return value;
  }
  return value;
}

export function parseArgs(args) {
  const parsedArgs = {};
  for (const key in args) {
    parsedArgs[key] = parseBoolean(args[key]);
  }
  return parsedArgs;
}
