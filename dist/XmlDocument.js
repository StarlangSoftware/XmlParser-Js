(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./XmlElement", "fs", "./XmlAttribute", "./XmlTokenType", "./XmlTextType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XmlDocument = void 0;
    var XmlElement_1 = require("./XmlElement");
    var fs = require("fs");
    var XmlAttribute_1 = require("./XmlAttribute");
    var XmlTokenType_1 = require("./XmlTokenType");
    var XmlTextType_1 = require("./XmlTextType");
    var XmlDocument = /** @class */ (function () {
        /**
         * Creates an empty xml document.
         * @param fileName Name of the xml file
         * @return Empty xml document. Xml file is not parsed yet.
         */
        function XmlDocument(fileName) {
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
            this.fileName = fileName;
            this.position = 0;
        }
        XmlDocument.prototype.readChar = function () {
            var ch = this.data[this.position];
            this.position++;
            return ch;
        };
        /**
         * Reads a token character by character from xml file.
         * @param previousChar Previous character read
         * @param extraAllowed If true, space or slash is allowed in the token, otherwise it is not allowed
         * @param quotaAllowed If true, quota is allowed in the token, otherwise it is not allowed
         * @return Token read
         */
        XmlDocument.prototype.readToken = function (previousChar, extraAllowed, quotaAllowed) {
            if (extraAllowed === void 0) { extraAllowed = false; }
            if (quotaAllowed === void 0) { quotaAllowed = false; }
            var ch = previousChar;
            var buffer = "";
            while ((ch != "'" || extraAllowed) && (ch != "\"" || quotaAllowed) && (ch != "=" || quotaAllowed) && (ch != " " || extraAllowed) && (ch != "/" || extraAllowed) && (ch != null) && (ch != '<') && (ch != '>' || quotaAllowed)) {
                buffer += ch;
                ch = this.readChar();
            }
            this.nextChar = ch;
            return buffer;
        };
        /**
         * Parses a tag like <mytag> or </mytag>
         * @return Token read
         */
        XmlDocument.prototype.parseTag = function () {
            var ch = this.readChar();
            if (ch == "/") {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_CLOSING_TAG_WITHOUT_ATTRIBUTES;
                ch = this.readChar();
            }
            else {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES;
            }
            var token = this.readToken(ch);
            ch = this.nextChar;
            if (ch == ">" && this.lastReadTokenType == XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES) {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_WITHOUT_ATTRIBUTES;
            }
            if (this.lastReadTokenType == XmlTokenType_1.XmlTokenType.XML_CLOSING_TAG_WITHOUT_ATTRIBUTES && ch != ">") {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
                return "";
            }
            else {
                return token;
            }
        };
        /**
         * Parses an attribute value like "attribute value" or 'attribute value'
         * @return Attribute value read
         */
        XmlDocument.prototype.parseAttributeValue = function () {
            var ch = this.readChar();
            if (ch == "\"") {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_ATTRIBUTE_VALUE;
                return "";
            }
            var token = this.readToken(ch, true);
            ch = this.nextChar;
            if (ch != "\"") {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
                return "";
            }
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_ATTRIBUTE_VALUE;
            return token;
        };
        /**
         * Parses a tag like />
         * @return ""
         */
        XmlDocument.prototype.parseEmptyTag = function () {
            var ch = this.readChar();
            if (ch != ">") {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
            }
            else {
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_CLOSING_TAG_WITH_ATTRIBUTES;
            }
            return "";
        };
        XmlDocument.prototype.getNextToken = function (xmlTextType) {
            var ch = this.readChar();
            while (ch == " " || ch == "\t" || ch == "\n") {
                ch = this.readChar();
            }
            switch (ch) {
                case "<":
                    return this.parseTag();
                case "\"":
                    if (xmlTextType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                        var token_1 = this.readToken(ch, true, true);
                        ch = this.nextChar;
                        this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_TEXT;
                        this.position--;
                        return token_1;
                    }
                    else {
                        return this.parseAttributeValue();
                    }
                case "/":
                    return this.parseEmptyTag();
                case "=":
                    if (xmlTextType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                        var token_2 = this.readToken(ch, true, true);
                        ch = this.nextChar;
                        this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_TEXT;
                        this.position--;
                        return token_2;
                    }
                    else {
                        this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_EQUAL;
                    }
                    break;
                case ">":
                    if (xmlTextType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                        var token_3 = this.readToken(ch, true, true);
                        ch = this.nextChar;
                        this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_TEXT;
                        this.position--;
                        return token_3;
                    }
                    else {
                        this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_FINISH;
                    }
                    return "";
                case undefined:
                    this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
                    return "";
                default:
                    var token = void 0;
                    if (xmlTextType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                        token = this.readToken(ch, true, true);
                        ch = this.nextChar;
                    }
                    else {
                        token = this.readToken(ch, true);
                        ch = this.nextChar;
                    }
                    this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_TEXT;
                    this.position--;
                    return token;
            }
            return "";
        };
        /**
         * Parses given xml document
         */
        XmlDocument.prototype.parse = function () {
            var textType = XmlTextType_1.XmlTextType.XML_TEXT_ATTRIBUTE;
            var siblingClosed = false;
            var token;
            var xmlAttribute;
            var sibling;
            var parent;
            var current;
            this.data = fs.readFileSync(this.fileName, 'utf8');
            token = this.getNextToken(textType);
            while (this.lastReadTokenType != XmlTokenType_1.XmlTokenType.XML_END) {
                switch (this.lastReadTokenType) {
                    case XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES:
                    case XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_WITHOUT_ATTRIBUTES:
                        current = new XmlElement_1.XmlElement(token, parent);
                        if (parent) {
                            if (sibling && siblingClosed) {
                                sibling.setNextSibling(current);
                                sibling = current;
                            }
                            else {
                                parent.setFirstChild(current);
                            }
                        }
                        else {
                            if (!this.root) {
                                this.root = current;
                            }
                        }
                        parent = current;
                        siblingClosed = false;
                        if (this.lastReadTokenType == XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES) {
                            textType = XmlTextType_1.XmlTextType.XML_TEXT_ATTRIBUTE;
                        }
                        else {
                            textType = XmlTextType_1.XmlTextType.XML_TEXT_VALUE;
                        }
                        break;
                    case XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_FINISH:
                        textType = XmlTextType_1.XmlTextType.XML_TEXT_VALUE;
                        siblingClosed = false;
                        break;
                    case XmlTokenType_1.XmlTokenType.XML_CLOSING_TAG_WITH_ATTRIBUTES:
                        sibling = current;
                        parent = current.getParent();
                        textType = XmlTextType_1.XmlTextType.XML_TEXT_VALUE;
                        siblingClosed = true;
                        break;
                    case XmlTokenType_1.XmlTokenType.XML_CLOSING_TAG_WITHOUT_ATTRIBUTES:
                        if (token == current.getName()) {
                            sibling = current;
                            parent = current.getParent();
                        }
                        else {
                            if (token == current.getParent().getName()) {
                                sibling = parent;
                                parent = current.getParent().getParent();
                                current = current.getParent();
                            }
                        }
                        siblingClosed = true;
                        textType = XmlTextType_1.XmlTextType.XML_TEXT_VALUE;
                        break;
                    case XmlTokenType_1.XmlTokenType.XML_ATTRIBUTE_VALUE:
                        if (token != "") {
                            token = this.replaceEscapeCharacters(token);
                            xmlAttribute.setValue(token);
                        }
                        else {
                            xmlAttribute.setValue("");
                        }
                        current.addAttribute(xmlAttribute);
                        textType = XmlTextType_1.XmlTextType.XML_TEXT_ATTRIBUTE;
                        break;
                    case XmlTokenType_1.XmlTokenType.XML_EQUAL:
                        textType = XmlTextType_1.XmlTextType.XML_TEXT_NOT_AVAILABLE;
                        break;
                    case XmlTokenType_1.XmlTokenType.XML_TEXT:
                        if (textType == XmlTextType_1.XmlTextType.XML_TEXT_ATTRIBUTE) {
                            xmlAttribute = new XmlAttribute_1.XmlAttribute(token);
                        }
                        else {
                            if (textType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                                token = this.replaceEscapeCharacters(token);
                                current.setPcData(token);
                            }
                        }
                        break;
                    default:
                        break;
                }
                token = this.getNextToken(textType);
            }
        };
        XmlDocument.prototype.getFirstChild = function () {
            return this.root;
        };
        XmlDocument.prototype.replaceEscapeCharacters = function (token) {
            var result = token;
            while (result.search("&quot;") != -1) {
                result.replace("&quot;", "\"");
            }
            while (result.search("&amp;") != -1) {
                result.replace("&amp;", "&");
            }
            while (result.search("&lt;") != -1) {
                result.replace("&lt;", "<");
            }
            while (result.search("&gt;") != -1) {
                result.replace("&gt;", ">");
            }
            while (result.search("&apos;") != -1) {
                result.replace("&apos;", "'");
            }
            return result;
        };
        return XmlDocument;
    }());
    exports.XmlDocument = XmlDocument;
});
//# sourceMappingURL=XmlDocument.js.map