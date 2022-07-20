import session from "express-session";
var SequelizeStore = require("connect-session-sequelize")(session.Store);

const SESSION_SECRET = process.env.SESSION_SECRET || "Thuleen123$#!";
const SESSION_MAX_AGE = process.env.SESSION_MAX_AGE
  ? parseInt(process.env.SESSION_MAX_AGE)
  : 1000 * 60 * 60 * 24 * 7; // one week
const isForProduction = process.env.NODE_ENV === "production" ? true : false;

type CreateSessionType = {
  db: any;
};

export default function createSession({ db }: CreateSessionType) {
  const sessionStore = new SequelizeStore({
    db: db,
    tableName: "sessions",
  });

  if (!isForProduction || process.env.DB_SYNC === "true")
    sessionStore.sync({ force: true });

  const sess = {
    secret: `${SESSION_SECRET}`,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    proxy: isForProduction,
    cookie: {
      secure: isForProduction,
      maxAge: SESSION_MAX_AGE,
    },
    store: sessionStore,
  };
  return session(sess);
}
