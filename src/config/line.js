export default {
  type: "line",
  options: {
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  },
}
