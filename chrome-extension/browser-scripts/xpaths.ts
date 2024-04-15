Elements = {}
Elements.DOMPath = {}

/**
 * @param {!Node} node
 * @param {boolean=} optimized
 * @return {string}
 */
Elements.DOMPath.xPath = function (node, optimized) {
    if (node.nodeType === Node.DOCUMENT_NODE) {
        return "/"
    }

    const steps = []
    let contextNode = node
    while (contextNode) {
        const step = Elements.DOMPath._xPathValue(contextNode, optimized)
        if (!step) {
            break
        } // Error - bail out early.
        steps.push(step)
        if (step.optimized) {
            break
        }
        contextNode = contextNode.parentNode
    }

    steps.reverse()
    return (steps.length && steps[0].optimized ? "" : "/") + steps.join("/")
}

/**
 * @param {!Node} node
 * @param {boolean=} optimized
 * @return {?Elements.DOMPath.Step}
 */
Elements.DOMPath._xPathValue = function (node, optimized) {
    let ownValue
    const ownIndex = Elements.DOMPath._xPathIndex(node)
    if (ownIndex === -1) {
        return null
    } // Error.

    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            if (optimized && node.getAttribute("id")) {
                return new Elements.DOMPath.Step('//*[@id="' + node.getAttribute("id") + '"]', true)
            }

            ownValue = node.localName
            break
        case Node.ATTRIBUTE_NODE:
            ownValue = "@" + node.nodeName
            break
        case Node.TEXT_NODE:
        case Node.CDATA_SECTION_NODE:
            ownValue = "text()"
            break
        case Node.PROCESSING_INSTRUCTION_NODE:
            ownValue = "processing-instruction()"
            break
        case Node.COMMENT_NODE:
            ownValue = "comment()"
            break
        case Node.DOCUMENT_NODE:
            ownValue = ""
            break
        default:
            ownValue = ""
            break
    }

    if (ownIndex > 0) {
        ownValue += "[" + ownIndex + "]"
    }

    return new Elements.DOMPath.Step(ownValue, node.nodeType === Node.DOCUMENT_NODE)
}

/**
 * @param {!Node} node
 * @return {number}
 */
Elements.DOMPath._xPathIndex = function (node) {
    // Returns -1 in case of error, 0 if no siblings matching the same expression,
    // <XPath index among the same expression-matching sibling nodes> otherwise.
    function areNodesSimilar(left, right) {
        if (left === right) {
            return true
        }

        if (left.nodeType === Node.ELEMENT_NODE && right.nodeType === Node.ELEMENT_NODE) {
            return left.localName === right.localName
        }

        if (left.nodeType === right.nodeType) {
            return true
        }

        // XPath treats CDATA as text nodes.
        const leftType = left.nodeType === Node.CDATA_SECTION_NODE ? Node.TEXT_NODE : left.nodeType
        const rightType = right.nodeType === Node.CDATA_SECTION_NODE ? Node.TEXT_NODE : right.nodeType
        return leftType === rightType
    }

    const siblings = node.parentNode ? node.parentNode.children : null
    if (!siblings) {
        return 0
    } // Root node - no siblings.
    let hasSameNamedElements
    for (let i = 0; i < siblings.length; ++i) {
        if (areNodesSimilar(node, siblings[i]) && siblings[i] !== node) {
            hasSameNamedElements = true
            break
        }
    }
    if (!hasSameNamedElements) {
        return 0
    }
    let ownIndex = 1 // XPath indices start with 1.
    for (let i = 0; i < siblings.length; ++i) {
        if (areNodesSimilar(node, siblings[i])) {
            if (siblings[i] === node) {
                return ownIndex
            }
            ++ownIndex
        }
    }
    return -1 // An error occurred: |node| not found in parent's children.
}

/**
 * @unrestricted
 */
Elements.DOMPath.Step = class {
    /**
     * @param {string} value
     * @param {boolean} optimized
     */
    constructor(value, optimized) {
        this.value = value
        this.optimized = optimized || false
    }

    /**
     * @override
     * @return {string}
     */
    toString() {
        return this.value
    }
}

function getXPath(element, root) {
    let xpath = ""
    const getPath = (node) => {
        if (!node) return null
        if (node.id === element.id) {
            return xpath
        }
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i]
                const childXPath = getPath(child)
                if (childXPath !== null) {
                    // console.log('node.tag', node.tag)
                    // console.log('node.tagName', node.tagName)
                    xpath += `/${node.tag}[${i + 1}]`
                    return childXPath
                }
            }
        }
        return null
    }
    return getPath(root)
}

function getElementByXPath(xpath, root) {
    const pathSegments = xpath.split("/").filter((segment) => segment !== "")
    let element = root
    for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i]
        if (segment.includes("[")) {
            const tag = segment.split("[")[0]
            const index = segment.split("[")[1].replace("]", "") ? parseInt(segment.split("[")[1].replace("]", "")) - 1 : 0
            element = element.children[index]
            // console.log('Element updated', element);

        } else {
            const tag = segment
            // console.log('element', element)
            // console.log('tag', tag);
            const index = element.children.findIndex((child) => child.tag === tag)
            // console.log('index', index);
            element = element.children[index]
            // console.log('Element updated', element);

        }
    }
    return element
}
