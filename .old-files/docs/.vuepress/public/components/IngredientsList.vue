<template>
	<div class="ingredients-list" />
</template>

<script>
import { usePageFrontmatter } from "@vuepress/client";

export default {
	mounted() {
		const frontmatter = usePageFrontmatter();
		const ingredients = frontmatter.value.ingredients;
		const d = document;
		const div = d.getElementsByClassName("ingredients-list")[0];
		const ul = d.createElement("ul");

		function appendList2(list, object) {
			const ul2 = d.createElement("ul");

			for (const key in object) {
				const value = object[key];

				if (value === null) {
					const li = d.createElement("li");
					li.innerText = `${key}`;
					list.append(li);
				} else {
					const li = d.createElement("li");
					// const croppedValue = value.replace(/,.*/, '')
					li.innerText = `${key}: ${value}`;
					ul2.append(li);
				}
			}
			list.append(ul2);
		}

		for (let i = 0; i < ingredients.length; i++) {
			const object = ingredients[i];
			appendList2(ul, object);
		}
		div.append(ul);
	},
};
</script>

