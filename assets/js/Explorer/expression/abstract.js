class AbstractExpression {

    // TODO: getJson

    // TODO: pretty-printed canonical
// TODO: handle creation from pretty-printed canonical
// TODO: handle appendExpression at a higher level
// TODO: expA.equals(expB)

    static INDENT_STR = '  ';

    constructor(type) {
        if (new.target === AbstractExpression) {
            throw "Cannot directly create AbstractExpression objects. Use ExpressionFactory instead";
        }
        this.type = type;
    }

    _indentedStr(indent, str) {
        return (indent !== null ? AbstractExpression.INDENT_STR.repeat(indent) : '') + str;
    }

    getType() {
        return this.type;
    }

    /**
     * Get an array of all of the sub-expressions of the given type
     *
     * If the type of this expression matches the type, it will be included in
     * the set.
     * This method should be overridden called recursively by expressions that
     * have sub expressions, and the results merged
     */
    getAllByType(type) {
        return type === this.type ? [this] : [];
    }

    /**
     * Get the canonical representation of the expression.
     *
     * If indent is given, indent at the given level. An indent of 0 is a valid
     * indent. To explicitly disable indenting (and thus pretty-printing), pass
     * null.
     * @param indent
     */
    getCanonicalStr(indent) {
        throw `Missing implementation of getCanonicalStr for ${this.type} expressions`;
    }

    getCanonicalHumanized() {
        throw `Missing implementation of getCanonicalHumanized for ${this.type} expressions`;
    }

    getJson() {
        throw `Missing implementation of getJson for ${this.type} expression`;
    }

    static createFromJson() {
        throw `Missing implementation of createFromJson for ${this.type} expressions`;
    }

    static createFromCanonicalStr() {
        throw `Missing implementation of createFromCanonical for ${this.type} expressions`;
    }

}

export default AbstractExpression;
