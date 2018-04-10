const controller = require('./controller');

module.exports = function (app) {
    app.route('/refresh').get(controller.refresh);
    app.route('/todos').get(controller.todos);
    app.route('/fail').get(controller.fail);
};
