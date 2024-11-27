---
title: Blog
aside: false
prev: false
next: false
---

# {{ $frontmatter.title }}

<script setup>
import { data } from "./posts.data.ts";

const posts = data.filter(post => !post.frontmatter.draft).sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
</script>

<ul>
    <li v-for="post of posts">
        <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong><br/>
        <span>{{ post.frontmatter.date.toString().split("T")[0] }}</span>
    </li>
</ul>

<style scoped>
ul {
    list-style-type: none;
    padding-left: 0;
    font-size: 1.125rem;
    line-height: 1.75;
}

li {
    display: flex;
    justify-content: space-between;
}

li span {
    font-family: var(--vp-font-family-mono);
    font-size: var(--vp-code-font-size);
}
</style>
