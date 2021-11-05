import {XmlElement} from "./XmlElement";
import * as fs from "fs";
import {XmlAttribute} from "./XmlAttribute";
import {XmlTokenType} from "./XmlTokenType";
import {XmlTextType} from "./XmlTextType";

export class XmlDocument {

    private fileName: string
    private root: XmlElement
    private lastReadTokenType: XmlTokenType = XmlTokenType.XML_END
    private data: string
    private position: number
    private nextChar: string

    /**
     * Creates an empty xml document.
     * @param fileName Name of the xml file
     * @return Empty xml document. Xml file is not parsed yet.
     */
    constructor(fileName: string) {
        this.fileName = fileName
        this.position = 0
    }

    readChar(): string{
        let ch = this.data[this.position]
        this.position++
        return ch
    }

    /**
     * Reads a token character by character from xml file.
     * @param previousChar Previous character read
     * @param extraAllowed If true, space or slash is allowed in the token, otherwise it is not allowed
     * @param quotaAllowed If true, quota is allowed in the token, otherwise it is not allowed
     * @return Token read
     */
    readToken(previousChar: string, extraAllowed: boolean = false, quotaAllowed: boolean = false): string{
        let ch = previousChar;
        let buffer = ""
        while ((ch != "'" || extraAllowed) && (ch != "\"" || quotaAllowed) && (ch != "=" || quotaAllowed) && (ch != " " || extraAllowed) && (ch != "/" || extraAllowed) && (ch != null) && (ch != '<') && (ch != '>' || quotaAllowed)) {
            buffer += ch;
            ch = this.readChar()
        }
        this.nextChar = ch;
        return buffer;
    }

    /**
     * Parses a tag like <mytag> or </mytag>
     * @return Token read
     */
    parseTag(): string{
        let ch = this.readChar()
        if (ch == "/") {
            this.lastReadTokenType = XmlTokenType.XML_CLOSING_TAG_WITHOUT_ATTRIBUTES
            ch = this.readChar()
        } else {
            this.lastReadTokenType = XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES
        }
        let token = this.readToken(ch)
        ch = this.nextChar
        if (ch == ">" && this.lastReadTokenType == XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES){
            this.lastReadTokenType = XmlTokenType.XML_OPENING_TAG_WITHOUT_ATTRIBUTES
        }
        if (this.lastReadTokenType == XmlTokenType.XML_CLOSING_TAG_WITHOUT_ATTRIBUTES && ch != ">") {
            this.lastReadTokenType = XmlTokenType.XML_END
            return ""
        }
        else{
            return token
        }
    }

    /**
     * Parses an attribute value like "attribute value" or 'attribute value'
     * @return Attribute value read
     */
    parseAttributeValue(): string{
        let ch = this.readChar()
        if (ch == "\"") {
            this.lastReadTokenType = XmlTokenType.XML_ATTRIBUTE_VALUE
            return ""
        }
        let token = this.readToken(ch, true);
        ch = this.nextChar
        if (ch != "\"") {
            this.lastReadTokenType = XmlTokenType.XML_END
            return "";
        }
        this.lastReadTokenType = XmlTokenType.XML_ATTRIBUTE_VALUE
        return token
    }

    /**
     * Parses a tag like />
     * @return ""
     */
    parseEmptyTag(): string{
        let ch = this.readChar()
        if (ch != ">") {
            this.lastReadTokenType = XmlTokenType.XML_END
        } else {
            this.lastReadTokenType = XmlTokenType.XML_CLOSING_TAG_WITH_ATTRIBUTES
        }
        return "";
    }

    getNextToken(xmlTextType: XmlTextType): string{
        let ch = this.readChar()
        while (ch == " " || ch == "\t" || ch == "\n"){
            ch = this.readChar()
        }
        switch (ch){
            case  "<":
                return this.parseTag()
            case "\"":
                if (xmlTextType == XmlTextType.XML_TEXT_VALUE){
                    let token = this.readToken(ch, true, true)
                    ch = this.nextChar
                    this.lastReadTokenType = XmlTokenType.XML_TEXT
                    this.position--
                    return token
                } else {
                    return this.parseAttributeValue()
                }
            case  "/":
                return this.parseEmptyTag()
            case  "=":
                if (xmlTextType == XmlTextType.XML_TEXT_VALUE){
                    let token = this.readToken(ch, true, true);
                    ch = this.nextChar
                    this.lastReadTokenType = XmlTokenType.XML_TEXT
                    this.position--
                    return token;
                } else {
                    this.lastReadTokenType = XmlTokenType.XML_EQUAL
                }
                break;
            case  ">":
                if (xmlTextType == XmlTextType.XML_TEXT_VALUE){
                    let token = this.readToken(ch, true, true);
                    ch = this.nextChar
                    this.lastReadTokenType = XmlTokenType.XML_TEXT
                    this.position--
                    return token;
                } else {
                    this.lastReadTokenType = XmlTokenType.XML_OPENING_TAG_FINISH
                }
                return "";
            case undefined:
                this.lastReadTokenType = XmlTokenType.XML_END
                return "";
            default  :
                let token
                if (xmlTextType == XmlTextType.XML_TEXT_VALUE){
                    token = this.readToken(ch, true, true)
                    ch = this.nextChar
                } else {
                    token = this.readToken(ch, true)
                    ch = this.nextChar
                }
                this.lastReadTokenType = XmlTokenType.XML_TEXT
                this.position--
                return token
        }
        return ""
    }

