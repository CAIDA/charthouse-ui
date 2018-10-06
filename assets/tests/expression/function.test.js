import chai from 'chai';

import FunctionExpression from '../../js/Explorer/expression/function';
import PathExpression from "../../js/Explorer/expression/path";

const type = 'function';

function testFunction(e, func, canonical, canonicalPretty, canonicalHuman, argJson) {
    it(`should have a type of '${type}'`, () => {
        chai.expect(e.getType()).to.equal(type);
    });

    it(`should have a func matching ${func}`, () => {
        chai.expect(e.getFunc()).to.equal(func);
    });

    it(`should have a canonical format matching ${canonical}`, () => {
        chai.expect(e.getCanonicalStr()).to.equal(canonical);
    });

    it("should correctly indent the canonical format string", () => {
        chai.expect(e.getCanonicalStr(0)).to.equal(canonicalPretty);
    });

    it("should have a canonical humanized format matching the value", () => {
        chai.expect(e.getCanonicalHumanized()).to.equal(canonicalHuman);
    });

    it("should give correct JSON", () => {
        chai.expect(e.getJson()).to.deep.include({
            type,
            func,
            args: argJson
        });
    });

    it("should fail when implicitly converted to string", () => {
        chai.expect(() => {
            return '' + e;
        }).to.throw();
    });

    it(`should return at least itself to getAllByType('${type}')`, () => {
        chai.expect(e.getAllByType(type)).to.include(e);
    });
}

const testFunc = 'sumSeries';

describe("FunctionExpression direct constructor (no args)", () => {
    const canon = `${testFunc}()`;
    const fe = new FunctionExpression(testFunc);
    testFunction(fe, testFunc, canon, canon, canon, []);

    it('should return no children of type "constant"', () => {
        chai.expect(fe.getAllByType('constant')).to.eql([]);
    });
});

const testPath = 'a.test.path';
const testPathHuman = 'A > Human > Path';
const pe = new PathExpression(testPath, testPathHuman);

describe("FunctionExpression direct constructor (path arg)", () => {

    const canon = `${testFunc}(${testPath})`;
    const canonPretty = `${testFunc}(\n  ${testPath}\n)`;
    const canonHuman = `${testFunc}(${testPathHuman})`;

    const fe = new FunctionExpression(testFunc, [pe]);
    testFunction(fe, testFunc, canon, canonPretty, canonHuman, [pe.getJson()]);
    it('should return the correct path expression to getAllByType("path")', () => {
        chai.expect(fe.getAllByType('path')).to.eql([pe]);
    });

    // TODO: multiple path args
    // TODO: const arg
    // TODO: func arg (no args, single arg, multi args)
});
