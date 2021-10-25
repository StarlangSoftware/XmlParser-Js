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
    exports.XmlTextType = void 0;
    var XmlTextType;
    (function (XmlTextType) {
        XmlTextType[XmlTextType["XML_TEXT_ATTRIBUTE"] = 0] = "XML_TEXT_ATTRIBUTE";
        XmlTextType[XmlTextType["XML_TEXT_VALUE"] = 1] = "XML_TEXT_VALUE";
        XmlTextType[XmlTextType["XML_TEXT_NOT_AVAILABLE"] = 2] = "XML_TEXT_NOT_AVAILABLE";
    })(XmlTextType = exports.XmlTextType || (exports.XmlTextType = {}));
});
//# sourceMappingURL=XmlTextType.js.map