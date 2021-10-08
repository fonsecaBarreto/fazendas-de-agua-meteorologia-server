"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
exports.default = (function () {
    (0, dotenv_1.config)();
    return {
        PORT: process.env.PORT || 9000,
        NODE_ENV: process.env.NODE_ENV || "development",
    };
});
//# sourceMappingURL=keys.js.map