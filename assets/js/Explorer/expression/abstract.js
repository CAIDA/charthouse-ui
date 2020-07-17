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

class AbstractExpression {

    constructor(type) {
        /*
        AK comments 2019-02-15 because currently Uglify.js doesn't support this
        if (new.target === AbstractExpression) {
            throw new TypeError("Cannot directly create AbstractExpression objects. Use ExpressionFactory instead");
        }
        */
        this.type = type;
    }

    toString() {
        throw new TypeError('Expression objects cannot be implicitly converted to string.');
    }

    static checkJsonType(json, type) {
        if (!json) {
            throw new TypeError(`Malformed expression JSON`);
        }
        if (!has(json, 'type') || json.type !== type) {
            throw new TypeError(`Malformed expression JSON: expected type of '${type}', got '${json.type}`);
        }
    }

    _indentedStr(indent, str) {
        const INDENT_STR = '  ';
        return (indent >= 0 ? INDENT_STR.repeat(indent) : '') + str;
    }

    getType() {
        return this.type;
    }

    /**
     * Get an array of all of the sub-expressions of the given type
     *
     * If the type of this expression matches the type, it will be included in
     * the set.
     * This method should be overridden called recursively by expressions that
     * have sub expressions, and the results merged
     */
    getAllByType(type) {
        return type === this.type ? [this] : [];
    }

    // ABSTRACT METHODS:
    /**
     * Get the canonical representation of the expression.
     *
     * If indent is given, indent at the given level. An indent of 0 is a valid
     * indent. To explicitly disable indenting (and thus pretty-printing), pass
     * null or undefined.
     * @param indent
     */
    /*
    getCanonicalStr(indent);
    */

    /*
    getCanonicalHumanized();
    */

    /*
    getJson();
    */

    /*
    static createFromJson();
    */

    /*
    static createFromCanonicalStr();
    */

}

export default AbstractExpression;
