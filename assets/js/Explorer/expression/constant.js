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

class ConstantExpression extends AbstractExpression {

    constructor(value) {
        super("constant");
        if (typeof value === 'undefined') {
            throw new TypeError("ConstantExpression requires a value");
        }
        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new TypeError('ConstantExpression value must be string or number');
        }
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

    getJson() {
        return {
            type: 'constant',
            value: this.value,
            human_name: this.value
        }
    }

    static createFromJson(json) {
        AbstractExpression.checkJsonType(json, 'constant');
        if (!has(json, 'value')) {
            throw new TypeError("Malformed constant expression: missing value field");
        }
        return new ConstantExpression(json.value);
    }

    static createFromCanonicalStr(expStr) {
        if (typeof expStr !== 'string') {
            throw new TypeError('createFromCanonicalStr requires a string argument');
        }
        expStr = expStr.trim().replace(/'/g, '"');
        const quoteCnt = (expStr.match(/"/g) || []).length;

        if (quoteCnt === 0 && !isNaN(expStr)) {
            // numeric constant
            expStr = +expStr;
        } else if (quoteCnt === 2) {
            // string constant
            if (expStr.charAt(0) !== '"' || expStr.charAt(expStr.length - 1) !== '"') {
                throw new TypeError(`Malformed string constant: '${expStr}'`);
            }
            expStr = expStr.replace(/"/g, '');
        } else {
            // malformed (e.g., one quote character)
            throw new TypeError(`Malformed constant: '${expStr}'`);
        }
        return new ConstantExpression(expStr);
    }

}

export default ConstantExpression;
