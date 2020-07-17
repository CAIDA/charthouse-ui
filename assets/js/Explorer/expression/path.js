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

import AbstractExpression from './abstract';

class PathExpression extends AbstractExpression {

    constructor(path, humanPath) {
        super("path");
        if (!path || typeof path !== 'string') {
            throw new TypeError(`Missing/invalid path parameter: '${path}'`);
        }
        if (typeof humanPath !== 'undefined'
            && (humanPath && typeof humanPath !== 'string')
            || humanPath === '') {
            throw new TypeError(`Invalid humanPath parameter: '${humanPath}'`);
        }
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

    getJson() {
        return {
            type: this.type,
            path: this.path,
            human_name: this.humanPath
        };
    }

    static createFromJson(json) {
        AbstractExpression.checkJsonType(json, 'path');
        return new PathExpression(json.path, json.human_name);
    }

    static createFromCanonicalStr(expStr) {
        return new PathExpression(expStr);
    }

}

export default PathExpression;
