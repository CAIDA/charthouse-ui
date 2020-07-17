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

import ExpressionFactory from './factory';
import AbstractExpression from './abstract';

class ExpressionSet {

    constructor() {
        this.expressions = {};
    }

    getSize() {
        return Object.keys(this.expressions).filter(ex => {
            return this.getExpression(ex);
        }).length;
    }

    getExpression(canonicalStr) {
        return this.expressions[canonicalStr];
    }

    getExpressions() {
        return Object.values(this.expressions);
    }

    addExpression(expression) {
        if (!(expression instanceof AbstractExpression)) {
            throw new TypeError('Item is not an AbstractExpression instance');
        }
        const canon = expression.getCanonicalStr();
        if (!has(this.expressions, canon) || !this.expressions[canon]) {
            this.expressions[canon] = expression;
        }
    }

    removeExpression(expression) {
        this.expressions[expression.getCanonicalStr()] = undefined;
    }

    toJsonArray() {
        return this.getExpressions().map(e => {
            return e.getJson();
        });
    }

    toSerialJson() {
        return JSON.stringify(this.toJsonArray());
    }

    equals(that) {
        return (this === that || this.toSerialJson() === that.toSerialJson());
    }

    getAllByType(type) {
        let exps = [];
        this.getExpressions().forEach(e => {
            exps = exps.concat(e.getAllByType(type));
        });
        return exps;
    }

    getCanonicalStr(indent) {
        return this.getExpressions().map(e => {
            return e.getCanonicalStr(0);
        }).join(indent ? ',\n' : ',');
    }

    static createFromCanonicalStr(expStr) {
        const set = new ExpressionSet();
        const exps = ExpressionFactory.createFromCanonicalStr(expStr);
        if (Array.isArray(exps)) {
            exps.forEach(set.addExpression);
        } else {
            set.addExpression(exps);
        }
        return set;
    }

    static createFromJsonArray(jsonArray) {
        const set = new ExpressionSet();
        if (!Array.isArray(jsonArray)) {
            if (!jsonArray) {
                return set;
            } else if (typeof jsonArray === 'string' && jsonArray.charAt(0) === '[') {
                jsonArray = JSON.parse(jsonArray);
            } else {
                throw new TypeError('expression parameter must be an array');
            }
        }
        jsonArray.forEach(j => {
            set.addExpression(ExpressionFactory.createFromJson(j));
        });
        return set;
    }
}

export default ExpressionSet;
