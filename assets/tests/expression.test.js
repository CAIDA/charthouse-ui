import chai from 'chai';

import PathExpression from '../js/Explorer/expression/path';

describe("PathExpression", () => {
    const path = "a.test.path";

    const pe = new PathExpression(path);

    it("should have a type of 'path'", () => {
        chai.expect(pe.getType()).to.equal('path');
    });
});

