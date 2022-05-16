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
     street: "Rua teste",
     region:"Bairro Qualquer",
     uf: "RJ",
     number:'Cassa 1',
     city: "Rio das Ostras",
     details: "Detalhe teste",
     postalCode: "00000000"
})

const createStation = (address_id) =>({
     id: v4(),
     description: "estação teste",
     longitude: 213,
     latitude: 123,
     altitude: 123,
     address_id,
})


function createJSON(){
     const addresses = [ createAddress(), ...([...Array(2)].map(()=>createAddress()))];
     const stations=  [ createStation(addresses[0].id) ];
     const admins = [ createUser(1, "admin", "Administrador Super") ];
     const users= [ createUser(0, 'user_basic', "Usuario Basico"), ...([...Array(2)].map((j,i)=>createUser(0, `user_basic_0${i}`, `Usuario Basico ${i}`)))]
     const measurements = generateStationMeasurements(stations[0].id, 30 * 3 )//30 * 3) 

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