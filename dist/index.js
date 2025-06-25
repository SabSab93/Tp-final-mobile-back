"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const users_1 = require("./router/users");
const batteries_1 = require("./router/batteries");
const locations_1 = require("./router/locations");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const apiRouter = express_1.default.Router();
apiRouter.use("/auth", users_1.userRouter);
app.use("/api/batteries", batteries_1.batteryRouter);
app.use("/api/locations", locations_1.locationRouter);
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});
