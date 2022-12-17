import { roles } from "../../middleware/auth.js";



export  const  endPoint =  {
    create:[roles.Admin],
    update:[roles.Admin],
    get:[roles.Admin]

}