"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const getToken = (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send("missing authorization header");
        return;
    }
    return token;
};
exports.getToken = getToken;
//# sourceMappingURL=index.js.map