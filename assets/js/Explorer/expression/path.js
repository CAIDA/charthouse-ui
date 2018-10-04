import has from 'has';

import AbstractExpression from './abstract';

class PathExpression extends AbstractExpression {

    constructor(path, humanPath) {
        super("path");
        this.path = path;
        this.humanPath = humanPath;
    }

    getPath() {
        return this.path;
    }

    getCanonicalStr(indent) {
        return this._indentedStr(indent, this.getPath());
    }

    getCanonicalHumanized() {
        return this.humanPath || this.getPath();
    }

    static createFromJson(json) {
        if (!has(json, "path") || typeof json.path !== "string") {
            throw "Malformed path expression";
        }
        return new PathExpression(json.path, json.human_name);
    }

    static createFromCanonicalStr(expStr) {
        return new PathExpression(expStr);
    }

}

export default PathExpression;
