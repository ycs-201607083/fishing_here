import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
/*차트 요소 등록 코드*/
ChartJS.register(ArcElement, Tooltip, Legend);

export function Dchart(props) {
  /*차트 데이터*/
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return null;
}
