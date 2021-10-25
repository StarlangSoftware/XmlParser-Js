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
    exports.XmlTokenType = void 0;
    var XmlTokenType;
    (function (XmlTokenType) {
        XmlTokenType[XmlTokenType["XML_OPENING_TAG_WITH_ATTRIBUTES"] = 0] = "XML_OPENING_TAG_WITH_ATTRIBUTES";
        XmlTokenType[XmlTokenType["XML_OPENING_TAG_WITHOUT_ATTRIBUTES"] = 1] = "XML_OPENING_TAG_WITHOUT_ATTRIBUTES";
        XmlTokenType[XmlTokenType["XML_OPENING_TAG_FINISH"] = 2] = "XML_OPENING_TAG_FINISH";
        XmlTokenType[XmlTokenType["XML_CLOSING_TAG_WITH_ATTRIBUTES"] = 3] = "XML_CLOSING_TAG_WITH_ATTRIBUTES";
        XmlTokenType[XmlTokenType["XML_CLOSING_TAG_WITHOUT_ATTRIBUTES"] = 4] = "XML_CLOSING_TAG_WITHOUT_ATTRIBUTES";
        XmlTokenType[XmlTokenType["XML_ATTRIBUTE_VALUE"] = 5] = "XML_ATTRIBUTE_VALUE";
        XmlTokenType[XmlTokenType["XML_EQUAL"] = 6] = "XML_EQUAL";
        XmlTokenType[XmlTokenType["XML_TEXT"] = 7] = "XML_TEXT";
        XmlTokenType[XmlTokenType["XML_END"] = 8] = "XML_END";
    })(XmlTokenType = exports.XmlTokenType || (exports.XmlTokenType = {}));
});
//# sourceMappingURL=XmlTokenType.js.map