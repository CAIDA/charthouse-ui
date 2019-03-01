import d3 from "d3";

function humanizeBytes(bytes) {
    return humanizeNumber(bytes) + 'B';
}

function humanizeNumber(value, precisionDigits) {
    precisionDigits = precisionDigits || 3;
    return d3.format(
            (isNaN(precisionDigits) ? '' : '.' + precisionDigits)
            + ((Math.abs(value) < 1) ? 'r' : 's')
        )(value);
}

export {humanizeBytes, humanizeNumber};
