if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be set");
}

// Anyone who knows the secret can sign their own admin login, so a real
// server needs a long random one, e.g. from `openssl rand -hex 32`
if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

module.exports = {
    secret: process.env.JWT_SECRET
  };
