<template>
	<span id="created-time"></span>
</template>
<script>
import { usePageFrontmatter } from "@vuepress/client";

export default {
	mounted() {
		const frontmatter = usePageFrontmatter();

		// 글 게시 후 '경과한 시간'
		const currentDateMS = Date.now();
		const uploadedDate = frontmatter.value.date;
		const uploadedDateMS = Date.parse(uploadedDate);
		const elapsedTimeMS = currentDateMS - uploadedDateMS;

		// 글 게시일 포맷 변환
		const dateObj = new Date(uploadedDate);
		const year = dateObj.getFullYear();
		const month = dateObj.getMonth() + 1;
		const date = dateObj.getDate();
		const day = dateObj.getDay();

		// '경과한 시간'을 초, 분, 시간, 일, 월, 연으로 변경
		const hours = elapsedTimeMS / 1000 / 60 / 60 + 9;
		const days = Math.floor(hours / 24);
		const monthes = Math.floor(days / 30); //한 달을 30일로 계산
		const years = Math.floor(days / 365);

		// 한달 미만 일 수
		// const daysUnderMonth = days - monthes * 30;

		function getDay() {
			if (day === 0) {
				return "일요일";
			}
			if (day === 1) {
				return "월요일";
			}
			if (day === 2) {
				return "화요일";
			}
			if (day === 3) {
				return "수요일";
			}
			if (day === 4) {
				return "목요일";
			}
			if (day === 5) {
				return "금요일";
			}
			if (day === 6) {
				return "토요일";
			}
		}

		function getElapsedTime() {
			if (elapsedTimeMS < 0) {
				const elapsedTime = "<span style='color:#4abf8a'>방금 전</span>";
				return elapsedTime;
			} else if (hours < 24) {
				// 1일 미만
				const elapsedTime = "오늘";
				return elapsedTime;
			} else if (hours >= 24 && monthes < 3) {
				// 3개월 미만
				const elapsedTime = `${days}일 전`;
				return elapsedTime;
			} else if (monthes >= 3 && years === 0) {
				// 3개월 ~ 1년 미만
				const elapsedTime = `약 ${monthes}개월 전`;
				return elapsedTime;
			} else {
				// 1년 이상
				const elapsedTime = `약 ${years}년 ${monthes % 12}개월 전`;
				return elapsedTime;
			}
		}

		document.querySelector(
			"#created-time"
		).innerHTML = `${year}년 ${month}월 ${date}일 ${getDay()} <span style='font-size:0.9rem'>(${getElapsedTime()})</span>`;
	},
};
</script>
