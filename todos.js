$(function(){


  window.Todo = Backbone.Model.extend({
    defaults: {
      content: "empty todo ...",
      done: false
    },

    initialize: function(){
      if (!this.get('content')){
        this.set({"content": this.defaults.content});
      }
    },

    toggle: function(){
      this.save({done: !this.get('done')});
    }
  });

  window.TodoList = Backbone.Collection.extend({
    model: Todo,

    localStorage: new Store("todos"),

    done: function(){
      return this.filter(function(todo){ return todo.get('done'); });
    },

    remaining: function(){
      return this.without.apply(this, this.done());
    }
  });

  window.Todos = new TodoList;

  window.TodoView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#item-template').html()),

    events: {
      "click .check": "toggleDone",
      "dblclick div.todo-content": "edit",
      "click span.todo-destroy": "clear",
      "keypress .todo-input": "updateOnEnter"
    },

    initialize: function(){
      this.model.view = this;
      this.model.bind("change", this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
      this.setContent();
      return this;
    },

    setContent: function(){
      var content = this.model.get('content');
      this.$('.todo-content').text(content);
      this.input = this.$('.todo-input');
      this.input.bind('blur', _.bind(this.close, this));
      this.input.val(content);
    },

    toggleDone: function(){
      this.model.toggle();
    },

    edit: function(){
      $(this.el).addClass('editing');
      this.input.focus();
    },

    close: function(){
      this.model.save({content: this.input.val()});
      $(this.el).removeClass('editing');
    },

    updateOnEnter: function(e){
      if (e.keyCode == 13) this.close();
    },

    remove: function(){
      $(this.el).remove();
    },

    clear: function(){
      this.model.destroy();
    }
  });

  window.AppView = Backbone.View.extend({
    el: $("#todoapp"),

    statsTemplate: _.template($('#stats-template').html()),

    events: {
      "keypress #new-todo": "createOnEnter",
      "keyup #new-todo": "showTooltip"
    },

    initialize: function(){
      this.input = this.$("#new-todo");

      Todos.bind('add', this.addOne, this);
      Todos.bind('reset', this.addAll, this);
      Todos.bind('all', this.render, this);

      Todos.fetch();
    },

    render: function(){
      this.$('#todo-stats').html(this.statsTemplate({
        remaining: Todos.remaining().length,
        total: Todos.length,
        done: Todos.done().length
      }));
    },

    addOne: function(todo){
      var view = new TodoView({model: todo});
      this.$('#todo-list').append(view.render().el);
    },

    addAll: function(){
      Todos.each(this.addOne);
    },

    newAttributes: function(){
      return {
        content: this.input.val(),
        done: false
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
