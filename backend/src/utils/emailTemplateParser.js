const ejs = require('ejs');

const parseTemplate = (template, data) => {
    return ejs.render(template, data);
};

const parseMultipleTemplates = (templates, data) => {
    return templates.map(template => parseTemplate(template, data));
};

module.exports = {
    parseTemplate,
    parseMultipleTemplates
};