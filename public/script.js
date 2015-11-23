'use strict';

$(function(){

  let renderTemplate_show_user = Handlebars.compile($('template#user-template').html());
  let renderTemplate_create_user = Handlebars.compile($('template#new-user-template').html());
  let renderTemplate_edit_user = Handlebars.compile($('template#edit-user-template').html());

  let renderTemplate_show_player_profile = Handlebars.compile($('template#player-profile-template').html());
  let renderTemplate_show_player_stats = Handlebars.compile($('template#player-stats-template').html());
  let renderTemplate_show_player_updates = Handlebars.compile($('template#player-update-template').html());

  let renderTemplate_show_user_player_list = Handlebars.compile($('template#user-player-list-template').html());

  // =================================================================
  // USER Click Events ===============================================
  // =================================================================

    $('#new_user_button').click((e) => {
      console.log('CLICKED BUTTON TO GENERATE FORM');
          e.preventDefault();
        $.ajax({

        }).done((data)  => {
          console.log('show user form');
          showUserForm(data);
          registerSubmitClick();
        });
      });

    $('#edit_user_button').click((e) => {
      e.preventDefault();

      var edit_user_data = $('#edit-user-form').serialize();
      console.log(edit_user_data);

      $.ajax({
        type: "PUT",
        url: "/users/" + $('.edit-user-form').data('id'),
        data: edit_user_data
      }).done((data) => {
         console.log(data);
         showUser(data);
      });
    });

    $('#delete_user_button').click((e) => {
      e.preventDefault();

      $.ajax({
        type: "DELETE",
        url: "/users/" + $('.edit-user-form').data('id'),
        data: edit_user_data
      }).done((data) => {
         console.log(data);
        // redirect home? ;
      });
    });
  // =================================================================
  // REGISTER CLICKS =================================================
  // =================================================================

  function registerSubmitClick() {
    $('#new-user-form').on('submit', (e) => {
      console.log('CLICKED BUTTON TO SUBMIT USER');
      e.preventDefault();

      let new_user_data = $('#new-user-form').serializeArray();
      let new_user_json = {};

      $.map(new_user_data, (n,i) => {
        new_user_json[n['name']] = n['value'];
      })

      console.log(new_user_json);

      $.ajax({
        type: "POST",
        url: "/users/new",
        data: new_user_json
      }).done((new_user_json) => {
        $.get('/users/' + new_user_json._id, showUser(new_user_json), 'json');
      });
    });
  }

  // =================================================================
  // Render templates ================================================
  // =================================================================

  function showUser(data) {
    console.log('Showing User profile page');
    resetUserView();

    let $profile = $('.user-profile-div');
    let compiledTemplate = renderTemplate_show_user({user: data});
    $profile.html('').append(compiledTemplate);
  }

  function showUserForm(data) {
    console.log('Displaying user signup form');
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_create_user(data);
    $form.html('').append(compiledTemplate);
  }

  let editUserForm = (data) => {
    console.log('Displaying edit user form');
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_edit_user(data);
    $form.html('').append(compiledTemplate);
  }

  let showUserPlayerList(data) {
    console.log('Displaying player list');
    resetPlayerList();

    let $list = ('.user_player_list');
    let compiledTemplate = renderTemplate_show_user_player_list(data);
    $list.html('').append(compiledTemplate);
  }

  // =================================================================
  // RESETS ==========================================================
  // =================================================================

  function resetForm() {
    console.log('Resetting forms in view');
    $('.forms-div').empty();
    $('#index_form').hide();
    $('#index_button').hide();
  }

  function resetUserView() {
    console.log('In ResetUserView!!');
    $('.user-profile-div').empty();
    $('.user-player-list-div').empty();
    $('.forms-div').empty();
    $('#index_form').hide();
    $('#index_button').hide();
  }

  let resetPlayerView = () => {
    $('.player-profile-div').empty();
    $('.player-update-div').empty();
    $('.player-twtr-div').empty();
    $('.player-stats-div').empty();
  }

  let resetUserPlayerList = () => {
    $('.user_player_list').empty();
  }

});
