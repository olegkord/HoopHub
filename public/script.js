'use strict';

$(function(){
  $('.user-profile-div').hide();
  $('.user-player-list-div').hide();
  $('.player-profile-div').hide();
  $('.player-update-div').hide();

  let renderTemplate_show_user = Handlebars.compile($('template#user-template').html());
  let renderTemplate_create_user = Handlebars.compile($('template#new-user-template').html());
  let renderTemplate_edit_user = Handlebars.compile($('template#edit-user-template').html());

  let renderTemplate_show_player_profile = Handlebars.compile($('template#player-profile-template').html());
  let renderTemplate_show_player_stats = Handlebars.compile($('template#player-stats-template').html());
  let renderTemplate_show_player_updates = Handlebars.compile($('template#player-update-template').html());

  let renderTemplate_show_user_player_list = Handlebars.compile($('template#user-player-list-template').html());

  // =================================================================
  // PLAYER Click Events =============================================
  // =================================================================

    $('#player_search_submit').click((e) => {
      console.log('CLICK BUTTON TO SEARCH FOR PLAYERS')
        e.preventDefault();

        let player_search = $('#player_search').val();
          console.log(player_search);
        player_search.replace(/ /g,'%20')
          console.log(player_search);
      $.ajax({
        type: "GET",
        url: "/player/" + player_search
      }).done((onePlayer) => {
        showPlayerProfile(onePlayer[0]);
      });
    });

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
      $.ajax({
        type: "POST",
        url: "/users/new",
        data: new_user_json
      }).done((new_user_json) => {
        $.get('/users/' + new_user_json._id, showUser(new_user_json), 'json');
      });
    });
  }

  function registerShowEditFormClick(data) {
    console.log('registering listener to display edit form');
    $('#edit_user_button').on('click', (e) => {
      console.log('CLICKED BUTTON TO GENERATE EDIT FORM')
      e.preventDefault();

     console.log(data);

     console.log('show edit form');
     editUserForm(data);
     registerEditClick(data);

    });
  }

  function registerEditClick(user_data) {
    console.log('registering edit button');
    $('#edit-user-form').on('submit', (e) => {
      console.log('CLICKED BUTTON TO EDIT USER');
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
        $.get('/users/' + new_user_json._id, showUser(new_user_json), 'json');
      });
    });
  }

  // =================================================================
  // Render PLAYER templates =========================================
  // =================================================================

  function showPlayerProfile(data){
    resetPlayerView();
    console.log('Showing Player Profile')

    var $profile = $('.player-profile-div');

    var compiledTemplate = renderTemplate_show_player_profile({players: data});
    $profile.html('').append(compiledTemplate);

    $profile.show();

    $.ajax({
      type: "GET",
      url: "/player/"+data.PlayerID+"/news"
    }).done( (playerNews) => {
      //playerNews is a JSON array of updates about the player.
      showPlayerUpdates(playerNews);
    })
  }

  // =================================================================
  // Render USER templates ===========================================
  // =================================================================

  function showUser(data) {
    console.log('Showing User profile page');
    resetUserView();

    let $profile = $('.user-profile-div');

    let compiledTemplate = renderTemplate_show_user({user: data});
    $profile.html('').append(compiledTemplate);

    registerShowEditFormClick(data);

     $('.user-profile-div').show();
     $('.user-player-list-div').show();

     showUserPlayerList(data.favoritePlayers);
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

  // =================================================================
  // RENDER PLAYER ===================================================
  // =================================================================
  let showUserPlayerList = (data) => {
    console.log('Displaying player list');
    resetUserPlayerList();


    let $list = $('.user-player-list-div');
    let compiledTemplate = renderTemplate_show_user_player_list({player: data});
    $list.html('').append(compiledTemplate);
  }

  function showPlayerStats(data) {
    console.log('Displaying player stats');
    resetPlayerStats();

    let $stats = ('.player_stats');
    let compiledTemplate = renderTemplate_show_player_stats(data);
    $stats.html('').append(compiledTemplate);
  }

  function showPlayerUpdates(data) {
    console.log('Displaying player updates');
    console.log(data);
    resetPlayerUpdates();


    let $updates = $('.player-update-div');
    let compiledTemplate = renderTemplate_show_player_updates({update: data});
    $updates.html('').append(compiledTemplate);
  }

  // =================================================================
  // RESETS ==========================================================
  // =================================================================

  function resetForm() {
    console.log('Resetting forms in view');
    $('.forms-div').empty();
    $('.user-profile-div').hide();
    $('.user-player-list-div').hide();
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
    $('#index_form').hide();
    $('#index_button').hide();
  }

  let resetPlayerStats = () => {
    $('.player-stats-template').empty();
  }

  let resetPlayerUpdates = () => {
    $('.player-update-template').empty();
  }

  let resetUserPlayerList = () => {
    $('.user_player_list').empty();
  }

});

// HELPER METHODS

Handlebars.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});
