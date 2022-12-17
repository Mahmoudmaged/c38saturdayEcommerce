import { roles } from "../../middleware/auth.js";

export  const endPoint  = {
    add:[roles.User , roles.Admin],
    remove:[roles.User , roles.Admin],

}