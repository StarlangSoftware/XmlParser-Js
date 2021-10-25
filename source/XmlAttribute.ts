export class XmlAttribute {

    private name: string
    private value: string

    /**
     * Constructor for xml attribute. Initializes the attribute.
     * @param name Name of the attribute
     * @return Allocated and initialized attribute
     */
    constructor(name: string) {
        this.name = name
    }

    getName(): string{
        return this.name
    }

    getValue(): string{
        return this.value
    }

    setValue(value: string){
        this.value = value
    }

    toString(): string{
        return this.name + "=\"" + this.value + "\"";
    }
}