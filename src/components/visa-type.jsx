import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Chart from "chart.js/auto";
import barConfig from "../config/bar";
import merge from "lodash/merge";

function getVisaType(visaType = "") {
  if (/work/gi.test(visaType)) return "work";
  if (/study/gi.test(visaType)) return "study";
  if (/visitor/gi.test(visaType)) return "visitor";
  return "unknown";
}

export default function VisaType(props) {
  const { data } = props;
  const canvasRef = useRef(null);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const countMap = new Map();

    data.forEach((item) => {
      const { securityDate, visaType } = item;
      if (securityDate) {
        const year = dayjs(securityDate).year();
        const month = dayjs(securityDate).month() + 1;

        if (isNaN(year) || isNaN(month)) {
          return console.log("isNaN Data:", securityDate);
        }

        const key = `${year}-${month}`;
        const visaTypeKey = getVisaType(visaType);

        const prevValue = countMap.get(key);
        countMap.set(key, {
          workCount: visaTypeKey === 'work' ? (prevValue?.workCount || 0) + 1 : (prevValue?.workCount || 0),
          studyCount: visaTypeKey === 'study' ? (prevValue?.studyCount || 0) + 1 : (prevValue?.studyCount || 0),
          visitorCount: visaTypeKey === 'visitor' ? (prevValue?.visitorCount || 0) + 1 : (prevValue?.visitorCount || 0),
          unknownCount: visaTypeKey === 'unknown' ? (prevValue?.unknownCount || 0) + 1 : (prevValue?.unknownCount || 0),
        });
      }
    });
    const list = [];
    countMap.forEach((value, key) => {
      list.push({
        yearMonth: key,
        workCount: value.workCount,
        studyCount: value.studyCount,
        visitorCount: value.visitorCount,
        unknownCount: value.unknownCount,
      });
    });
    list.sort((a, b) => dayjs(a.yearMonth).unix() - dayjs(b.yearMonth).unix());
    setBarData([...list]);
  }, [data]);

  useEffect(() => {
    const chart = new Chart(
      canvasRef.current,
      merge(barConfig, {
        data: {
          labels: barData.map((row) => row.yearMonth),
          datasets: [
            {
              label: "学签",
              data: barData.map((row) => row.studyCount),
              stack: "Stack 0",
            },
            {
              label: "工签",
              data: barData.map((row) => row.workCount),
              stack: "Stack 0",
            },
            {
              label: "旅游签",
              data: barData.map((row) => row.visitorCount),
              stack: "Stack 0",
            },
            {
              label: "未知",
              data: barData.map((row) => row.unknownCount),
              stack: "Stack 0",
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "签证类型安调统计",
            },
          },
        },
      })
    );
    return () => {
      chart.destroy();
    };
  }, [barData]);

  return <canvas ref={canvasRef} id="VisaType"></canvas>;
}
