import {XmlAttribute} from "./XmlAttribute";

export class XmlElement {

    private readonly name: string = ""
    private pcData: string = ""
    private attributes: Array<XmlAttribute>
    private parent: XmlElement
    private firstChild: XmlElement
    private nextSibling: XmlElement

    /**
     * Constructor for xml element. Allocates memory and initializes an element.
     * @param name Name of the element
     * @param parent Parent of the Xml Element
     */
    constructor(name: string, parent: XmlElement) {
        this.name = name
        this.parent = parent
        this.attributes = Array()
    }

    getName(): string{
        return this.name
    }

    getPcData(): string{
        return this.pcData
    }

    getFirstChild(): XmlElement{
        return this.firstChild
    }

    getNextSibling(): XmlElement{
        return this.nextSibling
    }

    getParent(): XmlElement{
        return this.parent
    }

    /**
     * Sets the value of an attribute to a given value
     * @param attributeName Name of the attribute
     * @param attributeValue New attribute value
     */
    setAttributeValue(attributeName: string, attributeValue: string){
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].getName() == attributeName){
                this.attributes[i].setValue(attributeValue)
            }
        }
    }

    /**
     * Finds the attribute with the given name of an Xml element
     * @param attributeName Name of the attribute
     * @return If the Xml element has such an attribute returns its value, otherwise it returns NULL
     */
    getAttributeValue(attributeName: string): string{
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].getName() == attributeName){
                return this.attributes[i].getValue()
            }
        }
        return ""
    }

    attributeSize(): number{
        return this.attributes.length
    }

    getAttribute(index: number): XmlAttribute{
        return this.attributes[index]
    }

    setNextSibling(nextSibling: XmlElement){
        this.nextSibling = nextSibling
    }

    setFirstChild(firstChild: XmlElement){
        this.firstChild = firstChild
    }

    addAttribute(xmlAttribute: XmlAttribute){
        this.attributes.push(xmlAttribute)
    }

    setPcData(pcData: string){
        this.pcData = pcData
    }

    hasAttributes(): boolean{
        return this.attributes.length != 0
    }

}