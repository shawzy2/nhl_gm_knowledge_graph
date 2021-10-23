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
        datasets.push({
            type: 'line',
                label: season[0],
                data: season[1],
                fill: false,
                borderColor: colors[i++],
                borderWidth: 1.5,
                tension: 0.1,
                pointRadius: 0
        })
    }
    var i = 0
    for (const season of props.tradeTimelineTrades){
        datasets.push({
            type: 'scatter',
                label: season[0] + ' Trades',
                data: season[1],
                fill: false,
                borderColor: colors[i++],
                backgroundColor: 'white',
                pointRadius: 7
        })
    }

    const data = {
      labels: props.tradeTimelineLabels,
      datasets: datasets
    };
    return (
    <div>
        <Line
            data={data}
            height={props.height}
            width={400}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxis: {
                        title: {
                            display: true,
                            align: 'center',
                            text: 'Days till Trade Deadline'
                        }
                    },
                    yAxis: {
                        title: {
                            display: true,
                            align: 'center',
                            text: `Points Above ${props.name} Playoff Spot`
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'In-Season Trades by GM',
                        font: {weight: 'bold', size: 18}
                    }, 
                    legend: {
                        position: 'right'
                    }
                },
                layout: {
                    padding: 25
                }
                
            }}
        />
    </div>
    )
}

export default TradeTimeline