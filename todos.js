$(function(){


  window.Todo = Backbone.Model.extend({
    defaults: {
      content: "empty todo ..."
    },

    initialize: function(){
      if (!this.get('content')){
        this.set({"content": this.defaults.content});
      }
    }
  });

  window.TodoList = Backbone.Collection.extend({
    model: Todo,

    localStorage: new Store("todos")
  });

  window.Todos = new TodoList;

  window.AppView = Backbone.View.extend({
    el: $("#todoapp"),

    events: {
      "keypress #new-todo": "createOnEnter",
      "keyup #new-todo": "showTooltip"
    },

    initialize: function(){
      this.input = this.$("#new-todo");

      Todos.bind('add', this.addOne, this);
    },

    addOne: function(){
      console.log('display the newly added todo item')
    },

    newAttributes: function(){
      return {
        content: this.input.val()
      }
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());
      this.input.val('');
    },

    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function() { tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    }
  });

  window.app = new AppView;

});
