import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md: MarkdownIt = MarkdownIt()

// 配置 markdown-It + shiki
md.use(await Shiki({
    themes: {
        light: 'dracula',
        dark: 'dracula',
    }
}))

export {
    md
}