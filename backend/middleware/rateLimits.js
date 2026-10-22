const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const tooMany = message => ({ message });

// Failed logins from one address. Successful logins don't count.
const signinPerIp = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: tooMany("Too many failed logins. Try again in 15 minutes.")
});

// Failed logins for one username from one address. Keyed on both so a
// stranger can't lock someone out by failing logins for their username
const signinPerUsername = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: req => "user:" + ipKeyGenerator(req.ip) + ":" + String((req.body && req.body.username) || "").toLowerCase(),
  message: tooMany("Too many failed logins for this account. Try again in 15 minutes.")
});

const signupPerIp = rateLimit({
  windowMs: ONE_HOUR,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: tooMany("Too many sign-ups from this address. Try again later.")
});

module.exports = {
  signin: [signinPerIp, signinPerUsername],
  signup: [signupPerIp]
};
