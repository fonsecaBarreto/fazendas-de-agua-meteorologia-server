"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unprocessable = exports.NotFound = exports.BadRequest = exports.Forbidden = exports.Unauthorized = exports.Download = exports.Ok = exports.ServerError = void 0;
var ServerError = function () {
    return { status: 500, body: "Erro no servidor." };
};
exports.ServerError = ServerError;
var Ok = function (body) {
    return { status: body ? 200 : 204, body: body };
};
exports.Ok = Ok;
var Download = function (stream, headers) {
    return { status: 200, stream: stream, headers: headers };
};
exports.Download = Download;
var Unauthorized = function () {
    return { status: 401, body: "Acesso Negado!" };
};
exports.Unauthorized = Unauthorized;
var Forbidden = function (error) {
    var msg = typeof error === "string" ? error : error.message;
    return { status: 403, body: msg };
};
exports.Forbidden = Forbidden;
var BadRequest = function (error) {
    var msg = typeof error === "string" ? error : error.message;
    return { status: 400, body: msg };
};
exports.BadRequest = BadRequest;
var NotFound = function (error) {
    var msg = error ? (typeof error === "string" ? error : error.message) : undefined;
    return { status: 404, body: msg };
};
exports.NotFound = NotFound;
var Unprocessable = function (params, message) {
    return { status: 400, body: {
            message: message || "Preencha todos os campos corretamente!",
            params: params
        } };
};
exports.Unprocessable = Unprocessable;
//# sourceMappingURL=http-helper.js.map