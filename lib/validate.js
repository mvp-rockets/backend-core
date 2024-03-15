const validate = (rule, data) => {
    const error = [];
    Object.keys(rule).forEach((item) => {
        const ruleValue = rule[item];
        ruleValue.forEach((ruleVal) => {
            if (!ruleVal[0](data[item], data)) {
                error.push(ruleVal[1]);
            }
        });
    });
    return { error };
};
module.exports.validate = validate;