    /**
     * Parses given xml document
     */
    parse(){
        let textType: XmlTextType = XmlTextType.XML_TEXT_ATTRIBUTE;
        let siblingClosed: boolean = false;
        let token
        let xmlAttribute: XmlAttribute;
        let sibling: XmlElement;
        let parent: XmlElement;
        let current: XmlElement;
        this.data = fs.readFileSync(this.fileName, 'utf8')
        token = this.getNextToken(textType)
        while (this.lastReadTokenType != XmlTokenType.XML_END){
            switch (this.lastReadTokenType){
                case XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES:
                case XmlTokenType.XML_OPENING_TAG_WITHOUT_ATTRIBUTES:
                    current = new XmlElement(token, parent)
                    if (parent) {
                        if (sibling && siblingClosed) {
                            sibling.setNextSibling(current)
                            sibling = current
                        } else {
                            parent.setFirstChild(current)
                        }
                    } else {
                        if (!this.root){
                            this.root = current
                        }
                    }
                    parent = current
                    siblingClosed = false
                    if (this.lastReadTokenType == XmlTokenType.XML_OPENING_TAG_WITH_ATTRIBUTES){
                        textType = XmlTextType.XML_TEXT_ATTRIBUTE
                    } else {
                        textType = XmlTextType.XML_TEXT_VALUE
                    }
                    break;
                case XmlTokenType.XML_OPENING_TAG_FINISH:
                    textType = XmlTextType.XML_TEXT_VALUE
                    siblingClosed = false
                    break;
                case XmlTokenType.XML_CLOSING_TAG_WITH_ATTRIBUTES:
                    sibling = current
                    parent = current.getParent()
                    textType = XmlTextType.XML_TEXT_VALUE
                    siblingClosed = true
                    break;
                case XmlTokenType.XML_CLOSING_TAG_WITHOUT_ATTRIBUTES:
                    if (token == current.getName()) {
                        sibling = current
                        parent = current.getParent()
                    } else {
                        if (token == current.getParent().getName()) {
                            sibling = parent
                            parent = current.getParent().getParent()
                            current = current.getParent()
                        }
                    }
                    siblingClosed = true
                    textType = XmlTextType.XML_TEXT_VALUE
                    break;
                case XmlTokenType.XML_ATTRIBUTE_VALUE:
                    if (token != ""){
                        token = this.replaceEscapeCharacters(token)
                        xmlAttribute.setValue(token)
                    } else {
                        xmlAttribute.setValue("")
                    }
                    current.addAttribute(xmlAttribute)
                    textType = XmlTextType.XML_TEXT_ATTRIBUTE
                    break;
                case XmlTokenType.XML_EQUAL:
                    textType = XmlTextType.XML_TEXT_NOT_AVAILABLE
                    break;
                case XmlTokenType.XML_TEXT:
                    if (textType == XmlTextType.XML_TEXT_ATTRIBUTE) {
                        xmlAttribute = new XmlAttribute(token)
                    } else {
                        if (textType == XmlTextType.XML_TEXT_VALUE){
                            token = this.replaceEscapeCharacters(token)
                            current.setPcData(token)
                        }
                    }
                    break;
                default:
                    break;
            }
            token = this.getNextToken(textType)
        }
    }

    getFirstChild(): XmlElement{
        return this.root
    }

    replaceEscapeCharacters(token: string): string{
        var result: string = token
        while (result.search("&quot;") != -1){
            result = result.replace("&quot;", "\"");
        }
        while (result.search("&amp;") != -1){
            result = result.replace("&amp;", "&");
        }
        while (result.search("&lt;") != -1){
            result = result.replace("&lt;", "<");
        }
        while (result.search("&gt;") != -1){
            result = result.replace("&gt;", ">");
        }
        while (result.search("&apos;") != -1){
            result = result.replace("&apos;", "'");
        }
        return result
    }

}