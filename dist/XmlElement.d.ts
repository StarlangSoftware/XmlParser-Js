import { XmlAttribute } from "./XmlAttribute";
export declare class XmlElement {
    private readonly name;
    private pcData;
    private attributes;
    private parent;
    private firstChild;
    private nextSibling;
    /**
     * Constructor for xml element. Allocates memory and initializes an element.
     * @param name Name of the element
     * @param parent Parent of the Xml Element
     */
    constructor(name: string, parent: XmlElement);
    getName(): string;
    getPcData(): string;
    getFirstChild(): XmlElement;
    getNextSibling(): XmlElement;
    getParent(): XmlElement;
    /**
     * Sets the value of an attribute to a given value
     * @param attributeName Name of the attribute
     * @param attributeValue New attribute value
     */
    setAttributeValue(attributeName: string, attributeValue: string): void;
    /**
     * Finds the attribute with the given name of an Xml element
     * @param attributeName Name of the attribute
     * @return If the Xml element has such an attribute returns its value, otherwise it returns NULL
     */
    getAttributeValue(attributeName: string): string;
    attributeSize(): number;
    getAttribute(index: number): XmlAttribute;
    setNextSibling(nextSibling: XmlElement): void;
    setFirstChild(firstChild: XmlElement): void;
    addAttribute(xmlAttribute: XmlAttribute): void;
    setPcData(pcData: string): void;
    hasAttributes(): boolean;
}
