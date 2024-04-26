import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import PageNoMatch from '../components/PageNoMatch';
import PageIndex from '../components/PageIndex';

import entityTypeData from "../data/entity-type";

import userData from '../utils/custom/get-user-data';

//
// Avoid ERROR: NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
// replace the fragment with a <div> instead. like this:  return <div><Routes>...</Routes></div>;
const routesConfig = () => {
    return <div>
        <Routes>

            <Route
                path="/"
                element={<Navigate to={`/page-index-rescue-manage/-1?link_name=麻醉&link_value=120022&visit_id=1`} />}
            />
            
            <Route path="/:system_name/:rescue_id" element={<PageIndex />} />
            <Route path="*" element={<PageNoMatch />} />

        </Routes>
    </div>;

}


export default routesConfig;
