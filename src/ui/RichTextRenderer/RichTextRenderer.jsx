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
            const effectiveLevel = (!node.level || node.level === 1) ? 2 : node.level;
            const Tag = `h${effectiveLevel}`;
            const headingClass = styles[`h${effectiveLevel}`] || styles.h2;
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

import InlineCTA from "@/ui/InlineCTA";
import ctaStyles from "../InlineCTA/InlineCTA.module.css";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";

// Helper to parse inline Markdown tokens (bold, italic, links) into React elements
function parseInlineMarkdown(text, styles) {
    if (!text) return "";
    
    let parts = [{ type: 'text', content: text }];
    
    // 1. Parse Links: [text](url)
    let newParts = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    for (let part of parts) {
        if (part.type !== 'text') {
            newParts.push(part);
            continue;
        }
        let lastIndex = 0;
        let match;
        linkRegex.lastIndex = 0;
        while ((match = linkRegex.exec(part.content)) !== null) {
            if (match.index > lastIndex) {
                newParts.push({ type: 'text', content: part.content.substring(lastIndex, match.index) });
            }
            newParts.push({ type: 'link', text: match[1], url: match[2] });
            lastIndex = linkRegex.lastIndex;
        }
        if (lastIndex < part.content.length) {
            newParts.push({ type: 'text', content: part.content.substring(lastIndex) });
        }
    }
    parts = newParts;

    // 2. Parse Bold: **text**
    newParts = [];
    for (let part of parts) {
        if (part.type !== 'text') {
            newParts.push(part);
            continue;
        }
        let split = part.content.split(/\*\*([^*]+)\*\*/g);
        for (let i = 0; i < split.length; i++) {
            if (i % 2 === 1) {
                newParts.push({ type: 'bold', content: split[i] });
            } else if (split[i]) {
                newParts.push({ type: 'text', content: split[i] });
            }
        }
    }
    parts = newParts;

    // 3. Parse Italic: *text*
    newParts = [];
    for (let part of parts) {
        if (part.type !== 'text') {
            newParts.push(part);
            continue;
        }
        let split = part.content.split(/\*([^*]+)\*/g);
        for (let i = 0; i < split.length; i++) {
            if (i % 2 === 1) {
                newParts.push({ type: 'italic', content: split[i] });
            } else if (split[i]) {
                newParts.push({ type: 'text', content: split[i] });
            }
        }
    }
    parts = newParts;

    return parts.map((part, index) => {
        const key = `inline-${index}`;
        if (part.type === 'bold') return <strong key={key}>{part.content}</strong>;
        if (part.type === 'italic') return <em key={key}>{part.content}</em>;
        if (part.type === 'link') {
            return (
                <a key={key} href={part.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {parseInlineMarkdown(part.text, styles)}
                </a>
            );
        }
        return part.content;
    });
}

// Helper to parse block-level Markdown elements
function parseMarkdownBlocks(markdown) {
    if (!markdown) return [];
    
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const blocks = [];
    let currentList = null;
    
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        
        if (!trimmed) {
            if (currentList) {
                blocks.push(currentList);
                currentList = null;
            }
            i++;
            continue;
        }
        
        if (trimmed === "---" || trimmed === "***") {
            if (currentList) { blocks.push(currentList); currentList = null; }
            blocks.push({ type: "hr" });
            i++;
            continue;
        }
        
        if (trimmed.startsWith("# ")) {
            if (currentList) { blocks.push(currentList); currentList = null; }
            blocks.push({ type: "heading", level: 1, text: trimmed.substring(2) });
            i++;
            continue;
        }
        if (trimmed.startsWith("## ")) {
            if (currentList) { blocks.push(currentList); currentList = null; }
            blocks.push({ type: "heading", level: 2, text: trimmed.substring(3) });
            i++;
            continue;
        }
        if (trimmed.startsWith("### ")) {
            if (currentList) { blocks.push(currentList); currentList = null; }
            blocks.push({ type: "heading", level: 3, text: trimmed.substring(4) });
            i++;
            continue;
        }
        
        if (trimmed.startsWith(">")) {
            if (currentList) { blocks.push(currentList); currentList = null; }
            let quoteLines = [];
            while (i < lines.length && (lines[i].trim().startsWith(">") || (lines[i].trim() && quoteLines.length > 0))) {
                let l = lines[i].trim();
                if (l.startsWith(">")) {
                    l = l.substring(1).trim();
                }
                quoteLines.push(l);
                i++;
            }
            blocks.push({ type: "quote", text: quoteLines.join("\n") });
            continue;
        }
        
        const listMatch = trimmed.match(/^[-*+]\s+(.*)/);
        if (listMatch) {
            if (!currentList) {
                currentList = { type: "list", format: "unordered", items: [] };
            }
            currentList.items.push(listMatch[1]);
            i++;
            continue;
        }
        
        const orderedListMatch = trimmed.match(/^\d+\.\s+(.*)/);
        if (orderedListMatch) {
            if (!currentList) {
                currentList = { type: "list", format: "ordered", items: [] };
            }
            currentList.items.push(orderedListMatch[1]);
            i++;
            continue;
        }
        
        const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
            if (currentList) { blocks.push(currentList); currentList = null; }
            blocks.push({ type: "image", alt: imgMatch[1], url: imgMatch[2] });
            i++;
            continue;
        }
        
        if (currentList) { blocks.push(currentList); currentList = null; }
        
        let paragraphLines = [];
        while (i < lines.length && lines[i].trim() && 
               !lines[i].trim().startsWith("#") && 
               !lines[i].trim().startsWith(">") && 
               !lines[i].trim().startsWith("---") && 
               !lines[i].trim().startsWith("***") && 
               !lines[i].trim().match(/^[-*+]\s+/) && 
               !lines[i].trim().match(/^\d+\.\s+/) && 
               !lines[i].trim().startsWith("![")) {
            paragraphLines.push(lines[i].trim());
            i++;
        }
        blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    }
    
    if (currentList) {
        blocks.push(currentList);
    }
    
    return blocks;
}

