<template>
	<div id="disqus_thread"></div>
</template>

<script lang="ts">
import { usePageData } from "@vuepress/client";

export default {
	mounted() {
		const d = document;
		const page = usePageData();

		// Discus 댓글 허용
		const useDiscus = [
			/html/i, //html 문서
			/\/$/i, //README 문서 (소개)
			// /yanggiri/i,
			// /gardening\/2022/i,
			// /running\/2022/i,
			// /talking/i,
		];
		// Discus 댓글 불허
		const notUseDiscus = [
			// /\/$/i,
			/tags.html/i,
			// /^.+\/.+\/$/i
		];

		function isMatch(pathes) {
			const toMatch = pathes;
			const currentPagePath = page.value.path;

			return toMatch.some((path) => {
				return currentPagePath.match(path);
			});
		}

		/// Disqus 사용 조건 확인
		if (isMatch(useDiscus) && !isMatch(notUseDiscus)) {
			try {
				//Disqus 실행
				const disqus_config = function () {
					this.page.url = location.origin; // Replace PAGE_URL with your page's canonical URL variable
					this.page.identifier = location.pathname; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
				};

				// Disqus 스크립트 파일 추가 (in head or body)
				(function () {
					// DON'T EDIT BELOW THIS LINE+
					// const d = document;
					const s = d.createElement("script");
					s.src = "https:///yanggiri.disqus.com/embed.js";
					s.setAttribute("data-timestamp", +new Date());
					(d.head || d.body).appendChild(s);
				})();

				// Disqus theme 바꾸기
				// document.addEventListener("themeChanged", function (e) {
				// 	if (d.readyState == "complete") {
				// 		DISQUS.reset({ reload: true, config: disqus_config });
				// 		// https://help.disqus.com/en/articles/1717163-using-disqus-on-ajax-sites
				// 	}
				// });
			} catch (e) {
				console.log("[Error] Occurs an error when mounting Disqus's component");
			}
		}

		/// Giscus 사용 조건에 부합하는지 확인
	},
};
</script>

