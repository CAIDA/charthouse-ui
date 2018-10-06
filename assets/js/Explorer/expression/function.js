import has from 'has';

import AbstractExpression from './abstract';

class FunctionExpression extends AbstractExpression {

    constructor(func, args) {
        super("function");
        this.func = func;
        this.args = args;
    }

    getFunc() {
        return this.func;
    }

    getArgs() {
        return this.args || [];
    }

    getAllByType(type) {
        let res = [];
        if (type === this.type) {
            res.push(this);
        }
        this.getArgs().forEach(arg => {
            res = res.concat(arg.getAllByType(type));
        });
        return res;
    }

    getCanonicalStr(indent) {
        const childIndent = (indent >= 0) ? indent + 1 : indent;
        const newLine = (indent >= 0 && this.getArgs().length > 0) ? '\n' : '';

        /*
         *  funcName(
         *    arg1,
         *    arg2,
         *  )
         */
        return this._indentedStr(indent, this.getFunc() + '(' + newLine)
            + this.getArgs().map(arg => {
                return arg.getCanonicalStr(childIndent);
            }).join(',' + newLine) + newLine
            + this._indentedStr(indent, ')');
    }

    getCanonicalHumanized() {
        return this.getFunc() + '('
            + this.getArgs().map(arg => {
                return arg.getCanonicalHumanized()
            }).join(',')
            + ')';
    }

    getJson() {
        return {
            type: this.type,
            func: this.func,
            args: this.getArgs().map(arg => {
                return arg.getJson();
            })
        }
    }

    static createFromJson(json, factory) {
        if (!has(json, 'func') || typeof json.func !== 'string') {
            throw 'Malformed function expression: missing/invalid func property';
        }
        if (!has(json, 'args')
            || typeof json.args !== 'object'
            || !Array.isArray(json.args)) {
            throw 'Malformed function expression: missing/invalid args property';
        }
        const argExps = json.args.map(arg => factory.createFromJson(arg));
        return new FunctionExpression(json.func, argExps);
    }

    static createFromCanonicalStr(expStr, factory) {
        expStr = expStr.replace(/\n/g, '').trim();

        const openCnt = (expStr.match(/\(/g) || []).length;
        const closeCnt = (expStr.match(/\)/g) || []).length;
        if (expStr.charAt(expStr.length - 1) !== ')' || openCnt !== closeCnt) {
            throw `Malformed function expression: '${expStr}'`;
        }
        if (expStr.charAt(0) === '(') {
            throw `Malformed function expression: missing function name: '${expStr}'`;
        }
        const pos = expStr.indexOf('(');
        const funcName = expStr.slice(0, pos);
        const argStr = expStr.substring(funcName.length, expStr.length - 1);
        const argExps = factory.createFromCanonicalStr(argStr);
        return new FunctionExpression(funcName, argExps);
    }
}

export default FunctionExpression;
