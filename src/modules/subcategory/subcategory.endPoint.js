import { roles } from "../../middleware/auth.js";



export  const  endPoint =  {
    createSubCategory :[roles.Admin],
    updateSubCategory:[roles.Admin],
    getSubCategories:[roles.Admin]
}