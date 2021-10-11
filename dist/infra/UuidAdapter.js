"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidAdapter = void 0;
var uuid_1 = require("uuid");
var UuidAdapter = (function () {
    function UuidAdapter() {
    }
    UuidAdapter.prototype.gen = function () {
        return (0, uuid_1.v4)();
    };
    return UuidAdapter;
}());
exports.UuidAdapter = UuidAdapter;
//# sourceMappingURL=UuidAdapter.js.map