import React from "react";
import { getStrapiMediaUrl } from "@/lib/strapi";
import styles from "./RichTextRenderer.module.css";

// Рендерит инлайн-стили (bold, italic, underline, strikethrough, code) для листа text-нод
function renderLeaf(leaf, key) {
    let content = leaf.text;
    if (!content && content !== 0) return null;

    if (leaf.bold) content = <strong key={key + "-bold"}>{content}</strong>;
    if (leaf.italic) content = <em key={key + "-italic"}>{content}</em>;
    if (leaf.underline) content = <u key={key + "-u"}>{content}</u>;
    if (leaf.strikethrough) content = <s key={key + "-s"}>{content}</s>;
    if (leaf.code) content = <code key={key + "-code"} className={styles.inlineCode}>{content}</code>;
    if (leaf.type === "link") {
        return (
            <a key={key} href={leaf.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {leaf.children?.map((child, i) => renderLeaf(child, `${key}-lc-${i}`))}
            </a>
        );
    }
    return <React.Fragment key={key}>{content}</React.Fragment>;
}

// Рендерит children-массив (набор leaf-нод)
function renderChildren(children, keyPrefix = "") {
    if (!Array.isArray(children)) return null;
    return children.map((child, i) => {
        if (child.type === "link") return renderLeaf(child, `${keyPrefix}-${i}`);
        return renderLeaf(child, `${keyPrefix}-${i}`);
    });
}

// Рендерит одну ноду блока
function renderBlock(node, index) {
    const key = `block-${index}`;

    switch (node.type) {
        case "heading": {
            const Tag = `h${node.level || 2}`;
            const headingClass = styles[`h${node.level}`] || styles.h2;
            const id = node.children?.[0]?.text
                ?.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .trim();
            return (
                <Tag key={key} id={id} className={headingClass}>
                    {renderChildren(node.children, key)}
                </Tag>
            );
        }

        case "paragraph":
            // Пустой параграф — пропускаем
            if (!node.children?.some(c => c.text?.trim())) return null;
            return (
                <p key={key} className={styles.paragraph}>
                    {renderChildren(node.children, key)}
                </p>
            );

        case "image": {
            const img = node.image || {};
            const src = getStrapiMediaUrl(img.url);
            if (!src) return null;
            return (
                <figure key={key} className={styles.figure}>
                    <img
                        src={src}
                        alt={img.alternativeText || ""}
                        width={img.width}
                        height={img.height}
                        className={styles.image}
                        loading="lazy"
                    />
                    {img.caption && (
                        <figcaption className={styles.caption}>{img.caption}</figcaption>
                    )}
                </figure>
            );
        }

        case "quote":
            return (
                <blockquote key={key} className={styles.blockquote}>
                    {renderChildren(node.children, key)}
                </blockquote>
            );

        case "code":
            return (
                <pre key={key} className={styles.pre}>
                    <code className={styles.code}>
                        {renderChildren(node.children, key)}
                    </code>
                </pre>
            );

        case "list": {
            const Tag = node.format === "ordered" ? "ol" : "ul";
            return (
                <Tag key={key} className={Tag === "ol" ? styles.ol : styles.ul}>
                    {node.children?.map((item, i) => (
                        <li key={`${key}-li-${i}`} className={styles.li}>
                            {renderChildren(item.children, `${key}-li-${i}`)}
                        </li>
                    ))}
                </Tag>
            );
        }

        default:
            return null;
    }
}

export default function RichTextRenderer({ content }) {
    if (!content || !Array.isArray(content)) return null;
    return (
        <div className={styles.richText}>
            {content.map((node, i) => renderBlock(node, i))}
        </div>
    );
}
