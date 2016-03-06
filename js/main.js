var App = {

  init: function() {
    new App.RecipesView();
  }

};

// Models
App.Recipe = Backbone.Model.extend();

App.RecipeCollection = Backbone.Collection.extend({
  model: App.Recipe,
  url: "https://ba-js-test.herokuapp.com/api/menu_next_week",
  parse: function (response) {
    console.log('parsing ...');
    return response.two_person_plan.recipes;
  }
});

// Views
App.RecipesView = Backbone.View.extend({

  initialize: function () {
      this.collection = new App.RecipeCollection();
      _.bindAll(this, 'render');
      var that = this;
      this.collection.fetch({
        success: function (response) {
            that.render(response.models);
        }
      });
  },

  render:function (model) {
      _.each(model, function (recipe) {
        console.log("passed");
        console.log(recipe);
        new App.RecipeView({model:recipe}).render();
        new App.CardView({model:recipe}).render();
      }, this);

  }

});

App.RecipeView = Backbone.View.extend({

  tagName: 'div',

  template:_.template($('#tpl-recipe-item').html()),

  render:function () {
    $('#recipes').append(this.template(this.model.attributes.recipe));
    return this;
  }

});

App.CardView = Backbone.View.extend({

  tagName: 'div',

  template:_.template($('#tpl-card-item').html()),

  render:function () {
    $('#cards').append(this.template(this.model.attributes.recipe));
    return this;
  }

});

App.init();
