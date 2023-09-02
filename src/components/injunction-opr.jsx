import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import barConfig from "../config/bar";
import merge from "lodash/merge";

function getNrDaysKey(days) {
  if (typeof days !== 'number') return false;
  if (days <= 7) return '<=7';
  if (days <= 14) return '7-14';
  if (days <= 21) return '14-21';
  if (days <= 28) return '21-28';
  if (days <= 35) return '28-35';
  if (days <= 42) return '35-42';
  if (days <= 49) return '42-49';
  return '>50';
}

function getInjunctionDaysKey(days) {
  if (typeof days !== 'number') return false;
  if (days <= 14) return '<=14';
  if (days <= 21) return '14-21';
  if (days <= 28) return '21-28';
  if (days <= 35) return '28-35';
  if (days <= 42) return '35-42';
  if (days <= 49) return '42-49';
  if (days <= 56) return '49-56';
  if (days <= 63) return '56-63';
  if (days <= 70) return '63-70';
  if (days <= 77) return '70-77';
  if (days <= 84) return '77-84';
  return '>84';
}

export default function InjunctionToOpr(props) {
  const { data } = props;
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);
  const [nrBarData, setNrBarData] = useState([]);
  const [injunctionBarData, setInjunctionBarData] = useState([]);

  useEffect(() => {
    const nrCountMap = new Map();
    const injunctionCountMap = new Map();

    data.forEach((item) => {
      const { nrToOprDays, firstInjunctionToOprDays } = item;

      const nrToOprDaysKey = getNrDaysKey(nrToOprDays);
      if (nrToOprDaysKey) {
        nrCountMap.set(nrToOprDaysKey, (nrCountMap.get(nrToOprDaysKey) || 0) + 1);
      }

      const firstInjunctionToOprDaysKey = getInjunctionDaysKey(firstInjunctionToOprDays);
      if (firstInjunctionToOprDaysKey) {
        injunctionCountMap.set(firstInjunctionToOprDaysKey, (injunctionCountMap.get(firstInjunctionToOprDaysKey) || 0) + 1);
      }
    });
    const list = [];
    const list2 = [];

    nrCountMap.forEach((value, key) => {
      list.push({ days: key, nrToOprDays: value });
    });
    injunctionCountMap.forEach((value, key) => {
      list2.push({ days: key, firstInjunctionToOprDays: value });
    });
    list.sort((a, b) => {
      return a.days.match(/\d+$/g)[0] - b.days.match(/\d+$/g)[0]
    });
    list2.sort((a, b) => {
      return a.days.match(/\d+$/g)[0] - b.days.match(/\d+$/g)[0]
    });
    setNrBarData([...list]);
    setInjunctionBarData([...list2]);
  }, [data]);

  useEffect(() => {
    const chart = new Chart(
      canvasRef.current,
      merge({}, barConfig, {
        data: {
          labels: nrBarData.map((row) => row.days),
          datasets: [
            {
              label: "NR - OPR",
              data: nrBarData.map((row) => row.nrToOprDays),
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "NR 与 OPR 的天数统计",
            },
          },
        },
      })
    );

    const chart2 = new Chart(
      canvasRef2.current,
      merge({}, barConfig, {
        data: {
          labels: injunctionBarData.map((row) => row.days),
          datasets: [
            {
              label: "强制令 - OPR",
              data: injunctionBarData.map((row) => row.firstInjunctionToOprDays),
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "强制令与 OPR 的天数统计",
            },
          },
        },
      })
    );
    return () => {
      chart.destroy();
      chart2.destroy();
    };
  }, [nrBarData, injunctionBarData]);

  return (
    <>
      <canvas ref={canvasRef2} id="InjunctionToOpr"></canvas>
      <canvas ref={canvasRef} id="nrToOpr"></canvas>
    </>
  );
}
