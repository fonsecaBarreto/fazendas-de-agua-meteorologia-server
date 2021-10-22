import getApp from './config/app'
import getKeys from './config/keys'


async function main() {
     const keys = getKeys()
     const app = await getApp(keys);

     app.listen(keys.PORT, () =>{
          console.log("Server is running on PORT:", keys.PORT)
     })
}

main();

