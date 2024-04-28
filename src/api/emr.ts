import { fetchPost } from "../config/request";

export const getSessionInfoAPI = (session_id: number) => fetchPost("auth/GetSessionInfo", {
    session_id
})


export const saveRescuePropertyAPI = (rescue_id: number, rescue_property: any) => fetchPost("rescue/SaveRescueProperty", {
    rescue_id,
    rescue_property
})
