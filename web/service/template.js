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

        let $template = $(this._templates[id].html());

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