const AbstractService = require('../abstract-service');

class TemplateService extends AbstractService {

    constructor() {
        super();

        this._templates = {};

        $('template').each(function(t, template) {

            let $template = $(template);
            let id = $template.attr('id');

            this._templates[id] = $template;
        }.bind(this));
    }

    getTemplate(id, entity) {

        if('undefined' === typeof this._templates[id]) throw new Error('template with id ' + id + ' does not exist.');

        let $template = $(this._templates[id].html());

        let dataAttributes = $template.data();

        for(let attributeName in dataAttributes) {

            let value = null;

            if(entity[attributeName]) {
                value = entity[attributeName];
            }

            $template.attr('data-' + attributeName, value);
        }

        $template.find('[data-attribute]').each(function(a, attribute) {
            let $attributeElement = $(attribute);
            let attributeName = $attributeElement.attr('data-attribute');

            if(entity[attributeName]) {
                $attributeElement.html(entity[attributeName]);
            }

        });

        return $template;
    }
}

module.exports = TemplateService;