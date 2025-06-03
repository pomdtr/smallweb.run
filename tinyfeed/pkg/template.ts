export default /* html */`<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>{{ title }}</title>
	<meta name="application-name" content="tinyfeed">
	<meta name="application-source" content="https://github.com/TheBigRoomXXL/tinyfeed">
	<meta name="author" content="Sebastien LOVERGNE">
	<meta name="description" content="RSS and Atom feeds aggregator">
	<meta name="referrer" content="same-origin">
	<link rel="alternate" type="application/atom+xml" title="RSS Feed" href="/feed.xml" />
    <link rel="icon" href="https://fav.farm/📰" />

	<style>
		:root {
			color-scheme: dark light;
			--primary: #0AC8F5;
			--secondary: #D2F00F;
			--txt: #cfcfcf;
			--bd: #c0c0c0;
			--bg: #1D1F21;
			font-size: min(calc(.5rem + 0.75vw), 16px);
		}

		@media (prefers-color-scheme: light) {
			:root {
				--txt: #444444;
				--bd: #333333;
				--bg: white;
				--primary: #207D92;
				--secondary: #6A7A06;
			}
		}

		body {
			font-family: Calibri, 'Trebuchet MS', 'Lucida Sans', Arial, sans-serif;
			color: var(--txt);
			background: var(--bg);
			max-width: 50rem;
			width: 100%;
			margin: 0.5em auto 2em;
			line-height: 1.25em;
		}

		header>h1 {
			display: inline-block;
			padding: 0 0.5em;
			margin-bottom: 0.25em;
		}

		h2 {
			font-size: 1rem;
			display: inline;
		}

		ol {
			padding-left: 5ch;
		}

		li {
			margin-block-start: 1em;
		}

		a {
			text-decoration: none;
		}

		a:link {
			color: var(--primary)
		}

		a:visited {
			color: var(--secondary)
		}

		a:hover {
			opacity: 0.8
		}

		small {
			padding-top: 0.25rem;
			font-size: 0.95rem;
		}

		small>a:link,
		small>a:visited {
			color: var(--txt);
		}

		footer {
			padding: 2rem 1rem;
		}

		.feed-list {
			display: flex;
			flex-wrap: wrap;
			border: 0.5px solid var(--bd);
		}

		.feed-list>div {
			flex-grow: 1;
			padding: 0.5em 0.5em 0.35em 0.5em;
			text-align: center;
			vertical-align: middle;
			border: 0.5px solid var(--bd);
		}
	</style>
</head>

<body>
	<header>
		<h1>{{ title }}</h1>
		{{ description }}
	</header>
	<hr>
	<main>
		<ol>
			{{ for item of items }}
			<li>
				<a href={{ item.link }} target="_blank">
					<h2>{{ item.title }}</h2>
				</a>
				<br>
				<small>
					<time datetime="{{ item.publication }}">{{ item.publication }}</time>
					|
					<a href="https://{{ item.domain }}" target="_blank">{{ item.domain }}</a>
				</small>

			</li>
			{{ /for }}
		</ol>
	</main>
	<footer>
		<p>Last Updated On: {{ new Date().toLocaleString() }}</p>
		<p>This page aggregate the following feeds:</p>
		<div class="feed-list">
			{{ for feed of feeds }}
			<div>
				<a href="{{ feed.link }}" target="_blank">{{ feed.title }}</a>
			</div>
			{{ /for }}
		</div>
	</footer>
</body>

</html>`
