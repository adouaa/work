import { useEffect,  useRef} from 'react';


interface Props {
    info: {
        xAxisData: any[],
        yAxisData: any[]
    }
}

export default function LineChart({ info }: Props) {

    const chartRef = useRef<any>(null);

    useEffect(() => {

        const chartDom: any = (window as any).echarts.init(chartRef.current);
        chartDom.resize({
            width: 480,
            height: 200,
        })
        const option = {

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: info.xAxisData
            },

            grid: {
                top: '8%',
                right: '0',
                left: '2%',
                bottom: '10%',
            },

            yAxis: {
                type: 'value'
            },

            series: [
                {
                    name: '结果',
                    type: 'line',
                    data: info.yAxisData,

                }
            ]
        }

        chartDom.setOption(option)
      
    }, [info])

    return (
        <div ref={chartRef}></div>
    )
}