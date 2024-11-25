function Calculator() {

}

Calculator.add = function (...nums) {
    return nums.reduce((sum, item) => sum + item, 0);
}

Calculator.subtract = function (minuend, ...nums) {
    const subtrahend = nums.reduce((sum, item) => sum + item, 0);
    return (minuend ?? 0) - subtrahend;
}

Calculator.multiply = function (...nums) {
    if (nums.length === 0) return 0;
    return nums.reduce((product, item) => product + item, 1);
}

Calculator.divide = function (divident, divisor) {
    return divident / divisor;
}

Calculator.operate = function(term1, operator, term2) {
    switch (operator) {
        case '+':
            return Calculator.add(term1, term2);
        case '-':
            return Calculator.subtract(term1, term2);
        case '*':
            return Calculator.multiply(term1, term2);
        case '/':
            return Calculator.divide(term1, term2);
        default:
            throw new Error('Unsupported operation');
    }
}