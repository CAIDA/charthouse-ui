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
            return e.getCanonicalStr(indent);
        }).join(indent ? ',\n' : ',');
    }

    static createFromCanonicalStr(expStr) {
        const set = new ExpressionSet();
        ExpressionFactory.createFromCanonicalStr(expStr).forEach(e => {
            set.addExpression(e);
        });
        return set;
    }

    static createFromJsonArray(jsonArray) {
        if (!Array.isArray(jsonArray)) {
            if (typeof jsonArray === 'string' && jsonArray.charAt(0) === '[') {
                jsonArray = JSON.parse(jsonArray);
            } else {
                throw new TypeError('expression parameter must be an array');
            }
        }
        const set = new ExpressionSet();
        jsonArray.forEach(j => {
            set.addExpression(ExpressionFactory.createFromJson(j));
        });
        return set;
    }
}

export default ExpressionSet;
