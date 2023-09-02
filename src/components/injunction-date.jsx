import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Chart from "chart.js/auto";
import barConfig from "../config/bar";
import merge from "lodash/merge";

export default function InjunctionDate(props) {
  const { data } = props;
  const canvasRef = useRef(null);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const countMap = new Map();

    data.forEach((item) => {
      const { firstInjunctionDate, oprDate } = item;
      if (firstInjunctionDate) {
        const year = dayjs(firstInjunctionDate).year();
        const month = dayjs(firstInjunctionDate).month() + 1;

        if (isNaN(year) || isNaN(month)) {
          return console.log("isNaN Data:", firstInjunctionDate);
        }

        const key = `${year}-${month}`;

        const prevValue = countMap.get(key);
        countMap.set(key, {
          isOpr: oprDate ? (prevValue?.isOpr || 0) + 1 : (prevValue?.isOpr || 0),
          notOpr: oprDate ? (prevValue?.notOpr || 0) : (prevValue?.notOpr || 0) + 1,
        });
      }
    });
    const list = [];
    countMap.forEach((value, key) => {
      list.push({
        yearMonth: key,
        isOpr: value.isOpr,
        notOpr: value.notOpr,
      });
    });
    list.sort((a, b) => dayjs(a.yearMonth).unix() - dayjs(b.yearMonth).unix());
    setBarData([...list]);
  }, [data]);

  useEffect(() => {
    const chart = new Chart(
      canvasRef.current,
      merge({}, barConfig, {
        data: {
          labels: barData.map((row) => row.yearMonth),
          datasets: [
            {
              label: "强制令后等待至今下签人数",
              data: barData.map((row) => row.isOpr),
              stack: "Stack 0",
            },
            {
              label: "强制令后等待至今未下签人数",
              data: barData.map((row) => row.notOpr),
              stack: "Stack 0",
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "强制令效果与月份的关系",
            },
          },
        },
      })
    );
    return () => {
      chart.destroy();
    };
  }, [barData]);

  return <canvas ref={canvasRef} id="InjunctionDate"></canvas>;
}
