import { readFileSync } from "fs";
import stopwords from "./stopwords";

const SPAM = "spam";
const HAM = "ham";

export default class SpamFilter {
    constructor(sourceFilename) {
        this.docNum = 0;
        this.spamDocNum = 0;
        this.termDocFreq = new Map();
        this.spamTermDocFreq = new Map();

        const data = readFileSync(sourceFilename, "utf-8");
        const lines = data.split("\n");

        for (const line of lines) {
            if (line === "") continue;

            const [cls, text] = line.split("\t");
            const terms = this.termifyText(text);
            let alreadyOccuredInDoc = [];

            for (const term of terms) {
                // do not increment, when already counted this doc for this term
                if (alreadyOccuredInDoc.includes(term)) continue;
                alreadyOccuredInDoc.push(term);

                if (!this.termDocFreq.has(term)) {
                    this.termDocFreq.set(term, 1);
                } else {
                    this.termDocFreq.set(term, this.termDocFreq.get(term) + 1);
                }
            }

            if (cls === SPAM) {
                // alreadyOccured holder is being used here as it has every term only on time
                for (const term of alreadyOccuredInDoc) {
                    if (!this.spamTermDocFreq.has(term)) {
                        this.spamTermDocFreq.set(term, 1);
                    } else {
                        this.spamTermDocFreq.set(term, this.spamTermDocFreq.get(term) + 1);
                    }
                }

                this.spamDocNum++;
            }

            this.docNum++;
        }
    }

    pTextClass(text, cls) {
        return this.pClassText(cls, text) / this.pClass(cls);
    }

    pClassText(cls, text) {
        const terms = this.termifyText(text);
        const inverseCls = cls === SPAM ? HAM : SPAM;
        const pCls = this.pClass(cls);
        const counterpCls = this.pClass(inverseCls);
        // products
        const prodpTermCls = terms.reduce((total, term) => total * this.pTermClass(term, cls), 1);
        const counterProdpTermCls = terms.reduce((total, term) => total * this.pTermClass(term, inverseCls), 1);

        return (pCls * prodpTermCls) / (pCls * prodpTermCls + counterpCls * counterProdpTermCls);
    }

    pClassTerm(cls, term) {
        const inverseCls = cls === SPAM ? HAM : SPAM;
        const pCls = this.pClass(cls);
        const pTermCls = this.pTermCls(term, cls);
        // counter-probability
        const counterpCls = this.pClass(inverseCls);
        const counterpTermCls = this.pTermClass(term, inverseCls);

        return (pCls * pTermCls) / (pCls * pTermCls + counterpCls * counterpTermCls);
    }

    pTermClass(term, cls) {
        let termClsDocFreq, numClsDocs;

        if (cls === SPAM) {
            termClsDocFreq = this.spamTermDocFreq.has(term) ? this.spamTermDocFreq.get(term) : 0;
            numClsDocs = this.spamDocNum;
        } else {
            const spamDocFreq = this.spamTermDocFreq.has(term) ? this.spamTermDocFreq.get(term) : 0;
            termClsDocFreq = this.termDocFreq.has(term) ? this.termDocFreq.get(term) - spamDocFreq : 0;
            numClsDocs = this.docNum - this.spamDocNum;
        }

        return (termClsDocFreq + 1) / (numClsDocs + 2);
    }

    pClass(cls) {
        return cls === SPAM ? this.spamDocNum / this.docNum : (this.docNum - this.spamDocNum) / this.docNum;
    }

    pTerm(term) {
        const termDocFreq = this.termDocFreq.has(term) ? this.termDocFreq.get(term) : 0;
        return (termDocFreq + 1) / (this.docNum + 2);
    }

    isSpam(text) {
        return this.pClassText(SPAM, text) / this.pClassText(HAM, text) > 1 ? true : false;
    }

    termifyText(text) {
        const punctuationRegex = /[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g;
        const newLineRegex = /(\r\n|\n|\r)/gm;

        return text
            .replace(punctuationRegex, "")
            .replace(newLineRegex, " ")
            .toLowerCase()
            .split(" ")
            .filter(term => !stopwords.includes(term));
    }
}
