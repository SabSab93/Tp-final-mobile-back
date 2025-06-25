"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const header = req.headers.authorization; // "Bearer <token>"
    if (!(header === null || header === void 0 ? void 0 : header.startsWith("Bearer "))) {
        return res.status(401).json({ message: "Missing or malformed token" });
    }
    try {
        const token = header.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ≈ { id, email }
        next();
    }
    catch (e) {
        return res.status(401).json({ message: "Invalid/expired token" });
    }
};
exports.authenticate = authenticate;
