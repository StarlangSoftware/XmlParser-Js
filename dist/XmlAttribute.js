"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlAttribute = void 0;
class XmlAttribute {
    name;
    value;
    /**
     * Constructor for xml attribute. Initializes the attribute.
     * @param name Name of the attribute
     */
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }
    toString() {
        return this.name + "=\"" + this.value + "\"";
    }
}
exports.XmlAttribute = XmlAttribute;
//# sourceMappingURL=XmlAttribute.js.map