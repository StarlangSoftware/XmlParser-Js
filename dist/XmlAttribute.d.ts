export declare class XmlAttribute {
    private readonly name;
    private value;
    /**
     * Constructor for xml attribute. Initializes the attribute.
     * @param name Name of the attribute
     */
    constructor(name: string);
    getName(): string;
    getValue(): string;
    setValue(value: string): void;
    toString(): string;
}
