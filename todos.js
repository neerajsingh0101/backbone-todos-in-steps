$(function(){

  window.AppView = Backbone.View.extend({
    el: $("#todoapp"),

    events: {
      "keyup #new-todo": "showTooltip"
    },

    initialize: function(){
      this.input = this.$("#new-todo");
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
