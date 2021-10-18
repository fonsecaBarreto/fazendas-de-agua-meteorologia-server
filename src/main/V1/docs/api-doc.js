{
    "openapi": "3.0.0",
    "info": {
        "version": "1",
        "title": "Fazenda de Agua Metereologia",
        "license": {
            "name": "MIT"
        }
    },
    "servers": [
        {
            "url": "localhost:9000/api/v1",
            "description": "Servidor Principal"
        }
    ],
    "paths": {
        
    },
    "components": {
        "schemas": {
            "Address": {
                "type": "object",
                "required": [ "id", "street", "region", "number", "uf", "postalCode", "city", "details"
                ],
                "properties": {

         
                    "id": {
                        "type": "string",
                        "format": "uuid"
                    },
                    "street": {
                        "type": "string",
                        "description": "Rua"
                    },
                    "region": {
                        "type": "string",
                        "description": "Bairro"
                    },
                    "number": {
                        "type": "string",
                        "description": "Numero"
                    },
                    "uf": {
                        "type": "string",
                        "description": "Estado"
                    },
                    "postalCode": {
                        "type": "string",
                        "description": "cep"
                    },
                     "city": {
                        "type": "string",
                        "description": "Rio das Ostras"
                    },
                    "details": {
                        "type": "string",
                        "description": "Detalhes"
                    }
                }
            }
        }
    }
}