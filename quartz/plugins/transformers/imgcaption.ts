import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root, Element, ElementContent } from "hast"

// 공백만 있는 텍스트 노드를 제외한 자식들
const meaningful = (children: ElementContent[]) =>
  children.filter((c) => !(c.type === "text" && c.value.trim() === ""))

// <p><img></p> 형태면 그 img 를 돌려준다
const soleImage = (node: ElementContent): Element | null => {
  if (node.type !== "element" || node.tagName !== "p") return null
  const kids = meaningful(node.children)
  if (kids.length !== 1) return null
  const img = kids[0]
  if (img.type !== "element" || img.tagName !== "img") return null
  return img
}

// <p><em>...</em></p> 형태면 em 의 자식들을 돌려준다 (링크 보존)
const soleEmphasis = (node: ElementContent | undefined): ElementContent[] | null => {
  if (!node || node.type !== "element" || node.tagName !== "p") return null
  const kids = meaningful(node.children)
  if (kids.length !== 1) return null
  const em = kids[0]
  if (em.type !== "element" || (em.tagName !== "em" && em.tagName !== "i")) return null
  return em.children
}

/**
 * 이미지 하나만 있는 문단을 <figure> 로 감싸고 캡션을 붙인다.
 *
 *   ![alt](src)              → figcaption = alt
 *   ![alt](src)              → figcaption = 이탤릭 문단 (링크 유지)
 *   *출처: [NVIDIA](...)*
 *
 * hast 단계에서 동작한다. mdast 에서 하면 OFM 의 video / YouTube 임베드가
 * 같은 image 노드를 가로채므로 충돌한다.
 */
export const ImageCaptions: QuartzTransformerPlugin = () => ({
  name: "ImageCaptions",
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node, index, parent) => {
          if (!parent || index === undefined) return
          const img = soleImage(node)
          if (!img) return

          // 바로 다음 형제가 이탤릭 문단이면 캡션으로 흡수한다
          let caption: ElementContent[] | null = null
          let consumeNext = false

          const nextIdx = parent.children.findIndex(
            (c, i) => i > index && !(c.type === "text" && c.value.trim() === ""),
          )
          const emChildren = nextIdx === -1 ? null : soleEmphasis(parent.children[nextIdx])
          if (emChildren) {
            caption = emChildren
            consumeNext = true
          } else {
            const alt = String(img.properties?.alt ?? "").trim()
            if (alt) caption = [{ type: "text", value: alt }]
          }

          if (!caption) return

          const figure: Element = {
            type: "element",
            tagName: "figure",
            properties: { className: ["img-caption"] },
            children: [
              img,
              {
                type: "element",
                tagName: "figcaption",
                properties: {},
                children: caption,
              },
            ],
          }

          if (consumeNext) parent.children.splice(nextIdx, 1)
          parent.children[index] = figure
        })
      },
    ]
  },
})
