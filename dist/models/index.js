"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Sample = exports.Clinic = exports.ClientApp = void 0;
const client_app_1 = __importDefault(require("./client-app"));
exports.ClientApp = client_app_1.default;
const clinic_1 = __importDefault(require("./clinic"));
exports.Clinic = clinic_1.default;
const sample_1 = __importDefault(require("./sample"));
exports.Sample = sample_1.default;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
clinic_1.default.hasMany(sample_1.default);
sample_1.default.belongsTo(clinic_1.default);
clinic_1.default.hasMany(user_1.default);
user_1.default.belongsTo(clinic_1.default);
