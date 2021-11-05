import * as assert from "assert";
import {XmlDocument} from "../dist/XmlDocument";

describe('XmlTest', function() {
    describe('Read test', function() {
        it('Checks reading of xml file', function() {
            var doc = new XmlDocument("test.xml")
            doc.parse()
            let root = doc.getFirstChild()
            assert.strictEqual("frameset", root.getName())
            let firstChild = root.getFirstChild()
            assert.strictEqual("role", firstChild.getName())
            assert.strictEqual("ali veli \"deneme yapmak\" = anlamında > bir deyim", firstChild.getPcData())
            let secondChild = firstChild.getNextSibling()
            assert.strictEqual("perceiver, alien \"x3\" to whom?", secondChild.getAttributeValue("descr"))
            assert.strictEqual("PAG", secondChild.getAttributeValue("f"))
            assert.strictEqual("2", secondChild.getAttributeValue("n"))
        });
    });
});
