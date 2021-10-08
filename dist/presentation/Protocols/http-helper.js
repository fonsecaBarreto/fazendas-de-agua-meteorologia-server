"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = exports.Forbidden = exports.Unauthorized = exports.Download = exports.Ok = exports.ServerError = void 0;
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
    return { status: 403, body: error };
};
exports.Forbidden = Forbidden;
var BadRequest = function (error) {
    return { status: 400, body: error };
};
exports.BadRequest = BadRequest;
//# sourceMappingURL=http-helper.js.map