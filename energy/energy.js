import * as echarts from './echarts.esm.min.js';

const getRandomX = () => Math.floor(Math.random() * 19) + 1;
const getRandomY = () => Math.floor(Math.random() * 39) + 20;

const startBtn = document.querySelector('#energy-circle');

const bg = {
  silent: true,
  type: 'image',
  id: 'logo',
  right: 'center',
  bottom: '0%',
  z: 0,
  bounding: 'all',
  style: {
    image: './background.webp',
    width: 945,
    height: 800,
  },
};

function getTouchEnergyCount(clickedPoint) {
  const randomCount = Math.floor(Math.random() * 15);
  return {
    type: 'text',
    id: 'currentEnergyGet',
    z: 3,
    bounding: 'all',
    x: myChart.convertToPixel({ xAxisId: 'ex'}, clickedPoint[0]),
    y: myChart.convertToPixel({ yAxisId: 'ey'}, clickedPoint[1]),
    
    enterFrom: {
      style: {
        opacity: 0,
      }
    },
    rotation: 270,
    style: {
      text: randomCount ? `+${randomCount}g` : '空的',
      fontSize: 20,
      stroke: 'green',
      borderColor: 'red',
      lineWidth: 4,
      fill: 'white',
    },
  };
}

function generatorData() {
  const data = [];
  let x, y;
  for (let i = 0; i < 100; i++) {
    x = getRandomX();
    y = getRandomY();

    data.push([x, y]);
  }

  console.log(data);

  return data;
}

const chartDom = document.querySelector('#energy');
/** @type {import('echarts').ECharts} */
let myChart = echarts.init(chartDom);

const animationDuration = 20;
const animationDurationUpdate = 600;

/** @type {import('echarts').EChartsOption} */
const option = {
  graphic: {
    id: 'graphic',
    elements: [bg],
  },
  xAxis: {
    max: 20,
    min: 0,
    show: false,
    id: 'ex',
  },
  yAxis: {
    max: 20,
    min: 0,
    show: false,
    id: 'ey',
  },
  series: [
    {
      symbolSize([x, y]) {
        return y >= 1 ? 50 : 0;
      },
      animation: true,
      animationDuration,
      animationEasingUpdate: 'linear',
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#e2e2e2', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#8eff12', // 100% 处的颜色
          },
        ],
        global: false,
      },
      label: {
        show: true,
        formatter: () => {
          return `绿色\n能量`;
        },
        position: 'inside',
        color: 'green',
        fontSize: '13',
        fontWeight: 'bold',
      },
      data: generatorData(),
      type: 'scatter',
    },
  ],
};

let removeTimer = null;

function setAnimationFn() {
  const renderedData = myChart.getOption().series[0].data;

  myChart.setOption({
    series: [
      {
        data: renderedData.map(([x, y]) => [x, y - 1]),
        animationDurationUpdate,
        animationEasingUpdate: 'linear',
      },
    ],
  });

  setTimeout(() => {
    setAnimationFn();
  }, animationDurationUpdate);
}

startBtn.addEventListener('click', _e => {
  if (myChart) myChart.clear(),myChart.dispose(),myChart = null;
  if (!myChart) {
    myChart = echarts.init(chartDom);
    myChart.on('click', (e) => {
      clearTimeout(removeTimer);
      const { componentType, componentSubType, dataIndex } = e;
    
      if (componentType === 'series' && componentSubType === 'scatter') {
        console.log('dataIndex', dataIndex);
        const renderedData = myChart.getOption().series[0].data;
        const clickedPoint = renderedData[dataIndex];
    
        myChart.setOption({
          series: [
            {
              data: [
                ...renderedData.splice(0, dataIndex),
                [0, -1],
                ...renderedData.splice(1),
              ],
              animationDurationUpdate,
              animationEasingUpdate: 'linear',
            },
          ],
          graphic: {
            elements: [bg, getTouchEnergyCount(clickedPoint)]
          },
        });
    
        removeTimer = setTimeout(() => {
          myChart.setOption({
            graphic: {
              id: 'currentEnergyGet',
              $action: 'remove'
            }
          });
        }, 1000);
      }
    });
  }

  myChart.setOption(option);
  setTimeout(setAnimationFn);
});

console.log(myChart);
