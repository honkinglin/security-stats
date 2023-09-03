import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import barConfig from "../config/bar";
import { CHART_COLORS } from "../config/color";
import merge from "lodash/merge";

function getMapKey(isInjunctionSuccess = "") {
  if (!isInjunctionSuccess) return "无强制令";
  if (/是/gi.test(isInjunctionSuccess)) return "强制令成功";
  if (/否/gi.test(isInjunctionSuccess)) return "强制令失败";
  if (/等待中/gi.test(isInjunctionSuccess)) return "强制令等待中";
  return "未知";
}

export default function VisaType(props) {
  const { data } = props;
  const canvasRef = useRef(null);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const countMap = new Map();
    data.forEach((item) => {
      const { isInjunctionSuccess, oprDate } = item;
      const key = getMapKey(isInjunctionSuccess);

      const prevValue = countMap.get(key);
      countMap.set(key, {
        isOpr: oprDate ? (prevValue?.isOpr || 0) + 1 : (prevValue?.isOpr || 0),
        notOpr: oprDate ? (prevValue?.notOpr || 0) : (prevValue?.notOpr || 0) + 1,
      });
    });
    const list = [];
    countMap.forEach((value, key) => {
      list.push({ key, isOpr: value.isOpr, notOpr: value.notOpr });
    })
    console.log('1', list);
    setBarData([...list]);
  }, [data]);

  useEffect(() => {
    const chart = new Chart(
      canvasRef.current,
      merge({}, barConfig, {
        data: {
          labels: barData.map((row) => row.key),
          datasets: [
            {
              label: "下签",
              data: barData.map((row) => row.isOpr),
              stack: "Stack 0",
            },
            {
              label: "未下签",
              data: barData.map((row) => row.notOpr),
              stack: "Stack 0",
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "申请强制令与 OPR 的关系",
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
