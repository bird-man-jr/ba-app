var App = {

  config: {
    points: 0,
    seconds: 20,
    num_recipes: 6
  },


  init: function() {
    App.recipesCollection = new App.RecipeCollection();
    App.recipes = new App.RecipesView();
    App.cards = new App.CardsView();
    App.timer = window.setInterval(App.interval_iterator, 1000);
    App.renderScore();
    // App.timer();
    App.renderTimer();
  },

  restart: function() {
    App.cards.refreshView();
    App.recipes.refreshView();
    window.clearInterval(App.timer);
    App.config.seconds = 120;
    App.config.points = 0;
    App.renderScore();
    App.timer = window.setInterval(App.interval_iterator, 1000);
    App.renderTimer();

  },

  endgame: function() {
    window.clearInterval(App.timer);
    $('#recipes').addClass('inactive');
    $('.card').addClass('inactive');
  },

  renderScore: function() {
    $('#display_score').text(String(App.config.points));
  },

  renderTimer: function() {
    $('#display_time').text(String(App.config.seconds));
  },

  interval_iterator: function() {
    App.config.seconds -= 1;
    App.renderTimer();
    if (App.config.seconds == 0) {
        App.endgame();
    }
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

  el: '#recipes',
  tagName: "div",
  className: "recipe",

  initialize: function () {
      this.collection = App.recipesCollection;
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
        $(this.el).append(new App.RecipeView({model:recipe}).render().el);
      }, this);
  },

  refreshView: function() {
    this.$el.empty().off();
    this.stopListening();
    this.initialize();
  }

});

App.RecipeView = Backbone.View.extend({

  num_recipes: App.config.recipes,

  template:_.template($('#tpl-recipe-item').html()),

  events: {
   'dragenter .recipe' : 'dragEnterHandler',
   'dragover .recipe' : 'dragOverHandler',
   'dragleave .recipe' : 'dragLeaveHandler',
   'drop .recipe' : 'dropHandler'
  },

  dragEnterHandler: function(e) {
    e.preventDefault();
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
    var targetId = $(e.target).attr('data-product-id');
    var itemDragged = e.originalEvent.dataTransfer.getData("text/plain");
    if (targetId === itemDragged) {
      var card = $("div .card[data-product-id='" + targetId +"']");
      var text = $(card).html();
      $(card).text("");
      $(card).addClass('card-removed');
      $(e.target).parent().find('.select-icon').addClass('select-icon-checked');
      $(e.target).parent().find('.recipe-text').addClass('recipe-text-checked');
      $(e.target).parent().find('.recipe-text').html(text);
      App.config.points += 10;
      App.renderScore();
      App.config.num_recipes -= 1;
      if(!App.config.num_recipes){App.endgame()};
    } else {
      App.config.points -= 5;
      App.renderScore();
      $(e.target).parent().find('.select-icon').addClass('select-icon-x');
    };
    $(e.target).removeClass('selected');
    e.stopPropagation();
    return false;
  },

  render:function () {
    $(this.$el).html(this.template(this.model.attributes.recipe));
    return this;
  }

});

App.CardsView = Backbone.View.extend({

  el: '#cards',
  tagName: "div",
  className: "card",

  initialize: function () {
      this.collection = App.recipesCollection;
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
        $(this.el).append(new App.CardView({model:recipe}).render().el);
      }, this);
  },

  refreshView: function() {
    this.$el.empty().off();
    this.stopListening();
    this.initialize();
  }

});


App.CardView = Backbone.View.extend({

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
    $(this.$el).html(this.template(this.model.attributes.recipe));
    return this;
  }

});


App.init();
