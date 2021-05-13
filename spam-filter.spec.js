import SpamFilter from "./spam-filter";

describe("SpamFilter", () => {
    let spamFilter;

    beforeAll(() => {
        spamFilter = new SpamFilter("data.txt");
    });

    it("detects spam", () => {
        expect(spamFilter.isSpam("free nokia mobile")).toBe(true);
    });

    it("detects ham", () => {
        expect(spamFilter.isSpam("friend world")).toBe(false);
    });

    it("is not confused by unknown spam words", () => {
        expect(spamFilter.isSpam("free friend later")).toBe(false);
    });

    it("ignores unknown words", () => {
        expect(spamFilter.isSpam("blubbergurken nokia")).toBe(true);
    });
});
