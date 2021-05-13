export default class SpamFilter {
    constructor(sourceFilename) {
        // TODO: Read the file so it can be used as training data for spam classification.
    }

    pTextClass(text, cls) {
        // TODO: Implement P(text, class)
    }

    pClassText(cls, text) {
        // TODO: Implement P(class, text)
    }

    pClassTerm(cls, term) {
        // TODO: Implement P(class, term)
    }
    pTermClass(term, cls) {
        // TODO: Implement P(class, term)
    }

    pClass(cls) {
        // TODO: Implement P(class)
    }

    pTerm(term) {
        // TODO: Implement P(term)
    }

    isSpam(text) {
        // TODO: Implement spam classification
    }
}
