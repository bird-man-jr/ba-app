var App = {

  points: 0,
  seconds: 120,

  init: function() {
    App.recipesCollection = new App.RecipeCollection();
    App.recipes = new App.RecipesView();
    App.cards = new App.CardsView();
    App.renderScore();
    // App.timer();
    App.renderTimer();
  },

  restart: function() {
    App.cards.refreshView();
    App.recipes.refreshView();

  },

  renderScore: function() {
    $('#display_score').text(String(App.points));
  },

  renderTimer: function() {
    $('#display_time').text(String(App.seconds));
  },

  timer: function() {

    window.setInterval(function(){

    App.seconds -= 1;

    App.renderTimer();

    if (App.seconds == 0) {
        window.clearInterval(App.timer);
        alert("Timer finished");
    }

    }, 1000);

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
      var text = $(card).text();
      $(card).html("<br><br><br>");
      $(card).addClass('card-removed');
      $(e.target).parent().find('.select-icon').addClass('select-icon-checked');
      $(e.target).parent().find('.recipe-text').addClass('recipe-text-checked');
      $(e.target).parent().find('.recipe-text').text(text);
      App.points += 10;
      App.renderScore();
    } else {
      App.points -= 5;
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
