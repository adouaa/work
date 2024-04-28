import { fetchPost } from "../config/request";

export const getRescueListAPI = (visit_id: number) => fetchPost("rescue/GetRescueList", {
    visit_id
})

export const getRescuePropertyAPI = (rescue_id: number) => fetchPost("rescue/GetRescueProperty", {
    rescue_id
})

export const deleteRescueAPI = (rescue_id: number) => fetchPost("rescue/DeleteRescue", {
    rescue_id
})

export const newRescueAPI = (visit_id: number, data: any, rescue_id?: number ) => fetchPost("rescue/NewRescue", {
    rescue_id,
    visit_id,
    ...data
})

export const saveRescuePropertyAPI = (rescue_id: number, rescue_property: any) => fetchPost("rescue/SaveRescueProperty", {
    rescue_id,
    rescue_property
})

export const getSelectRescueUserListAPI = (rescue_id: number) => fetchPost("rescue/GetRescueUserList", {
    rescue_id
})


export const saveRescueUserAPI = (rescue_id: number, delete_row: any, row_list?: any) => fetchPost("rescue/SaveRescueUserList", {
    rescue_id,
    delete_row,
    row_list
})

