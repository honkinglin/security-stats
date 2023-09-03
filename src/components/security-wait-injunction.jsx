import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Chart from "chart.js/auto";
import barConfig from "../config/bar";
import merge from "lodash/merge";

function getDaysKey(days) {
  if (typeof days !== 'number') return false;
  for (let i = 1; i <= 52; i++) {
    if (days <= i * 7) return `${(i - 1) * 7}-${i * 7}`;
  }
  return '>=365';
}

export default function SecurityWaitInjunction(props) {
  const { data } = props;
  const canvasRef = useRef(null);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const countMap = new Map();

    data.forEach((item) => {
      const { securityDate, firstInjunctionDate, oprDate } = item;
      if (!securityDate || !firstInjunctionDate) return;
      const diffDays = dayjs(firstInjunctionDate).diff(dayjs(securityDate), 'day');
      const key = getDaysKey(diffDays);
      if (!key) return;
      const prevValue = countMap.get(key);
      countMap.set(key, {
        isOpr: oprDate ? (prevValue?.isOpr || 0) + 1 : (prevValue?.isOpr || 0),
        notOpr: oprDate ? (prevValue?.notOpr || 0) : (prevValue?.notOpr || 0) + 1,
      })
    });
    const list = [];
    countMap.forEach((value, key) => {
      list.push({
        days: key,
        isOpr: value.isOpr,
        notOpr: value.notOpr,
      });
    });
    list.sort((a, b) => a.days.match(/\d+$/g)[0] - b.days.match(/\d+$/g)[0]);
    setBarData([...list]);
  }, [data]);

  useEffect(() => {
    const chart = new Chart(
      canvasRef.current,
      merge({}, barConfig, {
        data: {
          labels: barData.map((row) => row.days),
          datasets: [
            {
              label: "强制令后至今下签人数",
              data: barData.map((row) => row.isOpr),
              stack: "Stack 0",
            },
            {
              label: "强制令后至今未下签人数",
              data: barData.map((row) => row.notOpr),
              stack: "Stack 0",
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "强制令前安调等待时长与 OPR 的关系",
            },
          },
        },
      })
    );
    return () => {
      chart.destroy();
    };
  }, [barData]);

  return <canvas ref={canvasRef} id="SecurityWaitInjunction"></canvas>;
}
