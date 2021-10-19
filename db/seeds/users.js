const { hashSync } = require("bcrypt");
const { Knex } = require("knex");
const { v4 } = require("uuid");



const createAddress = () =>({
  id: v4(),
  street:"Rua teste",
  region:"Bairro Qualquer",
  uf: "RJ",
  number:'Cassa 1',
  city: "Rio das Ostras",
  details: "Detalhe teste",
  postalCode: "00000000"
})


const createUser = (role, username) =>({
  id: v4(),
  name: "Usuario Basico",
  password: hashSync("123456",12), 
  username,
  role
})


const createStation = (address_id) =>({
  id: v4(),
  description: "Estação teste",
  longitude: 234,
  latitude: 3432,
  altitude: 234,
  address_id
})

const relateUserToAddress  = (user_id, address_id) =>({
  user_id,
  address_id
})

const testAddresses = [createAddress()]
const testUsers = [ createUser(0, 'usuario_test'), createUser(1, "admin") ]
const testStations = [ createStation(testAddresses[0].id) ]

exports.seed = async function(knex) {

  await knex('addresses').del()
  await knex('addresses').insert(testAddresses);

  await knex('users').del()
  await knex('users').insert(testUsers);

  await knex('users_addresses').del()
  await knex('users_addresses').insert(relateUserToAddress(testUsers[0].id, testAddresses[0].id))

  await knex('stations').del()
  await knex('stations').insert(testStations);
   
};


