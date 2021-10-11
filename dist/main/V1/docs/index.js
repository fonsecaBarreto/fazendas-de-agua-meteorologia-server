"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    openapi: '3.0.0',
    info: {
        title: 'Fazenda de agua',
        description: 'Descrição do projet',
        version: '1.0.0',
        contact: {
            name: 'Lucas Fonseca Barreto',
            email: 'lucasfonsecab@hotmail.com',
            url: 'https://github.com/fonsecaBarreto'
        }
    },
    externalDocs: {
        description: 'Teste',
        url: 'https://www.udemy.com/course/tdd-com-mango/?referralCode=B53CE5CA2B9AFA5A6FA1'
    },
    servers: [{
            url: '/api/v1',
            description: 'Servidor Principal'
        }],
    tags: [{
            name: 'Login',
            description: 'APIs relacionadas a login de usuarios'
        }],
    schemas: {}
};
//# sourceMappingURL=index.js.map