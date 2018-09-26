var ExpressionObj = function (json) {
    this.json = null;
    this.setJson(json);
};

// factory methods
ExpressionObj.fromCanonical = function (txt) {
    var exp = new ExpressionObj();
    exp.setCanonicalTxt(txt);
    return exp;
};

ExpressionObj.prototype.getJson = function () {
    return this.json;
};

ExpressionObj.prototype.setJson = function (json) {
    validate(json);
    this.json = json;
};

ExpressionObj.prototype.getSerialJson = function () {
    if (this.json == null) return '';

    if (typeof this.json == "string") return this.json; // It's already a single string

    if (typeof this.json == "object" && this.json.type == "path")
        return this.json.path;                          // Return single paths as string

    return JSON.stringify(this.json).replace(/\\\\/g, '\\'); // Don't escape backslashes
};

ExpressionObj.prototype.setSerialJson = function (txt) {
    if (txt == null) {
        this.setJson(null);
        return;
    }
    txt = txt.trim();
    this.setJson(
        (!txt.match(/^[\[\{]/))
            ? txt  // If it's already a single string
            : JSON.parse(txt.replace(/\\/g, '\\\\'))
    );
};

// Returns a pretty-printed version of the canonical expression format
ExpressionObj.prototype.getCanonicalTxt = function () {
    return json2Canonical(this.getJson());
};

// Returns the canonical expression format
ExpressionObj.prototype.getCanonicalStr = function () {
    return json2Canonical(this.getJson(), -1);
};

ExpressionObj.prototype.setCanonicalTxt = function (txt) {
    this.setJson(canonical2Json(txt));
};

// Append another expression to this one
ExpressionObj.prototype.appendExpression = function (exp) {
    if (!exp) return;

    this.json = (this.json == null)
        ? exp.getJson()
        : ((this.json instanceof Array) ? this.json : [this.json])
            .concat([exp.getJson()]);
};

// Returns an array with all the metrics found at any level in the expression
ExpressionObj.prototype.getAllMetrics = function () {

    var pathSet = {};

    dfsGetMetrics(this.json).forEach(function (pathObj) {
        pathSet[pathObj.path] = true;
    });

    return Object.keys(pathSet);

    function dfsGetMetrics(expNode) {
        var paths = [];
        ($.isArray(expNode) ? expNode : [expNode]).forEach(function (node) {
            if (!node) return;

            if (typeof node === 'string')
                paths.push({
                    type: 'path',
                    path: node
                });

            if (node.type == 'path') {
                paths.push(node);
            }
            if (node.type == 'function') {
                paths.push.apply(paths, dfsGetMetrics(node.args));
            }
        });
        return paths;
    }
};

ExpressionObj.prototype.equals = function (anotherExp) {
    return this.getSerialJson() == anotherExp.getSerialJson();
};

////

// Will throw exception if json is not in valid format
function validate(json) {
    if (json == null || typeof json == "string") return;

    if ($.isArray(json)) {
        return json.map(validate);
    }

    // Obj
    if (!json.hasOwnProperty('type'))
        throw "Missing mandatory type in structure: " + json;

    switch (json.type) {
        case 'constant':
            if (!json.hasOwnProperty('value') || (isNaN(json.value) && typeof json.value != "string"))
                throw "Invalid or non-existing value in constant obj: " + json;
            break;
        case 'path':
            if (!json.hasOwnProperty('path') || typeof json.path != "string")
                throw "Invalid or non-existing path txt in path obj: " + json;
            break;
        case 'function':
            if (!json.hasOwnProperty('func') || typeof json.func != "string")
                throw "Invalid or non-existing func in function obj: " + json;
            if (!json.hasOwnProperty('args'))
                throw "Missing args in function obj: " + json;
            return forceArray(json.args).map(validate);
        default:
            throw "Unrecognised object type " + json.type + " in " + json;
    }
}

// if indentCnt is -1, then indenting and newlines are turned off
function json2Canonical(json, indentCnt) {
    if (json == null) return '';

    indentCnt = indentCnt || 0;
    var indent = Array(indentCnt + 1).join('  ');
    var childIndent = indentCnt >= 0 ? indentCnt + 1 : indentCnt;
    var newLine = indentCnt >= 0 ? '\n' : '';

    if (!json || typeof json == "string") {
        return indent + json;
    }

    if ($.isArray(json)) {
        return json
            .map(function (d) {
                return json2Canonical(d, indentCnt);
            })
            .join(',' + newLine);
    }

    // Obj
    switch (json.type) {
        case 'constant':
            return indent + (isNaN(json.value) ? ('"' + json.value + '"') : json.value);
        case 'path':
            return indent + json.path;
        case 'function':
            return indent + json.func + '(' + newLine +
                forceArray(json.args)
                    .map(function (d) {
                        return json2Canonical(d, childIndent);
                    })
                    .join(',' + newLine) + newLine + indent + ')';
    }

}

function canonical2Json(txt) {
    if (txt == null || txt.trim() == '') return null;

    txt = txt.trim().replace(/\'/g, '"'); // Make all quotes double-quotes

    var chunks = [];
    var carry = '';
    txt.split(',').forEach(function (t) {
        carry += ((carry.length ? ',' : '') + t);
        // Remove quoted parts
        var noQuotes = carry.split('"').filter(function (_, i) {
            return i % 2 == 0;
        }).join('');
        if (carry.trim().length
            && cntChr(noQuotes, '(') == cntChr(noQuotes, ')')
            && cntChr(carry, '"') % 2 == 0) {
            chunks.push(carry);
            carry = '';
        }
    });

    if (carry.length) throw "Malformed expression: " + carry;

    if (chunks.length > 1) { // List of items
        return chunks.map(canonical2Json);
    }

    txt = chunks[0];

    var firstCh = txt.charAt(0);
    var lastCh = txt.charAt(txt.length - 1);

    if (firstCh == '"' || lastCh == '"') { // String
        if (firstCh != lastCh || cntChr(txt, '"') != 2) throw "Malformed String: " + txt;
        return {
            type: 'constant',
            value: txt.replace(/\"/g, '')
        }
    }

    if (!isNaN(txt)) { // Number
        return {
            type: 'constant',
            value: parseFloat(txt)
        }
    }

    if (txt.indexOf('(') != -1 || txt.indexOf(')') != -1) { // Function
        if (lastCh != ')' || cntChr(txt, '(') != cntChr(txt, ')')) throw "Malformed function: " + txt;
        if (firstCh == '(') throw "Missing function name: " + txt;

        var funcName = txt.split('(')[0];
        var args = txt.substring(0, txt.length - 1).replace(funcName + '(', ''); // Remove trailing ')'

        return {
            type: 'function',
            func: funcName,
            args: forceArray(canonical2Json(args))
        };
    }

    // Only option left, must be a path
    return {
        type: 'path',
        path: txt
    };

    // Counts number of chr occurrences within str
    function cntChr(str, chr) {
        return str.split(chr).length - 1;
    }

}

function forceArray(items) {
    return $.isArray(items) ? items : [items];
}

export default ExpressionObj;
