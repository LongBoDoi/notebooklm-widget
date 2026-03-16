import React, { useEffect, useMemo, useState } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import remarkHtml from 'remark-html'
import { type CitationInline, remarkCitationPlugin } from './remark-citation.plugin'
// import { Citation } from '@/components/features/citation/citation'
import { jsx, jsxs } from 'react/jsx-runtime'
import { CitationContext } from '../../context/citation-context'

export function MessageMarkdownRenderer({ content }: { content: string }) {
  const [citations, setCitations] = useState<CitationInline[]>([])

  const { renderedContent, extractedCitations } = useMemo(() => {
    const collected: CitationInline[] = []

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHtml, {
        sanitize: false, // ⚠️ Không cần sanitize ở đây vì chúng ta sẽ escape thủ công
      })
      .use(remarkCitationPlugin, {
        onCitation: (citation: CitationInline) => {
          if (!collected.some((c) => c.contextId === citation.contextId)) {
            collected.push(citation)
          }
        },
      })
      .use(remarkRehype)
      .use(rehypeReact, {
        jsx,
        jsxs,
        Fragment: React.Fragment,
        components: { /* Citation */ },
      })

    // Không được bỏ
    const escaped = content.replace(/</g, '&lt;').replace(/>/g, '&gt;')

    const rendered = processor.processSync(escaped).result

    return {
      renderedContent: rendered,
      extractedCitations: collected,
    }
  }, [content])

  useEffect(() => {
    setCitations(extractedCitations)
  }, [extractedCitations])

  return (
    <CitationContext.Provider value={citations}>
      <div className="prose prose-sm max-w-none">{renderedContent}</div>
    </CitationContext.Provider>
  )
}
