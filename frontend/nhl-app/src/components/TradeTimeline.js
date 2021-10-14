import React from 'react';
import {Line} from 'react-chartjs-2'

function TradeTimeline(props) {
    const labels = [];
    for (let i = -145; i < 59; ++i) {
        labels.push(i.toString());
    }
    {/* { seasons.map(x => <DropdownItem onClick={() => setSeason(x)}>{ x }</DropdownItem>) } */}
    const colors = ['#6F263D', '#236192', '#FFB81C', '#002654', '#154734', '#B9975B', '#00539B', '#F47D30', '#C2912C', '#C52032']
    const datasets = []
    var i = 0
    for (const season of props.tradeTimelineData){
        console.log(season);
        datasets.push({
            type: 'line',
                label: season[0],
                data: season[1],
                fill: false,
                borderColor: colors[i++],
                tension: 0.1,
                pointRadius: 0
        })
    }
    console.log(datasets)

    const data = {
      labels: props.tradeTimelineLabels,
      datasets: datasets
    };
    return (
    <div>
        <Line
            data={data}
            height={400}
            width={400}
            options={{
                maintainAspectRatio: false,
                // scales: {
                //     x: {
                //         beginAtZero: false
                //     },
                //     y: {
                //         beginAtZero: false
                //     }
                // },
                layout: {
                    padding: 10
                }
                
            }}
        />
    </div>
    )
}

export default TradeTimeline