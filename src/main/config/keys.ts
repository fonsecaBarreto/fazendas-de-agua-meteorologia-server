import { config } from "dotenv";

export interface ENV_VARIABLES {
     PORT: string,
     NODE_ENV: string
     JWT_SECRET: string,
}

export default (): ENV_VARIABLES =>{
     config();
     return {
          PORT: process.env.PORT || '9000',
          NODE_ENV: process.env.NODE_ENV || "development",
          JWT_SECRET: process.env.JWT_SECRET || 'TEST_123'
     }
}