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
var uuid_1 = require("uuid");
var SchemaBuilder_1 = require("../SchemaBuilder");
var SchemaValidator_1 = require("../SchemaValidator");
var makeSut = function () {
    var schema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
        s.string("name");
        s.number("age");
        s.boolean("isAdmin");
        s.date("birthday");
        s.array("some_list");
        s.json("my_object");
        s.cep("cep");
        s.uuid("user_id");
    });
    var sut = new SchemaValidator_1.SchemaValidator();
    return { sut: sut, schema: schema };
};
var makeBody = function (fields, empty) {
    if (empty === void 0) { empty = true; }
    return (__assign({ name: empty ? null : 'Nome Teste', age: empty ? null : 22, isAdmin: empty ? null : false, birthday: empty ? null : new Date('08-22-1990'), some_list: empty ? null : ['qualquer', 'outro'], my_object: empty ? null : JSON.stringify({ chave: 'valor' }), cep: empty ? null : '00000000', user_id: empty ? null : uuid_1.NIL }, fields));
};
describe("Schema builder", function () {
    describe("Sanitize", function () {
        var _a = makeSut(), sut = _a.sut, schema = _a.schema;
        test("Should Remove unpredicted params and fill empties with null", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = { name: "Nome Teste", outro: "outro_paramentro", password: "senha_falsa" };
                        return [4, sut.validate(schema, body)];
                    case 1:
                        _a.sent();
                        expect(body).toEqual(makeBody({ name: "Nome Teste" }));
                        return [2];
                }
            });
        }); });
        test("Should sanitize cep", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = { cep: "1324-5678" };
                        return [4, sut.validate(schema, body)];
                    case 1:
                        _a.sent();
                        expect(body).toEqual(makeBody({ cep: "13245678" }));
                        return [2];
                }
            });
        }); });
        test("Should transform number", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = { age: "123" };
                        return [4, sut.validate(schema, body)];
                    case 1:
                        _a.sent();
                        expect(body).toEqual(makeBody({ age: 123 }));
                        return [2];
                }
            });
        }); });
        test("Should transform date", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = { birthday: "09-21-1990" };
                        return [4, sut.validate(schema, body)];
                    case 1:
                        _a.sent();
                        expect(body).toEqual(makeBody({ birthday: new Date("09-21-1990") }));
                        return [2];
                }
            });
        }); });
        test("Should transform boolean", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = { isAdmin: "false" };
                        return [4, sut.validate(schema, body)];
                    case 1:
                        _a.sent();
                        expect(body).toEqual(makeBody({ isAdmin: false }));
                        return [2];
                }
            });
        }); });
    });
    describe("Type Validation", function () {
        var _a = makeSut(), sut = _a.sut, schema = _a.schema;
        test("should return error if required fields were not filled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = { name: "Nome Teste" };
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            "age": (0, SchemaValidator_1.makeMissingMessage)('age'),
                            "birthday": (0, SchemaValidator_1.makeMissingMessage)('birthday'),
                            "cep": (0, SchemaValidator_1.makeMissingMessage)('cep'),
                            "isAdmin": (0, SchemaValidator_1.makeMissingMessage)('isAdmin'),
                            "my_object": (0, SchemaValidator_1.makeMissingMessage)('my_object'),
                            "some_list": (0, SchemaValidator_1.makeMissingMessage)('some_list'),
                            "user_id": (0, SchemaValidator_1.makeMissingMessage)('user_id'),
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if wrong string", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { name: 123 });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            name: (0, SchemaValidator_1.makeInvalidMessage)('name')
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if wrong number", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { age: 'invalid_number' });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            age: (0, SchemaValidator_1.makeInvalidMessage)('age')
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if wrong boolean", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { isAdmin: 'wrong' });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            isAdmin: (0, SchemaValidator_1.makeInvalidMessage)('isAdmin')
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if invalid date", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { birthday: 'data_invalida' });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            birthday: (0, SchemaValidator_1.makeInvalidMessage)('birthday')
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if invalid array", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { some_list: 123 });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            some_list: (0, SchemaValidator_1.makeInvalidMessage)('some_list')
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if invalid json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { my_object: 'invalid_json' });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            my_object: (0, SchemaValidator_1.makeInvalidMessage)('my_object')
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if invalid cep", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { cep: '123456789' });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            cep: (0, SchemaValidator_1.makeInvalidMessage)('cep')
                        });
                        return [2];
                }
            });
        }); });
        test("should return error if invalid uuid", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = __assign(__assign({}, makeBody({}, false)), { user_id: 'invalid_uuid' });
                        return [4, sut.validate(schema, body)];
                    case 1:
                        errors = _a.sent();
                        expect(errors).toEqual({
                            user_id: (0, SchemaValidator_1.makeInvalidMessage)('user_id')
                        });
                        return [2];
                }
            });
        }); });
    });
});
//# sourceMappingURL=SchemaValidator.spec.js.map