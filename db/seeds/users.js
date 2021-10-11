const { hashSync } = require("bcrypt");
const { v4 } = require("uuid");

const createBasic = () =>({
  id: v4(),
  name: "Usuario Basico",
  username: "test_user",
  password: hashSync("123456",12), 
  role: 0
})

const cretaeAdmin = () =>({
  id: v4(),
  name: "admin",
  username: "admin",
  password: hashSync("123456",12), 
  role: 1
})

const createAddress = () =>({
  id: v4(),
  street:"Rua teste",
  region:"Bairro Liberdade",
  uf: "RJ",
  number:'Cassa 1',
  city: "Rio das Ostras",
  details: "Detalhe teste",
  postalCode: "00000000"
})

exports.seed = async function(knex) {

  await knex('users').del()
  await knex('users').insert( [ createBasic(), cretaeAdmin() ]);

  await knex('addresses').del()
  await knex('addresses').insert( [ createAddress() ]);
   
};


