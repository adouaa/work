import React, { useEffect, useState } from 'react'
import { fetchPost } from './config/request';
import * as echarts from 'echarts';
import LineChart from './LineChart/LineChart';
import './index.scss'

interface Props {
    visit_id: string | number,
    report_start: string,
    report_end: string,
    item_code: string
}

function ReportChart({
    visit_id,
    report_start,
    report_end,
    item_code
}: Props) {

    const [reportChartData, setReportChartData] = useState<{
        xAxisData: any[],
        yAxisData: any[]
    }>({
        xAxisData: [],
        yAxisData: []
    });

    const [reportTableData, setReportTableData] = useState<any[]>([]);

    const getItemHistory = () => {

        fetchPost('lab/report/GetItemHistory', {
            visit_id: Number(visit_id),
            report_start: report_start,
            report_end: report_end,
            item_code: item_code
        }).then((res: any) => {
            // console.log('***', res);
          
            const detail_list = [...res?.detail_list];
            const report_list = [...res?.report_list];
            const chartTmp: { report_no: string, report_time: string, item_value: string }[] = [];
            const tableTmp: { report_no: string, report_time: string, item_value: string, item_method: string }[] = [];
            detail_list.forEach((item: any) => {
                const i = report_list.findIndex((i: any) => i.report_no == item.report_no);
                if (i !== -1) {
                    chartTmp.push({
                        report_no: item.report_no,
                        report_time: report_list[i].report_time?.slice(0, 10),
                        item_value: item.item_value,
                    })

                    tableTmp.push({
                        report_no: item.report_no,
                        report_time: report_list[i].report_time?.slice(0, 10),
                        item_value: item.item_value,
                        item_method: item.item_method
                    })
                }
            })

            const xAxisGroup = chartTmp.map(i => i.report_time);
            const yAxisGroup = chartTmp.map(i => i.item_value);
            setReportChartData({
                xAxisData: xAxisGroup,
                yAxisData: yAxisGroup
            });
            setReportTableData(tableTmp);
        })
    }

    useEffect(() => {

        if (item_code !== '') getItemHistory();
        

    }, [visit_id, report_start, report_end, item_code]);

    return (
        <div className='row'>
            <div className='col-md-4 report_table-responsive'>
                <table className='table mb-0'>
                    <thead className='bg-body' style={{position: 'sticky', top: 0}}>
                        <tr>
                            <th>日期（倒序）</th>
                            <th>结果</th>
                            <th>方法</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reportTableData.length > 0 ? reportTableData.map((item: any, index: number) => {
                                return <tr
                                key={index}
                                >
                                    <td>{item.report_time}</td>
                                    <td>{item.item_value}</td>
                                    <td>{item.item_method}</td>
                                </tr>
                            }) : <tr>
                                <td className='border-0'>暂无数据</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className='col-md-8'>
                <LineChart info={reportChartData} />
            </div>

        </div>
    )
}

export default ReportChart