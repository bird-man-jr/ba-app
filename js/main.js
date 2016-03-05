var app = {

  init: function() {

  }

  // Models
  app.Recipe = Backbone.Model.extend();

  app.RecipeCollection = Backbone.Collection.extend({
    model: Recipe,
    url: "https://ba-js-test.herokuapp.com/api/menu_next_week",
    parse: function (response) {
      return response.recipes;
    }

    console.log(RecipeCollection[0]);

  });

  // Views
  app.RecipesView = Backbone.View.extend({

    initialize:function () {
          this.model.bind("reset", this.render, this);
      },

      render:function (eventName) {
          _.each(this.model.models, function (recipe) {
              $(this.el).append(new RecipeView({model:recipe}).render().el);
          }, this);
          return this;
      }

  });

  app.RecipeView = Backbone.View.extend({

    template:_.template($('#tpl-recipe-item').html()),

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

  });

};

App.init();
