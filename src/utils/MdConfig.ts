import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md: MarkdownIt = MarkdownIt()

md.use(await Shiki({
    themes: {
        light: 'dracula',
        dark: 'dracula',
    }
}))

export {
    md
}