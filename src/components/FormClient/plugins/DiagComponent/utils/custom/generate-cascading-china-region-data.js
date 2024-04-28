
/**
 * Generate Cascading China Region Data
 */

// Divide by 10000 to get provincial code (first 2 digits)
function getProvinceCode(obj) {
    const ac = parseInt(obj.id);
    return Math.floor(ac / 10000);
}
// Divide by 100 to get the city-level code (first 4 digits)
function getCityCode(obj) {
    const ac = parseInt(obj.id);
    return Math.floor(ac / 100);
}

function place(id, name) {
    this.id = id;
    this.name = name;
}


place.prototype.PlaceType = function () {
    const ac = parseInt(this.id);

    if (ac % 100 != 0) {
        return "level-3";
    } else if (ac % 10000 != 0) {
        return "level-2";
    } else {
        return "level-1";
    }
}
place.prototype.ProvinceCode = function () {
    return getProvinceCode(this);
}
place.prototype.CityCode = function () {
    return getCityCode(this);
}


function generateCasCadingChinaRegionData( placesMap ) {
    const allRegionData = [];
    const provincesData = []; // State/Province
    const citiesData = [];  // City
    const districtsData = []; // District/County

    for (const key in placesMap) {
        const _place = new place(key, placesMap[key]);
        const _placeType = _place.PlaceType();


        switch (_placeType) {
            case 'level-1':
                provincesData.push(_place);
                break;

            case 'level-2':
                citiesData.push(_place);
                break;

            case 'level-3':
                districtsData.push(_place);
                break;

        }

    }

    for (let i = 0; i < provincesData.length; i++) {


        // Step 1: Update the City drop-down list according to the State/Province code
        let provinceChildren = [];
        const provinceCode = provincesData[i].ProvinceCode();
        provinceChildren = citiesData.filter(item => item.ProvinceCode() === provinceCode);


        // Step 2:  Update District/County drop-down list based on City code
        let cityChildren = [];
        for (let j = 0; j < provinceChildren.length; j++) {
            const cityCode = provinceChildren[j].CityCode();
            provinceChildren[j].id = cityCode.toString()
            cityChildren = districtsData.filter(item => item.CityCode() === cityCode);

            provinceChildren[j].children = cityChildren;

        }


        // Step 3:  Municipalities update the City and District/County drop-down list 
        //          (by default, the City-level option is filled with the provincial level)
        if (provinceChildren.length === 0) {

            const districtChildren = districtsData.filter(item => item.ProvinceCode() === provinceCode);

            provinceChildren.push({
                id: `${provincesData[i].ProvinceCode()}01`.toString(),
                name: '市辖区',
                children: districtChildren
            });
        }


        //  Step 4: Push the State/Province to the total data
        allRegionData.push({
            id: provincesData[i].ProvinceCode().toString(),
            name: provincesData[i].name,
            children: provinceChildren
        });

    }

    return allRegionData;

}

// node & browser
module.exports = {
    getProvinceCode,
    getCityCode,
    generateCasCadingChinaRegionData
}

