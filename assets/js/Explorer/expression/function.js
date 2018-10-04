import has from 'has';

import AbstractExpression from './abstract';

class FunctionExpression extends AbstractExpression {

    constructor(func, args) {
        super("function");
        this.func = func;
        this.args = args; // may be null
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
        const childIndent = (indent !== null) ? indent + 1 : indent;
        const newLine = (indent !== null) ? '\n' : '';

        /*
         *  funcName(
         *    arg1,
         *    arg2,
         *  )
         */
        return this._indentedStr(
            indent,
            this.getFunc() + '(' + newLine
            + this.args.map(arg => {
                return arg.getCanonicalStr(childIndent);
            }) + newLine
            + indent + ')'
        );
    }

    getCanonicalHumanized() {
        return this.getFunc() + '(' + this.getArgs().map(arg => {
            arg.getCanonicalHumanized()
        }) + ')';
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
