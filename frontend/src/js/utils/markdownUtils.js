import markdownit from 'markdown-it'
import hljs from 'highlight.js';

const md = markdownit({
    html: true,
    linkify: true,
    breaks: true,
    sanitize: true,
    highlight(str, lang) {
        // If a valid language is provided, highlight using that specific language; 
        // otherwise, auto-detect the language for highlighting.
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (error) {
                console.warn("Highlighting failed for block:", str);
                return '';
            }
        } else {
            try {
                return hljs.highlightAuto(str).value;
            } catch (error) {
                console.warn("Auto-highlighting failed for block.")
                return '';
            }
        }
    }
});

export function renderMarkdown(markdownText) {
    if (!markdownText) {
        return '';
    }

    return md.render(markdownText);
}