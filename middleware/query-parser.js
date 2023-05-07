const parse = (target, options) => {
  switch (typeof target) {
    case "string":
      if (target === "") {
        return "";
      } else if (options.parseNull && target === "null") {
        return null;
      } else if (options.parseUndefined && target === "undefined") {
        return undefined;
      } else if (
        options.parseBoolean &&
        (target === "true" || target === "false")
      ) {
        return target === "true";
      } else if (options.parseNumber && !isNaN(Number(target))) {
        return Number(target);
      } else {
        return target;
      }
    case "object":
      if (Array.isArray(target)) {
        return target.map((x) => parse(x, options));
      } else {
        const obj = target;
        Object.keys(obj).map((key) => (obj[key] = parse(target[key], options)));
        return obj;
      }
    default:
      return target;
  }
};

const queryParser = (options) => (req, res, next) => {
  req.query = parse(req.query, options);
  next();
};

module.exports = queryParser;
