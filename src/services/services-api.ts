import { fetchPost } from '../config/request';



class UserService {

    async deleteUser(id: number) {
        const response = await fetchPost('user/DeleteUser', {
            user_id: Number(id)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK'
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                user_id: id
            };
        }
    }

    async getUserList(pid: number | string | undefined, dept_id: number | string | undefined, include_invalid: boolean = false) {

        if (dept_id == -1 || dept_id == null || dept_id  == 'undefined' ) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        }



        const response = await fetchPost('user/GetUserList', {
            org_id: Number(pid),
            dept_id: Number(dept_id),
            include_invalid: include_invalid
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.user_list === 'undefined' ? [] : response.user_list
            };
        }
    }


    async getUserRoleList(id: number | string | undefined) {
        const response = await fetchPost('user/GetUserRoleList', {
            user_id: Number(id)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.role_list === 'undefined' ? [] : response.role_list
            };
        }
    }


    
    /*
    UserService.retrieveUserList(12, 120062, '$QUERY_STRING', 0).then((response: any) => {
        console.log(response.data)
    });    
    */
    async retrieveUserList(org_id: number | string | undefined, dept_id: number | string | undefined, searchStr: string = '', limit: number = 0) {
        const response = await fetchPost('user/RetrieveUserList', dept_id ? {
            org_id: Number(org_id),
            dept_id: Number(dept_id),
            retrieve_input: searchStr == '' ? '*' : searchStr,
            retrieve_limit: Number(limit)
        } : {
            org_id: Number(org_id),
            retrieve_input: searchStr == '' ? '*' : searchStr,
            retrieve_limit: Number(limit)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.user_list === 'undefined' ? [] : response.user_list
            };
        }
    }
    

}

class GroupService{

    async getGroupList(org_id: number | string | undefined, include_dept: boolean = true, include_org: boolean = true) {
        const response = await fetchPost("schedule/GetGroupList", {
            org_id: org_id,
            include_dept: include_dept,
            include_org: include_org
        })
        if (response == null) {
            return {
                code: 0,
                message: "ok",
                data: []
            }
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === "undefined" ? [] : response.row_list
            }
        }
    }

    async getGroupEntityList(group_id: number | string | undefined) {
        const response = await fetchPost("schedule/GetGroupEntityList", {
            group_id: group_id
        })
        if (response == null) {
            return {
                code: 0,
                message: "ok",
                data: []
            }
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === "undefined" ? [] : response.row_list
            }
        }
    }

    // GroupWorkList
    async getGroupWorkList(group_id: number | string | undefined) {
        const response = await fetchPost("schedule/GetGroupWorkList", {
            group_id: group_id
        })
        if (response == null) {
            return {
                code: 0,
                message: "ok",
                data: []
            }
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === "undefined" ? [] : response.row_list
            }
        }
    }

    // GetGroupWorkProperty
    async getGroupWorkProperty(work_id: number | string | undefined) {
        const response = await fetchPost("schedule/GetGroupEntityList", {
            work_id: work_id
        })
        if (response == null) {
            return {
                code: 0,
                message: "ok",
                data: []
            }
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === "undefined" ? [] : response.row_list
            }
        }
    }

    // DeleteGroupWork
    async deleteGroupWork(id: number) {
        const response = await fetchPost('schedule/DeleteGroupWork', {
            work_id: Number(id)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK'
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                work_id: id
            };
        }
    }
}



class OrgService {

    async getRoomList(dept_id: number | string | undefined, include_invalid: boolean = false) {

        const response = await fetchPost('org/GetRoomList', {
            dept_id: Number(dept_id),
            include_invalid: include_invalid
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === 'undefined' ? [] : response.row_list
            };
        }
    }



    /*
    // parent_id>0以parent_id的dept_type为准；
    // parent_id==0，dept_type不能为空
    */
    async getDeptList(org_id: number | string | undefined, parent_id: number = 0, dept_type: string, include_descendant: boolean | string = true) {
        const response = await fetchPost('org/GetDeptList', {
            org_id: Number(org_id),
            parent_id: Number(parent_id),
            dept_type: dept_type,
            include_descendant: include_descendant == 'true' || include_descendant === true ? true : false
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.dept_list === 'undefined' ? [] : response.dept_list
            };
        }
    }


    async getOrgList() {
        const response = await fetchPost('org/GetOrgList');

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.org_list === 'undefined' ? [] : response.org_list
            };
        }
    }



    async getRoleList(id: number | string | undefined) {
        const response = await fetchPost('org/GetRoleList', {
            org_id: Number(id)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                data: typeof response.role_list === 'undefined' ? [] : response.role_list
            };
        }
    }


}



class SysService {

    async getDictList(searchStr: string = '', limit: number = 0, dictName: string = '') {
        const response = await fetchPost('sys/RetrieveDictData', {
            dict_name: dictName,
            retrieve_input: searchStr == '' ? '*' : searchStr,
            retrieve_limit: Number(limit)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
   
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === 'undefined' ? [] : response.row_list
            };
        }
    }
}


class ScheduleService {


    async getRegList() {
        const response = await fetchPost('schedule/clinic/GetRegList');

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
   
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === 'undefined' ? [] : response.row_list
            };
        }
    }



    async getShiftList(id: number) {
        const response = await fetchPost('schedule/GetShiftList', {
            dept_id: Number(id)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK',
                data: []
            };
        } else {
   
            return {
                code: response.code,
                message: response.message,
                data: typeof response.row_list === 'undefined' ? [] : response.row_list
            };
        }
    }


    async deleteEntityWork(id: number) {
        const response = await fetchPost('schedule/DeleteEntityWork', {
            work_id: Number(id)
        });

        if (response === null) {
            return {
                code: 0,
                message: 'OK'
            };
        } else {
            return {
                code: response.code,
                message: response.message,
                work_id: id
            };
        }
    }

}


//

const _GroupService = new GroupService;
const _UserService = new UserService;
const _SysService = new SysService;
const _OrgService = new OrgService;
const _ScheduleService = new ScheduleService;


export {
    _GroupService as GroupService,
    _UserService as UserService,
    _SysService as SysService,
    _OrgService as OrgService,
    _ScheduleService as ScheduleService,
};

