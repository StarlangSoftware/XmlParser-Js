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
    exports.XmlAttribute = void 0;
    var XmlAttribute = /** @class */ (function () {
        /**
         * Constructor for xml attribute. Initializes the attribute.
         * @param name Name of the attribute
         * @return Allocated and initialized attribute
         */
        function XmlAttribute(name) {
            this.name = name;
        }
        XmlAttribute.prototype.getName = function () {
            return this.name;
        };
        XmlAttribute.prototype.getValue = function () {
            return this.value;
        };
        XmlAttribute.prototype.setValue = function (value) {
            this.value = value;
        };
        XmlAttribute.prototype.toString = function () {
            return this.name + "=\"" + this.value + "\"";
        };
        return XmlAttribute;
    }());
    exports.XmlAttribute = XmlAttribute;
});
//# sourceMappingURL=XmlAttribute.js.map