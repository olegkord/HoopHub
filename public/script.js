'use strict';

$(function(){
  $('.user-profile-div').hide();
  $('.user-player-list-div').hide();
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

    $('body').on('click', '#edit_user_button', (e) => {
      console.log('CLICKED BUTTON TO GENERATE EDIT FORM')
      e.preventDefault();

      $.ajax({
      }).done((data) => {
         console.log('show edit form');
         editUserForm(data);
         registerEditClick(data);
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


  function registerEditClick(user_data) {
    console.log('registering edit button');
    $('#edit-user-form').on('submit', (e) => {
      console.log('CLICKED BUTTON TO SUBMIT USER');
      e.preventDefault();

      let edit_user_data = $('#edit-user-form').serializeArray();
      let edit_user_json = {};

      $.map(edit_user_data, (n,i) => {
        edit_user_json[n['name']] = n['value'];
      })

      console.log(edit_user_json);

      $.ajax({
        type: "PUT",
        url: '/users/' + user_data._id,
        data: edit_user_json
      }).done((new_user_json) => {
        $.get('/users/' + new_user_json._id, editUserForm(edit_user_json), 'json');
      });
    });
  }

  // =================================================================
  // Render templates ================================================
  // =================================================================

  function showUser(data) {
    console.log('Showing User profile page');
    console.log(data);
    resetUserView();

    let $profile = $('.user-profile-div');

    let compiledTemplate = renderTemplate_show_user({user: data});
    $profile.html('').append(compiledTemplate);


     $('.user-profile-div').show();
     $('.user-player-list-div').show();
  }

  function showUserForm(data) {
    console.log('Displaying user signup form');
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_create_user(data);
    $form.html('').append(compiledTemplate);
  }

  function editUserForm(data) {
    console.log('Displaying edit user form');
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_edit_user(data);
    $form.html('').append(compiledTemplate);
  }

  function showUserPlayerList(data) {
    console.log('Displaying player list');
    resetPlayerList();

    let $list = ('.user_player_list');
    let compiledTemplate = renderTemplate_show_user_player_list({user: data});
    $list.html('').append(compiledTemplate);
  }

  // =================================================================
  // RESETS ==========================================================
  // =================================================================

  function resetForm() {
    console.log('Resetting forms in view');
    $('.forms-div').empty();
    $('.user-profile-div').hide();
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
