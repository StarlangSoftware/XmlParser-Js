export declare class XmlAttribute {
    private name;
    private value;
    /**
     * Constructor for xml attribute. Initializes the attribute.
     * @param name Name of the attribute
     * @return Allocated and initialized attribute
     */
    constructor(name: string);
    getName(): string;
    getValue(): string;
    setValue(value: string): void;
    toString(): string;
}
