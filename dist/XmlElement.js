"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlElement = void 0;
class XmlElement {
    name = "";
    pcData = "";
    attributes;
    parent;
    firstChild;
    nextSibling;
    /**
     * Constructor for xml element. Allocates memory and initializes an element.
     * @param name Name of the element
     * @param parent Parent of the Xml Element
     */
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
        this.attributes = Array();
    }
    getName() {
        return this.name;
    }
    getPcData() {
        return this.pcData;
    }
    getFirstChild() {
        return this.firstChild;
    }
    getNextSibling() {
        return this.nextSibling;
    }
    getParent() {
        return this.parent;
    }
    /**
     * Sets the value of an attribute to a given value
     * @param attributeName Name of the attribute
     * @param attributeValue New attribute value
     */
    setAttributeValue(attributeName, attributeValue) {
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].getName() == attributeName) {
                this.attributes[i].setValue(attributeValue);
            }
        }
    }
    /**
     * Finds the attribute with the given name of an Xml element
     * @param attributeName Name of the attribute
     * @return If the Xml element has such an attribute returns its value, otherwise it returns NULL
     */
    getAttributeValue(attributeName) {
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].getName() == attributeName) {
                return this.attributes[i].getValue();
            }
        }
        return "";
    }
    attributeSize() {
        return this.attributes.length;
    }
    getAttribute(index) {
        return this.attributes[index];
    }
    setNextSibling(nextSibling) {
        this.nextSibling = nextSibling;
    }
    setFirstChild(firstChild) {
        this.firstChild = firstChild;
    }
    addAttribute(xmlAttribute) {
        this.attributes.push(xmlAttribute);
    }
    setPcData(pcData) {
        this.pcData = pcData;
    }
    hasAttributes() {
        return this.attributes.length != 0;
    }
}
exports.XmlElement = XmlElement;
//# sourceMappingURL=XmlElement.js.map