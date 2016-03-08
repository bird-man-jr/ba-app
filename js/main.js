var App = {

  points: 0,
  seconds: 120,

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
        new App.RecipeView({model:recipe}).render();
        new App.CardView({model:recipe}).render();
      }, this);

  }

});

App.RecipeView = Backbone.View.extend({

  el: '#recipes',

  tagName: 'div',

  template:_.template($('#tpl-recipe-item').html()),

  events: {
   'dragenter .recipe' : 'dragEnterHandler',
   'dragover .recipe' : 'dragOverHandler',
   'dragleave .recipe' : 'dragLeaveHandler',
   'drop .recipe' : 'dropHandler'
  },

  dragEnterHandler: function(e) {
    e.preventDefault();
    $(e.target).addClass('selected');
    return false;
  },

  dragOverHandler: function(e) {
    e.preventDefault();
    return false;
  },

  dragLeaveHandler: function(e) {
    $(e.target).removeClass('selected');
  },

  dropHandler: function(e) {
    e.preventDefault();
    var targetId = $(e.target).parent().attr('data-product-id');
    var itemDragged = e.originalEvent.dataTransfer.getData("text/plain");
    if (targetId === itemDragged) {

    };
    $(e.target).removeClass('selected');
    return false;
  },

  render:function () {
    $(this.$el).append(this.template(this.model.attributes.recipe));
    return this;
  }

});

App.CardView = Backbone.View.extend({

  el: '#cards',

  tagName: 'div',

  template: _.template($('#tpl-card-item').html()),

  events: {
   'dragstart .card' : 'dragStartHandler'
  },

  dragStartHandler: function(e) {
    var itemDragged = $(e.target).attr('data-product-id');
    event.dataTransfer.setData('text/plain', itemDragged);
  },

  render:function () {
    $(this.$el).append(this.template(this.model.attributes.recipe));
    return;
  }

});

App.init();
