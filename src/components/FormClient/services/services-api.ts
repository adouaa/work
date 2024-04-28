import { fetchPost } from '../config/request';


class ElemService {

    async getElemOptionList(id: number | string | undefined) {
        const response = await fetchPost('elem/GetElemOptionList', {
            expand_item: true,  //展开引用项目， 让代码系统：dict 和 代码：字典名，可以自动替换
            elem_id: Number(id),
            elem_version: 0 //0=current, >0:先查在线库，再查a库
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


    async getElemOptionSubList(id: number | string | undefined, code: number | string | undefined) {
        const response = await fetchPost('elem/GetElemOptionSubList', {
            elem_id: Number(id),
            option_code: code
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



//

const _ElemService = new ElemService;




export {
    _ElemService as ElemService,
};

