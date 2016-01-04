'use strict';

$(function(){
  console.log('loaded.');

  hideAllDivs();

  // =================================================================
  // HANDLEBAR TEMPLATES =============================================
  // =================================================================


  let renderTemplate_show_login = Handlebars.compile($('template#login-page').html());

  let renderTemplate_show_user = Handlebars.compile($('template#user-template').html());
  let renderTemplate_create_user = Handlebars.compile($('template#new-user-template').html());
  let renderTemplate_edit_user = Handlebars.compile($('template#edit-user-template').html());

  let renderTemplate_show_player_profile = Handlebars.compile($('template#player-profile-template').html());
  let renderTemplate_show_player_stats = Handlebars.compile($('template#player-stats-template').html());
  let renderTemplate_show_player_updates = Handlebars.compile($('template#player-update-template').html());
  let renderTemplate_show_user_player_list = Handlebars.compile($('template#user-player-list-template').html());

  // =================================================================
  // Login Click Events =============================================
  // =================================================================

  $('#login_button').click(function(e) {

    $.ajax({
    }).done((data) => {
      showLoginForm(data);
      registerLoginClick()
    });
  });


  // =================================================================
  // PLAYER Click Events =============================================
  // =================================================================

    $('#player_search_submit').click((e) => {
        e.preventDefault();

        let player_search = $('#player_search').val();

        player_search.replace(/ /g,'%20')

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

    //  delete user click event
    $(".user-profile-div").on('click', '.delete-user', registerDeleteClick);
    $(".navbar").on('click', '.login', showLoginForm);
    $(".navbar").on('click', '.createUser', showUserForm);

    // click event for twitter to display feed
    $(".navbar").on('click', '.twitterFeed', (e) => {
      e.preventDefault();
        $.ajax({
          type: "GET",
          url: "/tweets",
        }).done((data) => {

          showTwitterFeed(data);
          resetTwtr()
        })
      });


    //  renders new user form
    $('#new_user_button').click((e) => {
        e.preventDefault();

        $.ajax({
        }).done((data)  => {
          showUserForm(data);
          registerSubmitClick();
        });
      });

  // =================================================================
  // REGISTER CLICKS =================================================
  // =================================================================

  function registerSearchPlayerClick() {

    $('#player_search_submit').click((e) => {

        e.preventDefault();

        let player_search = $('#player_search').val();

        player_search.replace(/ /g,'%20')

      $.ajax({
        type: "GET",
        url: "/player/" + player_search
      }).done( (onePlayer) => {
        let userID = $('.hidden#user-id').html();
        $.ajax({
          type: "PUT",
          url: "/users/" + userID,
          data: onePlayer[0]
        }).done ( (updatedUser) => {
          $.get('/users/' + updatedUser._id, showUserPlayerList(updatedUser.favoritePlayers), 'json');
        })
      });
    });
  }
  function registerLoginClick() {
    $('#login-form').on('submit', (e) => {

      e.preventDefault();

      let login_user_data = $('#login-form').serializeArray();
      let login_user_json = {};

      $.map(login_user_data, (n,i) => {
        login_user_json[n['name']] = n['value'];
      })
      $.ajax({
        type: "POST",
        url: "/users/login",
        data: login_user_json
      }).done( (logged_in_user) => {

        let $user = $('<span/>').addClass('hidden').attr('id', 'user-id').html(logged_in_user._id);
        $('body').append($user);
        registerProfileButton(logged_in_user);
        $.get('/users/' + logged_in_user._id, showUser(logged_in_user), 'json');
      });
    });
  }

  function registerProfileButton(user) {
     $('li.profile').click( (event) => {

      event.preventDefault();
      showUser(user);
    });
  }

  function registerSubmitClick() {
    $('#new-user-form').on('submit', (e) => {

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

    $('#edit_user_button').on('click', (e) => {

      e.preventDefault();
     editUserForm(data);
     registerEditClick(data);
    });
  }

  function registerEditClick(user_data) {

    $('#edit-user-form').on('submit', (e) => {

      e.preventDefault();

      let edit_user_data = $('#edit-user-form').serializeArray();
      let edit_user_json = {};

      $.map(edit_user_data, (n,i) => {
        edit_user_json[n['name']] = n['value'];
      })

      $.ajax({
        type: "PUT",
        url: '/users/' + user_data._id,
        data: edit_user_json
      }).done((new_user_json) => {
        $.get('/users/' + new_user_json._id, showUser(new_user_json), 'json');
      });
    });
  }


  function registerDeleteClick(user_data) {

    let userID = $('.hidden#user-id').html();
      $.ajax({
        url: "/users/" + userID,
        method: "DELETE"
      }).done( (data) => {
        showLoginForm(data)
      });
    }

  function registerPlayerClicks() {
    let $playerTable = $('#player_list > *');
    let numPlayers = $playerTable.length;
    for(let i=0; i < numPlayers; i++) {
      $playerTable.eq(i).click( (event) => {
        event.preventDefault();
        let dataID = $playerTable.eq(i).attr('data-id');

        $.ajax({
          type: "GET",
          url: '/player/' + dataID
        }).done( (player_data) => {
          showPlayerProfile(player_data[0]);
        });
      });
    }
  }

  function registerPlayerHovers() {
    let $playerTable = $('#player_list > *');
    let numPlayers = $playerTable.length;
    for(let i=0; i < numPlayers; i++) {
      $playerTable.eq(i).hover( (event) => {
        event.preventDefault();
        let dataID = $playerTable.eq(i).attr('data-id');

        //Show a glyphicon upon hover.
        let $iconHolder = $('<li>').addClass('icon-holder');
        $playerTable.eq(i).children().append($iconHolder);
        $iconHolder.html('<span class="glyphicon glyphicon-remove-sign"></span>');

        $iconHolder.click( (event) => {
          event.stopPropagation();
          //click on the icon to delete Player
          let playerID = $playerTable.eq(i).attr('data-id');
          let userID = $('.hidden#user-id').html();
          $.ajax({
            type: "PUT",
            url: "/users/" + userID,
            data: {deleteID: playerID}
          }).done( (updatedUser) => {
            $.get('/users/' + updatedUser._id, showUserPlayerList(updatedUser.favoritePlayers), 'json');
          })
        })
      }, (event) => {

        let dataID = $playerTable.eq(i).attr('data-id');

        $('.space').remove();
        $('.glyphicon').remove();
        $playerTable.eq(i).css({
          border: '',
          'border-radius': ''
        })
      });
    }
  }

  // =================================================================
  // Render TWITTER FEED ==========================================
  // ====================.=============================================


   function showTwitterFeed(data) {
      hideAllDivs();
      $('.player-twtr-div').empty();
      $('.player-twtr-div').show();
     let twitter = $('.player-twtr-div').append('<div>').find('div')
      twitter.attr('class','text center twtr-div');
      twitter.append('<h1 class="tweet-headline"> NBA Twitter Feed </h1>');
    for(var j = data.length -1 ; j > -1; j--) {
      for(var i = 0; i < data[j].statuses.length; i++) {
       twitter.append(' <p class="tweets">' + '@'+ data[j].statuses[i].user.screen_name + ": " + data[j].statuses[i].text + '</p>');
       twitter.append(' <p class="tweets">' + data[j].statuses[i].created_at + '</p>');
       twitter.append(' <p class="tweets">' + '-------------------------------------------------' + '</p>');
     }
   }
}
  // =================================================================
  // Render LOGIN templates ==========================================
  // =================================================================


  function showLoginForm(data) {
    resetForm();
    hideAllDivs();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_show_login(data);
    $form.html('').append(compiledTemplate);
  }


  // =================================================================
  // Render PLAYER templates =========================================
  // =================================================================

  function showPlayerProfile(data){

    $('.player-container').show();
    resetPlayerView();
    resetUserView();
    $('.user-profile-div').hide();
    $('.user-player-list-div').hide();

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
    });

    $.ajax({
      type: "GET",
      url: "/player/"+ data.PlayerID+"/stats"
    }).done ( (playerStats) => {
      showPlayerStats(playerStats);
    })
  }

  // =================================================================
  // Render USER templates ===========================================
  // =================================================================

  function showUser(data) {
    resetUserView();

    let $profile = $('.user-profile-div');

    let compiledTemplate = renderTemplate_show_user({user: data});
    $profile.html('').append(compiledTemplate);

    registerShowEditFormClick(data);

     $('.user-profile-div').show();
     $('.user-player-list-div').show();;
     showUserPlayerList(data.favoritePlayers);
  }

  function showUserForm(data) {
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_create_user(data);
    $form.html('').append(compiledTemplate);

    registerPlayerClicks();
  }

  function editUserForm(data) {
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_edit_user(data);
    $form.html('').append(compiledTemplate);

  }

  // =================================================================
  // RENDER PLAYER ===================================================
  // =================================================================

   function showUserPlayerList(data) {
    resetUserPlayerList();
    $('.player-twtr-div').hide();


    let $list = $('.user-player-list-div');

    let compiledTemplate = renderTemplate_show_user_player_list({player: data});
    $list.html('').append(compiledTemplate);

    registerPlayerClicks();
    registerSearchPlayerClick();
    registerPlayerHovers()
  }

  function showPlayerStats(data) {
    resetPlayerStats();
    $('.player-twtr-div').hide();
    $('.logo').hide();

    let $stats = $('<div/>').attr('id','player_stats');
    $('.player-stats-div').show().append($stats);
    let compiledTemplate = renderTemplate_show_player_stats({player: data});
    $stats.html('').append(compiledTemplate);
  }

  function showPlayerUpdates(data) {
    resetPlayerUpdates();
    $('.player-twtr-div').hide();
    $('.player-update-div').show();
    $('.player-stats-div').show();

    let $updates = $('.player-update-div');
    let compiledTemplate = renderTemplate_show_player_updates({update: data});
    $updates.html('').append(compiledTemplate);
  }

    function showPlayerStats(data) {
      resetPlayerStats();

      let $stats = $('.player-stats-div');
      let compiledTemplate = renderTemplate_show_player_stats({player: data});
      $stats.html('').append(compiledTemplate);
    }


  // =================================================================
  // RESETS ==========================================================
  // =================================================================

  function hideAllDivs() {
    $('.user-profile-div').hide();
    $('.user-player-list-div').hide();
    $('.player-profile-div').hide();
    $('.player-update-div').hide();
    $('.player-twtr-div').hide();
    $('.player-stats-div').hide();
  }

  function resetTwtr() {
    $('.forms-div').empty();
    $('.user-profile-div').hide();
    $('.user-player-list-div').hide();
    $('.logo').hide();
  }


  function resetForm() {
    $('.forms-div').empty();
    $('.user-profile-div').hide();
    $('.user-player-list-div').hide();
    $('.logo').hide();
    $('.player-twtr-div').hide();
  }

  function resetUserView() {
    $('.user-profile-div').empty();
    $('.user-player-list-div').empty();
    $('.forms-div').empty();
    $('#index_form').hide();
    $('#index_button').hide();
    $('.player-twtr-div').hide();
  }

  let resetPlayerView = () => {
    $('.player-profile-div').empty();
    $('.player-update-div').empty();
    $('.player-twtr-div').empty();
    $('.player-stats-div').empty();
    $('#index_form').hide();
    $('#index_button').hide();
    $('.player-twtr-div').hide();
  }

 let hideTwtrDiv = () => {
    $('.player-twtr-div').hide();
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


// HELPER METHODS

Handlebars.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});
});
