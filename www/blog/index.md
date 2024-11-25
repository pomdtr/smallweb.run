---
title: Blog
sidebar: false
aside: false
prev: false
next: false
---

<script setup>
import { data } from "./posts.data.ts";

const posts = data.filter(post => !post.frontmatter.draft).map(post => {
    const basename = post.url.split("/").pop();
    const date = basename.split("_")[0];
    return {
        date,
        ...post
    }
}).sort((a, b) => b.date.localeCompare(a.date));
</script>

<ul>
    <li v-for="post of posts">
        <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong><br/>
        <span>{{ post.date }}</span>
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
