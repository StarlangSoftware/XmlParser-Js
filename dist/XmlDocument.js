"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlDocument = void 0;
const XmlElement_1 = require("./XmlElement");
const fs = __importStar(require("fs"));
const XmlAttribute_1 = require("./XmlAttribute");
const XmlTokenType_1 = require("./XmlTokenType");
const XmlTextType_1 = require("./XmlTextType");
class XmlDocument {
    fileName;
    root;
    lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
    data;
    position;
    nextChar;
    /**
     * Creates an empty xml document.
     * @param fileName Name of the xml file
     * @return Empty xml document. Xml file is not parsed yet.
     */
    constructor(fileName) {
        this.fileName = fileName;
        this.position = 0;
    }
    readChar() {
        let ch = this.data[this.position];
        this.position++;
        return ch;
    }
    /**
     * Reads a token character by character from xml file.
     * @param previousChar Previous character read
     * @param extraAllowed If true, space or slash is allowed in the token, otherwise it is not allowed
     * @param quotaAllowed If true, quota is allowed in the token, otherwise it is not allowed
     * @return Token read
     */
    readToken(previousChar, extraAllowed = false, quotaAllowed = false) {
        let ch = previousChar;
        let buffer = "";
        while ((ch != "'" || extraAllowed) && (ch != "\"" || quotaAllowed) && (ch != "=" || quotaAllowed) && (ch != " " || extraAllowed) && (ch != "/" || extraAllowed) && (ch != null) && (ch != '<') && (ch != '>' || quotaAllowed)) {
            buffer += ch;
            ch = this.readChar();
        }
        this.nextChar = ch;
        return buffer;
    }
    /**
     * Parses a tag like <mytag> or </mytag>
     * @return Token read
     */
    parseTag() {
        let ch = this.readChar();
        if (ch == "/") {
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_CLOSING_TAG_WITHOUT_ATTRIBUTES;
            ch = this.readChar();
        }
        else {
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES;
        }
        let token = this.readToken(ch);
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
    }
    /**
     * Parses an attribute value like "attribute value" or 'attribute value'
     * @return Attribute value read
     */
    parseAttributeValue() {
        let ch = this.readChar();
        if (ch == "\"") {
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_ATTRIBUTE_VALUE;
            return "";
        }
        let token = this.readToken(ch, true);
        ch = this.nextChar;
        if (ch != "\"") {
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
            return "";
        }
        this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_ATTRIBUTE_VALUE;
        return token;
    }
    /**
     * Parses a tag like />
     * @return ""
     */
    parseEmptyTag() {
        let ch = this.readChar();
        if (ch != ">") {
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
        }
        else {
            this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_CLOSING_TAG_WITH_ATTRIBUTES;
        }
        return "";
    }
    getNextToken(xmlTextType) {
        let ch = this.readChar();
        while (ch == " " || ch == "\t" || ch == "\n") {
            ch = this.readChar();
        }
        switch (ch) {
            case "<":
                return this.parseTag();
            case "\"":
                if (xmlTextType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                    let token = this.readToken(ch, true, true);
                    ch = this.nextChar;
                    this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_TEXT;
                    this.position--;
                    return token;
                }
                else {
                    return this.parseAttributeValue();
                }
            case "/":
                return this.parseEmptyTag();
            case "=":
                if (xmlTextType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                    let token = this.readToken(ch, true, true);
                    ch = this.nextChar;
                    this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_TEXT;
                    this.position--;
                    return token;
                }
                else {
                    this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_EQUAL;
                }
                break;
            case ">":
                if (xmlTextType == XmlTextType_1.XmlTextType.XML_TEXT_VALUE) {
                    let token = this.readToken(ch, true, true);
                    ch = this.nextChar;
                    this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_TEXT;
                    this.position--;
                    return token;
                }
                else {
                    this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_OPENING_TAG_FINISH;
                }
                return "";
            case undefined:
                this.lastReadTokenType = XmlTokenType_1.XmlTokenType.XML_END;
                return "";
            default:
                let token;
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
    }
    /**
     * Parses given xml document
     */
    parse() {
        let textType = XmlTextType_1.XmlTextType.XML_TEXT_ATTRIBUTE;
        let siblingClosed = false;
        let token;
        let xmlAttribute;
        let sibling;
        let parent;
        let current;
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
    }
    getFirstChild() {
        return this.root;
    }
    replaceEscapeCharacters(token) {
        var result = token;
        while (result.search("&quot;") != -1) {
            result = result.replace("&quot;", "\"");
        }
        while (result.search("&amp;") != -1) {
            result = result.replace("&amp;", "&");
        }
        while (result.search("&lt;") != -1) {
            result = result.replace("&lt;", "<");
        }
        while (result.search("&gt;") != -1) {
            result = result.replace("&gt;", ">");
        }
        while (result.search("&apos;") != -1) {
            result = result.replace("&apos;", "'");
        }
        return result;
    }
}
exports.XmlDocument = XmlDocument;
//# sourceMappingURL=XmlDocument.js.map