import ClientApp from "./client-app";
import Clinic from "./clinic";
import Sample from "./sample";
import User from "./user";

Clinic.hasMany(Sample);
Sample.belongsTo(Clinic);

Clinic.hasMany(User);
User.belongsTo(Clinic);

export { ClientApp, Clinic, Sample, User };
