import { fetchPost } from "../config/request";

/* export const getUserList = (org_id: number, dept_id: number) => fetchPost("user/GetUserList", {
   
    org_id,
    dept_id
})
 */
export const retrieveUserListAPI = (org_id: number, retrieve_input: string) => fetchPost("user/RetrieveUserList", {
    org_id,
    retrieve_input
})


export const saveRescuePropertyAPI = (rescue_id: number, rescue_property: any) => fetchPost("rescue/SaveRescueProperty", {
    rescue_id,
    rescue_property
})
