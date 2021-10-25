import { XmlElement } from "./XmlElement";
import { XmlTextType } from "./XmlTextType";
export declare class XmlDocument {
    private fileName;
    private root;
    private lastReadTokenType;
    private data;
    private position;
    private nextChar;
    /**
     * Creates an empty xml document.
     * @param fileName Name of the xml file
     * @return Empty xml document. Xml file is not parsed yet.
     */
    constructor(fileName: string);
    readChar(): string;
    /**
     * Reads a token character by character from xml file.
     * @param previousChar Previous character read
     * @param extraAllowed If true, space or slash is allowed in the token, otherwise it is not allowed
     * @param quotaAllowed If true, quota is allowed in the token, otherwise it is not allowed
     * @return Token read
     */
    readToken(previousChar: string, extraAllowed?: boolean, quotaAllowed?: boolean): string;
    /**
     * Parses a tag like <mytag> or </mytag>
     * @return Token read
     */
    parseTag(): string;
    /**
     * Parses an attribute value like "attribute value" or 'attribute value'
     * @return Attribute value read
     */
    parseAttributeValue(): string;
    /**
     * Parses a tag like />
     * @return ""
     */
    parseEmptyTag(): string;
    getNextToken(xmlTextType: XmlTextType): string;
    /**
     * Parses given xml document
     */
    parse(): void;
    getFirstChild(): XmlElement;
    replaceEscapeCharacters(token: string): string;
}
