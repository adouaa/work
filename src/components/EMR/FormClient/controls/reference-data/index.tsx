import React, { useEffect, useRef } from "react";
import DataIsland from './DataIsland';


const ReferenceData = (props: any) => {
    const {
        controlId,
        appearanceConfig,
        visitId,
        dyRow,
        dataCallback,
        editEnterStatus,
        closeEnterEv
    } = props;

    const referenceDataRef = useRef<any>(null);
    const editRef = useRef<HTMLDivElement>(null);
    const editMaskRef = useRef<HTMLDivElement>(null);
   
    const closeAction = () => {
        closeEnterEv(false);
    };


    function handleClose(e: React.MouseEvent) {
        e.preventDefault();
        closeAction();

        if (referenceDataRef.current) referenceDataRef.current.reset();

    }


    useEffect(() => {

        setTimeout(() => {
            if (editRef.current) {
                editRef.current.classList.add('show');
            }
        }, 1500);

    }, [controlId, editEnterStatus]);



    return (
        <>

            {/* SIDE POPUP */}
            <div className={`app-builder-editelement-mask ${editEnterStatus ? 'active show' : ''}`} ref={editMaskRef} onClick={handleClose}></div>
            <div className={`app-builder-editelement shadow ${editEnterStatus ? 'active show' : ''}`} ref={editRef} style={{ opacity: 0 }}>
                <button className={`app-builder-editelement__close ${editEnterStatus ? 'active' : ''}`} tabIndex={-1} onClick={handleClose}>
                    <svg width="35px" height="35px" viewBox="0 0 1024 1024" fill="#000000"><path d="M512 897.6c-108 0-209.6-42.4-285.6-118.4-76-76-118.4-177.6-118.4-285.6 0-108 42.4-209.6 118.4-285.6 76-76 177.6-118.4 285.6-118.4 108 0 209.6 42.4 285.6 118.4 157.6 157.6 157.6 413.6 0 571.2-76 76-177.6 118.4-285.6 118.4z m0-760c-95.2 0-184.8 36.8-252 104-67.2 67.2-104 156.8-104 252s36.8 184.8 104 252c67.2 67.2 156.8 104 252 104 95.2 0 184.8-36.8 252-104 139.2-139.2 139.2-364.8 0-504-67.2-67.2-156.8-104-252-104z" fill="" /><path d="M707.872 329.392L348.096 689.16l-31.68-31.68 359.776-359.768z" fill="" /><path d="M328 340.8l32-31.2 348 348-32 32z" fill="" /></svg>

                </button>


                <DataIsland
                    referenceDataRef={referenceDataRef}
                    editEnterStatus={editEnterStatus}  // 为 true 时才会触发接口【相当于点击弹窗展开后触发】
                    visitId={visitId}   
                    appearanceConfig={{
                        btns: appearanceConfig.btns,
                        referenceDataPanel: appearanceConfig.referenceDataPanel,
                        others: appearanceConfig.others
                    }}
                    onConfirm={(curControlId: string, val: any, rowVal: any) => {

                        dataCallback?.(controlId, val, dyRow);
                        if (referenceDataRef.current) referenceDataRef.current.reset();


                        setTimeout(() => {
                            closeAction();
                        }, 0);

                    }}
                    onConfirmTextarea1={(curControlId: string, val: any, rowVal: any) => {

                    }}
                    onConfirmTextarea2={(curControlId: string, val: any, rowVal: any) => {

                    }}
                />


            </div>
            {/* /SIDE POPUP */}




        </>
    );

}


export default ReferenceData;

