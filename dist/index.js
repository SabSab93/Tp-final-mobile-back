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
exports.monMiddlewareBearer = exports.prisma = void 0;
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const students_1 = require("./router/students");
const client_1 = require("@prisma/client");
const classRooms_1 = require("./router/classRooms");
const users_1 = require("./router/users");
const groups_1 = require("./router/groups");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// export const monMiddleware = async (req: any, res: any, next: any) => {
//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: 'Authorization header missing' });
//   }
//   const authHeader = req.headers.authorization.split(' ');
//   if (authHeader[0] !== 'Basic' || authHeader.length !== 2) {
//     return res.status(401).json({ message: 'Invalid authorization format' });
//   }
//   const b64auth = authHeader[1];
//   const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
//   if (!login || !password) {
//     return res.status(401).json({ message: 'Invalid login or password format' });
//   }
//   const user = await prisma.user.findFirst({ where: { email: login } });
//   if (!user) {
//     return res.status(401).json({ message: 'Invalid login or password' });
//   }
//   const passwordMatch = await bcrypt.compare(password, user.mtp);
//   if (!passwordMatch) {
//     return res.status(401).json({ message: 'Invalid login or password' });
//   }
//   next();
// };
const monMiddlewareBearer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fullToken = req.headers.authorization;
        if (!fullToken) {
            res.status(401).send("No token provided");
        }
        else {
            const [typeToken, token] = fullToken.split(" ");
            if (typeToken !== "Bearer") {
                res.status(401).send("Invalid token type");
            }
            else {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (decoded) {
                    req.token = token;
                    next();
                }
                else {
                    res.status(401).send("Invalid token");
                }
            }
        }
    }
    catch (error) {
        return res.status(401).send("Invalid or expired token");
    }
});
exports.monMiddlewareBearer = monMiddlewareBearer;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const apiRouter = express_1.default.Router();
apiRouter.use("/auth", users_1.userRouter);
apiRouter.use("/students", exports.monMiddlewareBearer, students_1.studentRouter);
apiRouter.use("/classRooms", exports.monMiddlewareBearer, classRooms_1.classRoomRouter);
apiRouter.use("/groups", exports.monMiddlewareBearer, groups_1.groupRouter);
app.use("/api", apiRouter);
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});
