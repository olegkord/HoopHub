'use strict';

$(function(){

  let renderTemplate_show_user = Handlebars.compile($('template#user-template').html());
  let renderTemplate_create_user = Handlebars.compile($('template#new-user-template').html());
  let renderTemplate_edit_user = Handlebars.compile($('template#edit-user-template').html());

  let renderTemplate_show_player_profile = Handlebars.compile($('template#player-profile-template').html());
  let renderTemplate_show_player_stats = Handlebars.compile($('template#player-stats-template').html());
  let renderTemplate_show_player_updates = Handlebars.compile($('template#player-update-template').html());

  // =================================================================
  // Link Click Events ===============================================
  // =================================================================

    $('#create_user_button')((e) => {
      


    })




  // =================================================================
  // Render templates ================================================
  // =================================================================







  let resetUserView = () => {
    $('.user-profile-div').empty();
    $('.user-player-list-div').empty();
  }

  let resetPlayerView = () => {
    $('.player-profile-div').empty();
    $('.player-update-div').empty();
    $('.player-twtr-div').empty();
    $('.player-stats-div').empty();
  }

});
