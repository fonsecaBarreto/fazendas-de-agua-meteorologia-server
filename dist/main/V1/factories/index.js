"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseController_1 = require("../../../presentation/Protocols/BaseController");
var SchemaValidator_1 = require("../../../libs/ApplicatonSchema/SchemaValidator");
var validator = new SchemaValidator_1.SchemaValidator;
BaseController_1.BaseController._validator = validator;
//# sourceMappingURL=index.js.map