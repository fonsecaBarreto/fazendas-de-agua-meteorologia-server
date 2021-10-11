"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var index_1 = __importDefault(require("./index"));
exports.default = (function (router) {
    router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(index_1.default));
});
//# sourceMappingURL=__init__.js.map