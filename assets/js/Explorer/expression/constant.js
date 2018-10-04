import has from 'has';

import AbstractExpression from './abstract';

class ConstantExpression extends AbstractExpression {

    constructor(value) {
        super("constant");
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getCanonicalStr(indent) {
        return this._indentedStr(indent,
            (typeof this.value === 'string' ? '"' + this.value + '"' : this.value.toString()));
    }

    getCanonicalHumanized() {
        return this.getCanonicalStr();
    }

    static createFromJson(json) {
        if (!has(json, "value")
            || (isNaN(json.value) && typeof json.value !== "string")) {
            throw "Malformed constant expression: missing value field";
        }

        return new ConstantExpression(json.value);
    }

    static createFromCanonicalStr(expStr) {
        expStr = expStr.trim();
        const quoteCnt = (expStr.match(/"/g) || []).length;

        if (quoteCnt === 0 && !isNaN(expStr)) {
            // numeric constant
            expStr = +expStr;
        } else if (quoteCnt === 2) {
            // string constant
            if (expStr.charAt(0) !== '"' || expStr.charAt(expStr.length - 1) !== '"') {
                throw `Malformed string constant: '${expStr}'`;
            }
            expStr = expStr.replace(/"/g, '');
        } else {
            // malformed (e.g., one quote character)
            throw `Malformed constant: '${expStr}'`;
        }
        return new ConstantExpression(expStr);
    }

}

export default ConstantExpression;
