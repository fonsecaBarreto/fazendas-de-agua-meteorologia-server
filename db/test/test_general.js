const fs= require("fs");
const { hashSync } = require("bcrypt");
const { v4 } = require("uuid");
const  generateStationMeasurements = require("./test_measurements")
const createUser = (role, username, name) =>({
     id: v4(),
     password: hashSync("123456",12), 
     username,
     role,
     name
})

const createAddress = () =>({
     id: v4(),
     street: "R. Aloísio da Silva Gomes",
     region:"Granja dos Cavaleiros",
     uf: "RJ",
     number:'50',
     city: "Macaé",
     details: "Detalhe teste",
     postalCode: "27930560"
})

const createStation = (address_id) =>({
     id: v4(),
     description: "Estação A1",
     longitude: 213,
     latitude: 123,
     altitude: 123,
     address_id,
})


function createJSON(){
     const addresses = [ ...([...Array(6)].map(()=>createAddress())) ];
     const stations=  [ createStation(addresses[0].id) ];
     const admins = [ createUser(1, "admin", "Administrador Super") ];
     const users= [ createUser(0, 'user_basic', "Usuario Basico"), ...([...Array(2)].map((j,i)=>createUser(0, `user_basic_0${i}`, `Usuario Basico ${i}`)))]
     const measurements = generateStationMeasurements(stations[0].id, 30  )//30 * 3) 

     const payload = {
          addresses,
          stations,
          admins,
          users,
          measurements
     }
     fs.writeFileSync(__dirname+"/initial.json", JSON.stringify(payload))
}

createJSON()
module.exports = { createJSON }