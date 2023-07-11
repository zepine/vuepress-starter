<template>
	<div class="ceate-opengraph" />
</template>

<script>
import {
	usePageData,
	usePageFrontmatter,
	useSiteLocaleData,
} from "@vuepress/client";
import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client";

export default {
	mounted() {
		// imported objects
		const page = usePageData();
		const frontmatter = usePageFrontmatter();
		const themeLocale = useThemeLocaleData();
		const siteLocale = useSiteLocaleData();

		// const
		const d = document;
		const preUrl = location.protocol + "//" + location.hostname;

		// functions
		function title() {
			if (page.value.filePathRelative.match("README")) {
				return (
					frontmatter.value.heroText ??
					page.value.title + " | " + siteLocale.value.title ??
					siteLocale.value.title
				);
			}
			return frontmatter.value.title ?? page.value.title ?? null;
		}

		function authors() {
			let gitContributors;
			for (let i = 0; i < page.value.git.contributors.length; i++) {
				if (i === 0) {
					gitContributors = page.value.git.contributors[i].name;
				} else {
					gitContributors =
						gitContributors + ", " + page.value.git.contributors[i].name;
				}
			}
			return gitContributors ?? frontmatter.value.contributors ?? "zepine";
		}

		function mainImageUrl() {
			const mainImage = frontmatter.value.mainImage;

			/// mainImage를 정의하지 않았을 때
			// heroImage 사용
			if (frontmatter.value.heroImage) {
				return preUrl + frontmatter.value.heroImage;
			}
			// logo 이미지 사용
			if (mainImage === undefined) {
				return preUrl + themeLocale.value.logo;
			}
			/// mainImage를 정의했을 때
			if (mainImage) {
				// 외부 URL 사용
				if (mainImage.includes("http")) {
					return mainImage;
					// full pathname을 교체한 URL 사용
				} else if (mainImage.includes("/")) {
					return preUrl + mainImage;
				}

				// 현 페이지의 pathname에서 끝 부분을 변경한 URL 사용
				const currentPagePath = page.value.filePathRelative;
				const source = ".md";
				const target = mainImage.includes(".")
					? "/" + mainImage
					: "/" + mainImage + ".jpg";
				const mainImagePath = currentPagePath.replace(source, target);
				return preUrl + "/" + mainImagePath;
			}
		}

		function description() {
			return (
				frontmatter.value.tagline ??
				frontmatter.value.description ??
				siteLocale.value.description
			);
		}

		const pageUrl = preUrl + page.value.path;

		const siteTitle = frontmatter.value.heroText ?? siteLocale.value.title;

		const attributes = [
			"og:title",
			"twitter:title",
			"og:type",
			"og:image",
			"og:url",
			"og:description",
			"og:article:author",
			"og:locale",
			"og:site_name",
		];

		const content = [
			title(),
			title(),
			"article",
			mainImageUrl(),
			pageUrl,
			description(),
			authors(),
			page.value.lang,
			siteTitle,
		];

		// remove previous OpenGraph tags (by class='og') from head
		const opengraphTags = d.getElementsByClassName("og");

		if (opengraphTags) {
			while (opengraphTags[0]) {
				d.head.removeChild(opengraphTags[0]);
				// console.log(opengraphTags[0])
			}
		}

		// add new OpenGraph tags to head
		for (let i = 0; i < attributes.length; i++) {
			const meta = d.createElement("meta");
			meta.setAttribute("class", "og");
			meta.setAttribute("preUrl", "og: http://ogp.me/ns#");
			meta.setAttribute("property", attributes[i]);
			meta.setAttribute("content", content[i]);
			d.head.append(meta);
		}

		// add canonical link in head
		const canonical = d.createElement("link");
		canonical.setAttribute("class", "og");
		canonical.setAttribute("rel", "canonical");
		canonical.setAttribute("href", pageUrl);
		d.head.append(canonical);
	},
};
</script>
