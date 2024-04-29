import { withTranslation } from "react-i18next"
import "./index.css";

const Loading = () => {
    return <>
        <div className="loader-wrapper"><div className="loader"></div></div>
    </>
}

export default withTranslation()(Loading);