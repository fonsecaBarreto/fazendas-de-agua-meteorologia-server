"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaBuilder = void 0;
__exportStar(require("./protocols/AppSchemaTools"), exports);
var SchemaBuilder = (function () {
    function SchemaBuilder() {
        this.properties = {};
        this.required = [];
    }
    SchemaBuilder.prototype.setProperty = function (key, type) {
        var _this = this;
        var _a, _b;
        if (!this.properties[key]) {
            this.properties[key] = { type: type };
            this.required.push(key);
            return this.setProperty(key, type);
        }
        var optional = function () {
            _this.required.splice(_this.required.indexOf(key), 1);
            return _this.setProperty(key);
        };
        var description = function (value) {
            _this.properties[key] = __assign(__assign({}, _this.properties[key]), { description: value });
            return _this.setProperty(key);
        };
        var actions = { optional: optional, description: description };
        if (!this.required.includes(key))
            delete actions.optional;
        if ((_b = (_a = this.properties) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b.description)
            delete actions.description;
        return actions;
    };
    SchemaBuilder.prototype.number = function (key) {
        return this.setProperty(key, 'number');
    };
    SchemaBuilder.prototype.boolean = function (key) {
        return this.setProperty(key, 'boolean');
    };
    SchemaBuilder.prototype.date = function (key) {
        return this.setProperty(key, 'date');
    };
    SchemaBuilder.prototype.array = function (key) {
        return this.setProperty(key, 'array');
    };
    SchemaBuilder.prototype.json = function (key) {
        return this.setProperty(key, 'json');
    };
    SchemaBuilder.prototype.cep = function (key) {
        return this.setProperty(key, 'cep');
    };
    SchemaBuilder.prototype.uuid = function (key) {
        return this.setProperty(key, 'uuid');
    };
    SchemaBuilder.prototype.string = function (key) {
        return this.setProperty(key, 'string');
    };
    SchemaBuilder.prototype.getSchema = function () {
        return ({
            type: 'object',
            properties: this.properties,
            required: this.required
        });
    };
    SchemaBuilder.create = function (callback) {
        var instace = new SchemaBuilder();
        callback(instace);
        return instace.getSchema();
    };
    return SchemaBuilder;
}());
exports.SchemaBuilder = SchemaBuilder;
//# sourceMappingURL=SchemaBuilder.js.map