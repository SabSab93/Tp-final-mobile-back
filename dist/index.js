"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monMiddleware = exports.prisma = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
// import { userRouter } from "./router/users";
const students_1 = require("./router/students");
const client_1 = require("@prisma/client");
const classRooms_1 = require("./router/classRooms");
const users_1 = require("./router/users");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const monMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    else {
        console.log(req.headers.authorization);
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        console.log(login, password);
        const user = yield exports.prisma.user.findMany({
            where: {
                email: login,
                mtp: password
            }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid login or password' });
        }
        else {
            next();
        }
    }
});
exports.monMiddleware = monMiddleware;
// app.use(cors()); // tout le monde à le droit de se connecter
app.use(express_1.default.json());
const apiRouter = express_1.default.Router();
apiRouter.use("/auth", users_1.userRouter);
apiRouter.use("/students", students_1.studentRouter);
apiRouter.use("/classRooms", classRooms_1.classRoomRouter);
app.use("/api", apiRouter);
app.use("/api", exports.monMiddleware, apiRouter);
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});
