import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Chart from "chart.js/auto";
import lineConfig from "../config/line";
import merge from "lodash/merge";

export default function SecurityDate(props) {
  const { data } = props;
  const canvasRef = useRef(null);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const countMap = new Map();

    data.forEach((item) => {
      const { securityDate } = item;
      if (securityDate) {
        const year = dayjs(securityDate).year();
        const month = dayjs(securityDate).month() + 1;

        if (isNaN(year) || isNaN(month)) {
          return console.log("isNaN Data:", securityDate);
        }

        countMap.set(
          `${year}-${month}`,
          (countMap.get(`${year}-${month}`) || 0) + 1
        );
      }
    });
    const list = [];
    countMap.forEach((value, key) => {
      list.push({ yearMonth: key, count: value });
    });
    list.sort((a, b) => dayjs(a.yearMonth).unix() - dayjs(b.yearMonth).unix());
    setLineData([...list]);
  }, [data]);

  useEffect(() => {
    const chart = new Chart(
      canvasRef.current,
      merge(lineConfig, {
        data: {
          labels: lineData.map((row) => row.yearMonth),
          datasets: [
            {
              label: "安调人数",
              data: lineData.map((row) => row.count),
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "安调月份统计",
            },
          },
        },
      })
    );
    return () => {
      chart.destroy();
    };
  }, [lineData]);

  return <canvas ref={canvasRef} id="SecurityDate"></canvas>;
}
