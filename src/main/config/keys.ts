import { config } from "dotenv";

export default (): Record<string, any> =>{
     config();
     return {
          PORT: process.env.PORT || 9000,
          NODE_ENV: process.env.NODE_ENV || "development",
     }
}