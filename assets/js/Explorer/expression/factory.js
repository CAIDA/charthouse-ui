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

import ConstantExpression from './constant';
import PathExpression from './path';
import FunctionExpression from './function';

class ExpressionFactory {

    static getExpressionClass(type) {
        const clz = {
            constant: ConstantExpression,
            path: PathExpression,
            function: FunctionExpression
        };
        return clz[type];
    }

    static createFromJson(json) {
        if (!json) {
            if (json === null) {
                return null;
            }
            throw new TypeError(`Cannot create expression from '${json}'`);
        }
        if (typeof json !== 'object') {
            // be generous, and try and detect if we've been given serialized JSON
            if (typeof json === 'string' && json.charAt(0) === '{') {
                json = JSON.parse(json);
            } else {
                throw new TypeError(`Invalid expression JSON: '${json}'`);
            }
        }
        if (!has(json, 'type')) {
            throw new TypeError('Invalid expression JSON: missing type field');
        }
        const expClz = ExpressionFactory.getExpressionClass(json.type);
        if (!expClz) {
            throw new TypeError(`Invalid expression JSON: unknown type: '${json.type}'`);
        }
        return expClz.createFromJson(json);
    }

    static createFromCanonicalStr(expStr) {
        expStr = expStr ? expStr.trim() : expStr;

        // null, undefined, ''
        if (!expStr) {
            throw new TypeError(`Invalid expression: Empty expression: '${expStr}'`);
        }

        // make all quotes double-quotes
        expStr = expStr.replace(/'/g, '"');

        function cntChr(haystack, regex) {
            return (haystack.match(regex) || []).length
        }

        // vasco code:
        const chunks = [];
        let carry = '';
        expStr.split(',').forEach(function (t) {
            carry += ((carry.length > 0 ? ',' : '') + t);
            // Remove quoted parts
            const noQuotes = carry.split('"').filter(function (_, i) {
                return i % 2 === 0;
            }).join('');
            if (!carry.trim().length) {
                // note that if we ever want to allow "null" args to be passed
                // then we'll have to change this
                // the problem is that currently would be ignored, instead of
                // being parsed to be e.g., a special null constant
                throw new TypeError('Invalid expression: Empty sub-expression');
            }
            if (cntChr(noQuotes, /\(/g) === cntChr(noQuotes, /\)/g)
                && cntChr(carry, /"/g) % 2 === 0) {
                chunks.push(carry);
                carry = '';
            }
        });

        if (carry.length > 0) {
            throw new TypeError(`Invalid expression: '${carry}'`);
        }

        if (chunks.length > 1) {
            // this is to support recursive function parsing
            // ideally we don't want users passing 'A, B, C'
            return chunks.map(chunk => {
                return ExpressionFactory.createFromCanonicalStr(chunk);
            });
        }

        expStr = chunks[0];

        const firstChr = expStr.charAt(0);
        const lastChr = expStr.charAt(expStr.length - 1);
        let type = 'path';
        if (firstChr === '"' || lastChr === '"' || !isNaN(expStr)) {
            type = 'constant';
        } else if (cntChr(expStr, /\(/g) !== 0 || cntChr(expStr, /\)/g) !== 0) {
            type = 'function';
        } // else: path
        const expClz = ExpressionFactory.getExpressionClass(type);
        return expClz.createFromCanonicalStr(expStr);
    }
}

export default ExpressionFactory;
