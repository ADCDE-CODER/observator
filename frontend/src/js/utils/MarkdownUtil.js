import MarkdownIt from 'markdown-it'
import markdownItKatex from '@vscode/markdown-it-katex'
import katex from 'katex'
import hljs from 'highlight.js';
import DOMPurify from 'dompurify'

export class MarkdownUtil {
    static DEFAULT_OPTIONS = {
        html: false,
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
    }

    static renderMarkdown(markdownText, customOptions = {}) {
        if (!markdownText) {
            return '';
        }

        const md = new MarkdownIt({
            ...MarkdownUtil.DEFAULT_OPTIONS,
            ...customOptions     
        });

        md.use(markdownItKatex.default, {
            katex
        });
    
        const dirtyHtmlString = md.render(markdownText);
        return DOMPurify.sanitize(dirtyHtmlString)
    }
}