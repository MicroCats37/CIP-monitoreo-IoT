// components/StaticBarChart.tsx
/*
import React, { useRef, useLayoutEffect } from 'react';

import {
LineSeries,
  createChart,
  IChartApi,
  Time,
} from 'lightweight-charts';

let randomFactor = 25 + Math.random() * 25;
const samplePoint = (i: number) =>
  i *
  (0.5 +
    Math.sin(i / 10) * 0.2 +
    Math.sin(i / 20) * 0.4 +
    Math.sin(i / randomFactor) * 0.8 +
    Math.sin(i / 500) * 0.5) +
  200;

function generateLineData(numberOfPoints = 500) {
  randomFactor = 25 + Math.random() * 25;
  const res = [];
  const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
  for (let i = 0; i < numberOfPoints; ++i) {
    const time = (date.getTime() / 1000);
    const value = samplePoint(i);
    res.push({
      time,
      value,
    });

    date.setUTCDate(date.getUTCDate() + 1);
  }

  return res;
}


const data: { value: number; time: Time }[] = [
  
  { value: 10, time: 1642425322 },
  { value: 12, time: 1642511722 },
  { value: 11, time: 1642598122 },
  { value: 13, time: 1642684522 },
  { value: 14, time: 1642770922 },
  { value: 13.5, time: 1642857322 },
  { value: 14.2, time: 1642943722 },
  { value: 15, time: 1643030122 },
  { value: 14.7, time: 1643116522 },
  { value: 15.3, time: 1643202922 },
  { value: 16, time: 1643289322 },
  { value: 16.5, time: 1643375722 },
  { value: 17, time: 1643462122 },
  { value: 16.8, time: 1643548522 },
  { value: 17.2, time: 1643634922 },
   
];

const StaticBarChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        textColor: 'white',
        background: { color: 'black' },
      },
      timeScale: {
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          color: 'rgba(32, 38, 46, 0.1)',
          labelVisible: false,
        },
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },

    });

    const lineSeriesOne = chart.addSeries(LineSeries, {
      color: '#2962FF',
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const lineSeriesTwo = chart.addSeries(LineSeries, { color: 'rgb(225, 87, 90)' });

    const lineSeriesThree = chart.addSeries(LineSeries, { color: 'rgb(242, 142, 44)' });
    lineSeriesOne.setData(data);
    lineSeriesTwo.setData(generateLineData());
    lineSeriesThree.setData(generateLineData());
    chart.timeScale().fitContent();

    chartRef.current = chart;
    chart.timeScale().fitContent();
    const container = chartContainerRef.current;
    if (!container) return;
    const toolTip: HTMLDivElement = document.createElement('div');
    const toolTipWidth = 80;
    const toolTipHeight = 80;
    const toolTipMargin = 15;
    Object.assign(toolTip.style, {
      width: '96px',
      height: '80px',
      position: 'absolute',
      display: 'none',
      padding: '8px',
      boxSizing: 'border-box',
      fontSize: '12px',
      textAlign: 'left',
      zIndex: '1000',
      top: '12px',
      left: '12px',
      pointerEvents: 'none',
      border: '1px solid',
      borderRadius: '2px',
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif`,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      background: 'black',
      color: 'white',
      borderColor: 'rgba(38, 166, 154, 1)',
    });

    container.appendChild(toolTip);
    chart.subscribeCrosshairMove(param => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        toolTip.style.display = 'none';
      } else {
        // time will be in the same format that we supplied to setData.
        // thus it will be YYYY-MM-DD
        const dateStr = param.time;
        toolTip.style.display = 'block';
        const data1 = param.seriesData.get(lineSeriesOne);
        const data2 = param.seriesData.get(lineSeriesTwo);
        const data3 = param.seriesData.get(lineSeriesThree);

        const price1 = data1?.value ?? data1?.close;
        const price2 = data2?.value ?? data2?.close;
        const price3 = data3?.value ?? data3?.close;

        toolTip.innerHTML = `
  <div style="color: rgba(38, 166, 154, 1)">Serie A</div>
  <div style="font-size: 24px; margin: 4px 0px; color: white;">
    ${Math.round(100 * price1) / 100}
  </div>
  <div style="color: rgba(255, 193, 7, 1)">Serie B</div>
  <div style="font-size: 24px; margin: 4px 0px; color: white;">
    ${Math.round(100 * price2) / 100}
  </div>
  <div style="color: rgba(244, 67, 54, 1)">Serie C</div>
  <div style="font-size: 24px; margin: 4px 0px; color: white;">
    ${Math.round(100 * price3) / 100}
  </div>
  <div style="color: white;">${dateStr}</div>
`;

        const y = param.point.y;
        let left = param.point.x + toolTipMargin;
        if (left > container.clientWidth - toolTipWidth) {
          left = param.point.x - toolTipMargin - toolTipWidth;
        }

        let top = y + toolTipMargin;
        if (top > container.clientHeight - toolTipHeight) {
          top = y - toolTipHeight - toolTipMargin;
        }
        toolTip.style.left = left + 'px';
        toolTip.style.top = top + 'px';
      }
    });

    chart.timeScale().fitContent();
    // Cleanup
    return () => chart.remove();
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
      }}
    />
  );
};

export default StaticBarChart;
*/