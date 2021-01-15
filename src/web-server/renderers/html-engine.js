module.exports = class HTMLEngine {
    constructor(structure) {
        this.structure = structure
    }

    render() {
        let convertToHtml
        convertToHtml = (HtmlTree, tag = 'html', indention = 1) => {
            if (
                typeof HtmlTree !== 'object' ||
                (typeof HtmlTree.content !== 'object' && HtmlTree.attributes)
            ) {
                return this.constructHtmlFragment(
                    {
                        tag,
                        content: (() => {
                            if (HtmlTree.content) {
                                if (typeof HtmlTree.content !== 'object') {
                                    return `\n${'  '.repeat(indention)}${
                                        HtmlTree.content
                                    }\n`
                                }
                            } else if (!HtmlTree.attributes) {
                                return `\n${'  '.repeat(
                                    indention
                                )}${HtmlTree}\n`
                            } else {
                                return null
                            }
                        })(),
                        attributes: HtmlTree.attributes,
                    },
                    indention
                )
            }
            let children = ''
            let htmlKeys = Object.keys(HtmlTree)
            const doesContentExist = htmlKeys.includes('content')
            htmlKeys = doesContentExist
                ? Object.keys(HtmlTree['content'])
                : htmlKeys
            for (let i = 0; i < htmlKeys.length; ++i) {
                const childKey = htmlKeys[i]
                children += convertToHtml(
                    doesContentExist
                        ? HtmlTree['content'][childKey]
                        : HtmlTree[childKey],
                    childKey.includes('@')
                        ? childKey.substring(0, childKey.indexOf('@'))
                        : childKey,
                    indention + 1
                ).concat('\n')
            }
            return this.constructHtmlFragment(
                {
                    tag,
                    content: `\n${children}`,
                    attributes: HtmlTree.attributes,
                },
                indention
            )
        }
        return convertToHtml(this.structure.model.html)
    }

    constructHtmlFragment(fragment, indention) {
        let attributesString = ''
        const attributesMap = new Map(fragment.attributes)
        for (const key of attributesMap.keys()) {
            attributesString += `${key}="${attributesMap.get(key)}" `
        }
        attributesString = attributesString
            ? ' ' + attributesString
            : attributesString
        if (fragment.content === null) {
            return `${'  '.repeat(indention - 1)}<${
                fragment.tag
            }${attributesString}>`
        }
        return `${'  '.repeat(indention - 1)}<${
            fragment.tag
        }${attributesString}>${fragment.content}${'  '.repeat(
            indention - 1
        )}</${fragment.tag}>`
    }
}
