import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import './Graph.css'
import numeral from "numeral";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  } from 'chart.js';
  ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
  );

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType="cases") => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function Map({casesType="deaths"}) {
  const [data,setdata] = useState({});

  const fetchData = async () => {
    await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let chartData = buildChartData(data,casesType);
        setdata(chartData);
        console.log(chartData);
      });
  };

  useEffect(()=>{
    fetchData();
  },[casesType])

 
  return (
    <div className='graph'>
       {data?.length > 0 && (
      <Line
        data={{
          datasets: [
            {
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
              data: data,
            },
          ],
        }}
        options={options}
      />
      )}
    </div>
  )
}

export default Map
