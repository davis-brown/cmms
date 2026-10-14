if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be set");
}

module.exports = {
    secret: process.env.JWT_SECRET
  };