export default function RichTextRenderer({ content, category }) {
    if (!content) return null;

    if (typeof content === "string") {
        const blocks = parseMarkdownBlocks(content);
        let paragraphCount = 0;
        const targetParagraphIndex = 3;
        let insertAfterBlockIndex = -1;

        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].type === "paragraph") {
                paragraphCount++;
                if (paragraphCount === targetParagraphIndex) {
                    insertAfterBlockIndex = i;
                }
            }
        }

        if (insertAfterBlockIndex === -1 && blocks.length > 0) {
            insertAfterBlockIndex = Math.floor(blocks.length / 2);
        }

        const renderedBlocks = [];
        blocks.forEach((node, i) => {
            const key = `md-block-${i}`;
            let element = null;

            switch (node.type) {
                case "heading": {
                    const effectiveLevel = (!node.level || node.level === 1) ? 2 : node.level;
                    const Tag = `h${effectiveLevel}`;
                    const headingClass = styles[`h${effectiveLevel}`] || styles.h2;
                    const id = node.text
                        ?.toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .trim();
                    element = (
                        <Tag key={key} id={id} className={headingClass}>
                            {parseInlineMarkdown(node.text, styles)}
                        </Tag>
                    );
                    break;
                }
                case "paragraph":
                    element = (
                        <p key={key} className={styles.paragraph}>
                            {parseInlineMarkdown(node.text, styles)}
                        </p>
                    );
                    break;
                case "quote": {
                    const quoteBlocks = parseMarkdownBlocks(node.text);
                    const hasHeading = quoteBlocks.some(qb => qb.type === "heading");
                    const hasLink = node.text.includes("](") || quoteBlocks.some(qb => qb.type === "paragraph" && qb.text.includes("]("));
                    
                    if (hasHeading && hasLink) {
                        let headingNode = quoteBlocks.find(qb => qb.type === "heading");
                        let paragraphNodes = quoteBlocks.filter(qb => qb.type === "paragraph");
                        
                        let headingText = headingNode ? headingNode.text : "Ready for Setup?";
                        let buttonText = "Book TV Mounting";
                        let buttonUrl = "#book-now";
                        
                        const linkMatch = node.text.match(/\[([^\]]+)\]\(([^)]+)\)/);
                        if (linkMatch) {
                            buttonText = linkMatch[1].replace(/\*\*/g, "").replace(/\*/g, "");
                            buttonUrl = linkMatch[2];
                        }
                        
                        let descText = paragraphNodes
                            .map(p => p.text)
                            .filter(t => !t.startsWith("["))
                            .join(" ");
                        
                        descText = descText.replace(/\[([^\]]+)\]\(([^)]+)\)/, "").trim();
                        
                        let badgeText = "Special Offer";
                        let lowerHeading = headingText.toLowerCase();
                        if (lowerHeading.includes("tv") || lowerHeading.includes("mount") || lowerHeading.includes("install")) {
                            badgeText = "TV Installation";
                        } else if (lowerHeading.includes("audio") || lowerHeading.includes("sound") || lowerHeading.includes("speaker")) {
                            badgeText = "Sound & Audio";
                        } else if (lowerHeading.includes("smart") || lowerHeading.includes("home")) {
                            badgeText = "Smart Home";
                        }
                        
                        let cleanHeading = headingText.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim();
                        
                        element = (
                            <div key={key} className={ctaStyles.inlineCtaCard}>
                                <div className={ctaStyles.headerRow}>
                                    <div className={ctaStyles.statusIndicator} />
                                    <span className={ctaStyles.badge}>{badgeText}</span>
                                </div>
                                <div className={ctaStyles.contentBlock}>
                                    <h3 className={ctaStyles.heading}>{cleanHeading}</h3>
                                    <p className={ctaStyles.text}>{descText}</p>
                                </div>
                                <div className={ctaStyles.actionRow}>
                                    <QuoteButton size="big" modalName="BookNow">
                                        {buttonText}
                                    </QuoteButton>
                                </div>
                            </div>
                        );
                    } else {
                        element = (
                            <blockquote key={key} className={styles.blockquote}>
                                {quoteBlocks.map((qb, qbi) => {
                                    const qbKey = `${key}-qb-${qbi}`;
                                    if (qb.type === "heading") {
                                        const Tag = `h${qb.level || 3}`;
                                        const headingClass = styles[`h${qb.level}`] || styles.h3;
                                        return <Tag key={qbKey} className={headingClass}>{parseInlineMarkdown(qb.text, styles)}</Tag>;
                                    }
                                    if (qb.type === "paragraph") {
                                        return <p key={qbKey} className={styles.paragraph}>{parseInlineMarkdown(qb.text, styles)}</p>;
                                    }
                                    return <div key={qbKey}>{parseInlineMarkdown(qb.text, styles)}</div>;
                                })}
                            </blockquote>
                        );
                    }
                    break;
                }
                case "list": {
                    const Tag = node.format === "ordered" ? "ol" : "ul";
                    element = (
                        <Tag key={key} className={Tag === "ol" ? styles.ol : styles.ul}>
                            {node.items.map((item, index) => (
                                <li key={`${key}-li-${index}`} className={styles.li}>
                                    {parseInlineMarkdown(item, styles)}
                                </li>
                            ))}
                        </Tag>
                    );
                    break;
                }
                case "image":
                    element = (
                        <figure key={key} className={styles.figure}>
                            <img
                                src={node.url}
                                alt={node.alt || ""}
                                className={styles.image}
                                loading="lazy"
                            />
                            {node.alt && (
                                <figcaption className={styles.caption}>{node.alt}</figcaption>
                            )}
                        </figure>
                    );
                    break;
                case "hr":
                    element = <hr key={key} className={styles.hr} />;
                    break;
                default:
                    break;
            }

            if (element) {
                renderedBlocks.push(element);
            }

            if (i === insertAfterBlockIndex) {
                renderedBlocks.push(
                    <InlineCTA key="inline-cta" category={category} />
                );
            }
        });

        return (
            <div className={styles.richText}>
                {renderedBlocks}
            </div>
        );
    }

    if (!Array.isArray(content)) return null;

    // Count paragraphs to find a natural midpoint/insertion point
    let paragraphCount = 0;
    const targetParagraphIndex = 3; // Inject after the 3rd paragraph
    
    // Find the absolute block index of the target paragraph
    let insertAfterBlockIndex = -1;
    for (let i = 0; i < content.length; i++) {
        if (content[i].type === "paragraph") {
            paragraphCount++;
            if (paragraphCount === targetParagraphIndex) {
                insertAfterBlockIndex = i;
            }
        }
    }

    // If we have fewer than 3 paragraphs, inject it in the middle of blocks
    if (insertAfterBlockIndex === -1 && content.length > 0) {
        insertAfterBlockIndex = Math.floor(content.length / 2);
    }

    const renderedBlocks = [];
    content.forEach((node, i) => {
        const block = renderBlock(node, i);
        if (block) {
            renderedBlocks.push(block);
        }
        if (i === insertAfterBlockIndex) {
            renderedBlocks.push(
                <InlineCTA key="inline-cta" category={category} />
            );
        }
    });

    return (
        <div className={styles.richText}>
            {renderedBlocks}
        </div>
    );
}
