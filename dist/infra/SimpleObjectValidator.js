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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleObjectValidator = void 0;
var makeMissingMessage = function (field, missingMessage) {
    return missingMessage || "Campo '" + field + "' \u00E9 obrigat\u00F3rio";
};
var makeInvalidMessage = function (field, invalidMessage) {
    return invalidMessage || "Campo '" + field + "' contem valor inv\u00E1lido ";
};
var SimpleObjectValidator = (function () {
    function SimpleObjectValidator() {
    }
    SimpleObjectValidator.prototype.validate = function (schema, body) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            var _this = this;
            return __generator(this, function (_a) {
                this.sanitize(schema, body);
                params = {};
                Object.keys(schema).map(function (field) {
                    var _a = schema[field], type = _a.type, optional = _a.optional, label = _a.label, missingMessage = _a.missingMessage, invalidMessage = _a.invalidMessage;
                    var value = body[field];
                    if (type === "any")
                        return;
                    if (value === null) {
                        if (optional === true)
                            return;
                        return params[field] = makeMissingMessage(label || field, missingMessage);
                    }
                    var IsTypeValid = _this.checkType(value, type);
                    if (IsTypeValid === false)
                        return params[field] = makeInvalidMessage(label || field, invalidMessage);
                });
                return [2, Object.keys(params).length == 0 ? null : params];
            });
        });
    };
    SimpleObjectValidator.prototype.sanitize = function (schema, body) {
        Object.keys(body).map(function (param) {
            if (!schema[param]) {
                delete body[param];
            }
        });
        var initialBody = __assign({}, body);
        Object.keys(schema).forEach(function (field) {
            var type = schema[field].type;
            var value = initialBody[field];
            if (value === undefined || value === "" || value == null)
                return body[field] = null;
            var final_value = value;
            switch (type) {
                case "cep":
                    final_value = (value + "").replace(/[^\d]+/g, '');
                    break;
                case "number":
                    {
                        if (!isNaN(value))
                            final_value = Number(value);
                    }
                    ;
                    break;
                case "date":
                    if (!isNaN(Date.parse(value)))
                        final_value = new Date(value);
                    break;
                case "boolean":
                    final_value = JSON.parse(value);
                    break;
            }
            return body[field] = final_value;
        });
    };
    SimpleObjectValidator.prototype.checkType = function (value, type) {
        switch (type) {
            case "uuid":
                {
                    var regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
                    if (!regexExp.test(value))
                        return false;
                }
                ;
                break;
            case "json":
                {
                    try {
                        JSON.parse(value);
                    }
                    catch (e) {
                        return false;
                    }
                }
                ;
                break;
            case "cep":
                {
                    var regex = /\b\d{8}\b/;
                    if (!regex.test(value))
                        return false;
                }
                ;
                break;
            case "date":
                if (!(value instanceof Date))
                    return false;
                break;
            case "array":
                if (Array.isArray(value) === false)
                    return false;
                break;
            default:
                if (type !== typeof value)
                    return false;
                break;
        }
        return true;
    };
    return SimpleObjectValidator;
}());
exports.SimpleObjectValidator = SimpleObjectValidator;
//# sourceMappingURL=SimpleObjectValidator.js.map