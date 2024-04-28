
import Item from './Item';

const ControlCustom = (props: any) => {

    const {
        popupRef,
        actRef,
        appearanceConfig,
        orginalDefaultData,
        defaultValue,
        initVar,
        sectionName,
        sectionIndex,
        sectionRealId,
        sheetId,
        emrId,
        visitId,
        linkData,
        babyId,
        colIndex,
        moduleFields,
        onEntry,
        onChange,
    } = props;


    // default value
    const _values = typeof defaultValue !== 'undefined' ? defaultValue.filter((item: any) => item.sectionIndex == sectionRealId)[0]?.fields[0] : undefined;
    
   
    return (
        <>


            {moduleFields && moduleFields?.map((perField: any, fieldIndex: number) => {


                return (
                    <div key={sectionIndex}>
                        <Item
                            popupRef={popupRef}
                            actRef={actRef}
                            onEntry={onEntry}
                            appearanceConfig={appearanceConfig}
                            orginalDefaultData={orginalDefaultData}
                            defaultValue={_values}
                            initVar={initVar}
                            sectionIndex={sectionIndex}
                            sectionRealId={sectionRealId}
                            sheetId={sheetId}
                            emrId={emrId}
                            visitId={visitId}
                            linkData={linkData}
                            babyId={babyId}
                            index={colIndex}
                            args={perField.args}
                            onChange={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {
                                onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs);
                            }}
                        />

                    </div>
                )

            })}


        </>
    );

}


export default ControlCustom;


