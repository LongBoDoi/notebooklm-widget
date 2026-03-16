/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { visit } from 'unist-util-visit'

export type CitationInline = {
  contextId: string
}

const CITATION_REGEX = /<<<context_id[:=]"(.*?)">{1,5}/g

type RemarkCitationPluginOptions = {
  onCitation?: (citation: CitationInline) => void
}

export function remarkCitationPlugin({ onCitation }: RemarkCitationPluginOptions = {}) {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      // const regex = /<<<citation\{(.*?)\}\s(.*?)>>>/g
      const regex = CITATION_REGEX
      let match
      const newChildren = []
      let lastIndex = 0

      while ((match = regex.exec(node.value)) !== null) {
        const [_full, contextId] = match
        const start = match.index
        const end = regex.lastIndex

        // Push text before citation
        if (start > lastIndex) {
          newChildren.push({
            type: 'text',
            value: node.value.slice(lastIndex, start),
          })
        }

        // const props: Record<string, string> = {}
        // propsRaw.split(/\s+/).forEach((pair) => {
        //   const [k, v] = pair.split('=')
        //   if (v) {
        //     props[k] = v.replace(/"/g, '')
        //   }
        // })

        const citation: CitationInline = {
          contextId,
        }

        onCitation?.(citation)

        // Push custom node
        newChildren.push({
          type: 'citation',
          data: {
            hName: 'Citation',
            hProperties: citation,
          },
        })

        lastIndex = end
      }

      if (lastIndex < node.value.length) {
        newChildren.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        })
      }

      if (newChildren.length > 0 && parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...newChildren)
        return index + newChildren.length
      }
    })
  }
}
