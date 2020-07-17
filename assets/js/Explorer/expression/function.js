/*
 * This software is Copyright (c) 2013 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

import has from 'has';

import AbstractExpression from './abstract';
import ExpressionFactory from "./factory";

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
            }).join(',' + (newLine || ' ')) + newLine
            + this._indentedStr(this.getArgs().length > 0 ? indent : 0, ')');
    }

    getCanonicalHumanized() {
        return this.getFunc() + '('
            + this.getArgs().map(arg => {
                return arg.getCanonicalHumanized()
            }).join(', ')
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

    static createFromJson(json) {
        AbstractExpression.checkJsonType(json, 'function');
        if (!has(json, 'func') || typeof json.func !== 'string' || !json.func) {
            throw new TypeError('Malformed function expression: missing/invalid func property');
        }
        if (!has(json, 'args')
            || typeof json.args !== 'object'
            || !Array.isArray(json.args)) {
            throw new TypeError('Malformed function expression: missing/invalid args property');
        }
        const argExps = json.args.map(arg => ExpressionFactory.createFromJson(arg));
        return new FunctionExpression(json.func, argExps);
    }

    static createFromCanonicalStr(expStr) {
        if (!expStr) {
            throw new TypeError('Malformed function expression: Empty expression string');
        }
        if (typeof expStr !== 'string') {
            throw new TypeError(`Malformed function expression: '${expStr}' is not a string`);
        }
        expStr = expStr.replace(/\n/g, '').trim();

        const openCnt = (expStr.match(/\(/g) || []).length;
        const closeCnt = (expStr.match(/\)/g) || []).length;
        if (expStr.charAt(expStr.length - 1) !== ')' || openCnt !== closeCnt) {
            throw new TypeError(`Malformed function expression: '${expStr}'`);
        }
        if (expStr.charAt(0) === '(') {
            throw new TypeError(`Malformed function expression: missing function name: '${expStr}'`);
        }
        const pos = expStr.indexOf('(');
        const funcName = expStr.slice(0, pos);
        const argStr = expStr.substring(funcName.length+1, expStr.length - 1);
        const argExps = argStr ? ExpressionFactory.createFromCanonicalStr(argStr) : [];

        return new FunctionExpression(funcName,
            Array.isArray(argExps) ? argExps : [argExps]);
    }
}

export default FunctionExpression;
