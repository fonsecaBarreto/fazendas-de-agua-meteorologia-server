import getApp from './config/app'
import getKeys from './config/keys'


async function main() {
     const keys = getKeys()
     const app = await getApp(keys);

     app.listen(keys.PORT, () =>{
          console.log("Server is running on PORT:", keys.PORT)
     })

     app.get("/teste", (req, res) =>{
        
          console.log("....................")
          console.log(" Server is running")
          console.log("  - PORT:", keys.port)
          console.log("  - ENV.:", keys.node_env)
          console.log("....................\n")

     })
}

main();

