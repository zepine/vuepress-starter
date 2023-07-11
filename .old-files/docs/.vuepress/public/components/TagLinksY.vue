<template>
	<div class="tag-links">
		<router-link
			v-for="tag in $page.frontmatter.tags"
			:key="tag"
			:to="`/yanggiri/non-fiction/tags.html#${tag}`"
			class="tag"
		>
			#{{ tag }}
		</router-link>
	</div>
</template>
