/** @jsxImportSource hono/jsx */

import type { FC } from "hono/jsx";
import type { Article } from "../../blog.ts";

interface MetadataProps {
    article?: Article;
}

export const MetadataComponent: FC = (props: MetadataProps) => {
    const { article } = props;
    if (!article) return null;
    const { metadata } = article;

    return (
        <div class={"metadata"}>
            {metadata.authors &&
                (
                    <span class={"non-tag-metadata"}>
                        Authored by {metadata.authors?.join(", ")}
                    </span>
                )}
            {metadata.date &&
                (
                    <span class={"non-tag-metadata"}>
                        {metadata.date?.toDateString()}
                    </span>
                )}
            {article.timeToReadMinutes && (
                <span class={"non-tag-metadata"}>
                    {article.timeToReadMinutes} min read
                </span>
            )}
            {metadata.tags && (
                <span class={"tags"}>
                    {metadata.tags.map((tag) => (
                        <span class={"tag"}>#{tag}</span>
                    ))}
                </span>
            )}
        </div>
    );
};
