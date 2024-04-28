/**
 * ID number identification
 */
class idCard {

    verify(no) {
        if (!no || no.length !== 18) {
            return false
        }
        // 17-digit ontology code weight
        const w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // mod11，corresponding to the character value of the check code
        const v = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
        let sum = 0;
        for (let i = 0; i < 17; i++) {
            sum += no.charAt(i) * w[i]
        }
        return no.charAt(17).toUpperCase() === v[sum % 11]
    }

    info(no) {
        return {
            gender: this.getSex(no),
            birthday: this.getBirthday(no, 1),
            age: this.getAge(no)
        }
    }

    getBirthday(no, type = 0) {
        const birth = (no.length === 18) ? no.slice(6, 14) : no.slice(6, 12);
        // 18 digits: extract the 17th digit; 
        // 15 digits: extract the last digit
        const order = (no.length == 18) ? no.slice(-2, -1) : no.slice(-1);

        //yyyy-mm-dd
        const data1 = (no.length === 18) ? ([birth.slice(0, 4), birth.slice(4, 6), birth.slice(-2)]).join('-')
        : (['19' + birth.slice(0, 2), birth.slice(2, 4), birth.slice(-2)]).join('-');

        //yyyymmdd
        const data2 = data1.replace(/-/g, '');

        return type === 0 ? data1 : data2;
    }

    getSex(no) {
        let sexStr = 2;  // 2 -> unknown
        if (parseInt(no.slice(-2, -1)) % 2 == 1) {
            sexStr = 1; // 1 -> man
        } else {
            sexStr = 0; // 0 -< woman
        }
        return sexStr;
    }

    getAge(no) {
        const len = (no + "").length;
        if (len == 0) {
            return 0;
        } else {
            if (len != 15 && len != 18) {
                return 0;
            }
        }

        //In the time string, it must be "/"
        const birthDate = new Date( this.getBirthday(no, 0));
        const nowDateTime = new Date();
        let age = nowDateTime.getFullYear() - birthDate.getFullYear();
        if (
            nowDateTime.getMonth() < birthDate.getMonth() ||
            (nowDateTime.getMonth() == birthDate.getMonth() &&
                nowDateTime.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    }


}


// node & browser
export default idCard;
