<template>
	<div>
		<span v-for="tag in Object.keys(tags)" :key="tag">
			<h2 :id="tag" tabindex="-1">
				<router-link :to="`#${tag}`" class="header-anchor" aria-hidden="true">
					#
				</router-link>
				{{ tag }}
			</h2>
			<ul>
				<li v-for="page in tags[tag]" :key="page.title">
					<router-link :to="page.path">
						{{ page.title }}
					</router-link>
				</li>
			</ul>
		</span>
	</div>
</template>

<script>
import { usePages } from "@temp/pages";

export default {
	computed: {
		tags() {
			const tags = {};
			const pages = usePages();

			function findTags() {
				for (const page of pages) {
					for (const index in page.frontmatter.tags) {
						const tag = page.frontmatter.tags[index];
						if (tag in tags) {
							tags[tag].push(page);
						} else {
							tags[tag] = [page];
						}
					}
				}
			}
			findTags();

			return tags;
		},
	},
};
</script>
