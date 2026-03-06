export default function imageLoader({ src, width, quality }) {
    // Return original source if no specialized handling is needed
    // The width/quality parameters are accepted to satisfy Next.js Image loader requirements
    return src;
}
