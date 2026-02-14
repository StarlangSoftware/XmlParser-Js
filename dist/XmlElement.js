(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XmlElement = void 0;
    var XmlElement = /** @class */ (function () {
        /**
         * Constructor for xml element. Allocates memory and initializes an element.
         * @param name Name of the element
         * @param parent Parent of the Xml Element
         */
        function XmlElement(name, parent) {
            this.name = "";
            this.pcData = "";
            this.name = name;
            this.parent = parent;
            this.attributes = Array();
        }
        XmlElement.prototype.getName = function () {
            return this.name;
        };
        XmlElement.prototype.getPcData = function () {
            return this.pcData;
        };
        XmlElement.prototype.getFirstChild = function () {
            return this.firstChild;
        };
        XmlElement.prototype.getNextSibling = function () {
            return this.nextSibling;
        };
        XmlElement.prototype.getParent = function () {
            return this.parent;
        };
        /**
         * Sets the value of an attribute to a given value
         * @param attributeName Name of the attribute
         * @param attributeValue New attribute value
         */
        XmlElement.prototype.setAttributeValue = function (attributeName, attributeValue) {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].getName() == attributeName) {
                    this.attributes[i].setValue(attributeValue);
                }
            }
        };
        /**
         * Finds the attribute with the given name of an Xml element
         * @param attributeName Name of the attribute
         * @return If the Xml element has such an attribute returns its value, otherwise it returns NULL
         */
        XmlElement.prototype.getAttributeValue = function (attributeName) {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].getName() == attributeName) {
                    return this.attributes[i].getValue();
                }
            }
            return "";
        };
        XmlElement.prototype.attributeSize = function () {
            return this.attributes.length;
        };
        XmlElement.prototype.getAttribute = function (index) {
            return this.attributes[index];
        };
        XmlElement.prototype.setNextSibling = function (nextSibling) {
            this.nextSibling = nextSibling;
        };
        XmlElement.prototype.setFirstChild = function (firstChild) {
            this.firstChild = firstChild;
        };
        XmlElement.prototype.addAttribute = function (xmlAttribute) {
            this.attributes.push(xmlAttribute);
        };
        XmlElement.prototype.setPcData = function (pcData) {
            this.pcData = pcData;
        };
        XmlElement.prototype.hasAttributes = function () {
            return this.attributes.length != 0;
        };
        return XmlElement;
    }());
    exports.XmlElement = XmlElement;
});
//# sourceMappingURL=XmlElement.js.map