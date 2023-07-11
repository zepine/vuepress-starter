<template>
	<canvas
		id="ingredientsChart"
		aria-label="Chart of the recipe's ingredients"
		role="img"
	/>
</template>

<script>
import {
	Chart,
	// ArcElement,
	// LineElement,
	BarElement,
	// PointElement,
	BarController,
	// BubbleController,
	// DoughnutController,
	// LineController,
	// PieController,
	// PolarAreaController,
	// RadarController,
	// ScatterController,
	CategoryScale,
	LinearScale,
	// LogarithmicScale,
	// RadialLinearScale,
	// TimeScale,
	// TimeSeriesScale,
	// Decimation,
	// Filler,
	// Legend,
	// Title,
	Tooltip,
	// SubTitle,
} from "chart.js";

Chart.register(
	// ArcElement,
	// LineElement,
	BarElement,
	// PointElement,
	BarController,
	// BubbleController,
	// DoughnutController,
	// LineController,
	// PieController,
	// PolarAreaController,
	// RadarController,
	// ScatterController,
	CategoryScale,
	LinearScale,
	// LogarithmicScale,
	// RadialLinearScale,
	// TimeScale,
	// TimeSeriesScale,
	// Decimation,
	// Filler,
	// Legend,
	// Title,
	Tooltip
	// SubTitle
);

import { usePageFrontmatter } from "@vuepress/client";

export default {
	mounted() {
		function isMobile() {
			const toMatch = [
				/Android/i,
				/iPhone/i,
				/BlackBerry/i,
				/webOS/i,
				/iPod/i,
				// /Windows Phone/i,
				// /iPad/i,
			];
			return toMatch.some((item) => {
				return navigator.userAgent.match(item);
			});
		}

		function color(index) {
			return COLORS[index % COLORS.length];
		}
		function collectPureIngredients() {
			const keys = [];
			const values = [];
			const IngredientObj = { keys, values };
			const re = /.+\s?\((\d{1,4})g\)/;

			for (let i = 0; i < ingredients.length; i++) {
				for (const [key, value] of Object.entries(ingredients[i])) {
					if (value !== null) {
						keys.push(key);
						const extraction = value.replace(re, "$1");
						values.push(parseInt(extraction));
					}
				}
			}

			return IngredientObj;
		}

		const ingredients = usePageFrontmatter().value.ingredients;
		const IngredientObj = collectPureIngredients();
		const chartRatio = isMobile() ? 1 : 2;
		// const curRouteLocale = useRouteLocale()
		// const chartUnit = defineTitle()
		// const chartLocale = detectLocale()
		// const isDarkMode = useDarkMode()
		const COLORS = [
			"#31bff3",
			"#a484e9",
			"#f4889a",
			"#ffaf68",
			"#f6e683",
			"#79d45e",
		];
		const data = {
			labels: IngredientObj.keys,
			datasets: [
				{
					label: "",
					data: IngredientObj.values,
					backgroundColor: [
						color(1),
						color(2),
						color(3),
						color(4),
						color(5),
						color(6),
					],
					// borderColor: '#3e4c5a', // 그래프 선 라인
					// elements: {
					//   point: {
					//     radius: 8,
					//     pointStyle: 'circle'
					//   }
					// }
				},
			],
		};
		let delayed;
		const config = {
			type: "bar",
			data: data,
			options: {
				animation: {
					onComplete: () => {
						delayed = true;
					},
					delay: (context) => {
						let delay = 0;
						if (
							context.type === "data" &&
							context.mode === "default" &&
							!delayed
						) {
							delay = context.dataIndex * 200;
							// delay = context.dataIndex * 500 + context.datasetIndex * 100
						}
						return delay;
					},
				},
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: chartRatio,
				locale: "ko-KR",
				interaction: {
					intersect: false,
					axis: "x",
					mode: "nearest",
				},
				plugins: {
					legend: {
						display: false,
						// position: 'bottom',
						// labels: {
						//   font: {
						//     size: 12
						//   }
						// }
					},
					// title: {
					//   display: false,
					//   position: 'top',
					//   text: chartUnit
					// },
					// subtitle: {
					//   display: false,
					//   text: 'Chart Subtitle',
					//   color: 'gray',
					//   font: {
					//     size: 12,
					//     family: 'tahoma',
					//     weight: 'normal',
					//     style: 'normal'
					//   }
					// },
					// tooltip: {
					//   enabled: true
					// }
				},
				indexAxis: "x",
				scales: {
					x: {
						display: true,
						// title: {
						//   display: false,
						//   text: chartUnit
						// },
						grid: {
							display: false,
							// color: 'red'
							// borderColor: 'blue'
							// tickColor: 'red'
						},
						ticks: {
							// color: 'cyan'
							// includeBounds: true
						},
					},
					y: {
						// position: {
						//   x: 'center'
						// },
						display: true,
						title: {
							display: true,
							text: "중량(gram)",
							// color: '#adbac7' // y축 값 컬러
						},
						grid: {
							display: true,
							// color: gridColor(), // y축 그리드 컬러
							// borderColor: gridColor()
							// tickColor: 'red'
						},
						ticks: {
							// color: 'cyan'
							// includeBounds: true
						},
					},
				},
			},
		};
		Chart.defaults.font.size = 13; // 전체 폰트 사이즈
		// Chart.defaults.color = fontColor; // 전체 폰트 컬러
		const ctx = document.getElementById("ingredientsChart");
		const myChart = new Chart(ctx, config);
	},
};
</script>

<style>
#ingredientsChart {
	margin-top: 1rem;
}
</style>
