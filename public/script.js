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
    console.log('CLICKED BUTTON FOR LOGIN FORM');
    e.preventDefault();

    $.ajax({
    }).done((data) => {
      showLoginForm(data);
      registerLoginClick()
      console.log('Login button clicked!');
    });
  });


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
          console.log(data);
          showTwitterFeed(data);
          resetTwtr()
        })
      });


    //  renders new user form
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

  // =================================================================
  // REGISTER CLICKS =================================================
  // =================================================================

  function registerSearchPlayerClick() {
    console.log('clicked button to search player by name')
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
      }).done( (onePlayer) => {
        let userID = $('.hidden').html();
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
      console.log('clicked button to LOG IN user');
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
        console.log(logged_in_user);
        $.get('/users/' + logged_in_user._id, showUser(logged_in_user), 'json');
      });
    });
  }


  function registerSubmitClick() {
    $('#new-user-form').on('submit', (e) => {
      console.log('clicked on button to CREATE NEW user');
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
    console.log('registering delete button');
    let userID = $('.hidden').html();
      $.ajax({
        url: "/users/" + userID,
        method: "DELETE"
      }).done( (data) => {
        console.log(data);
        showLoginForm(data)
        console.log('routing back to login')
      });
    }

  function registerPlayerClicks() {
    console.log('Registering Click Events for player list...:');
    let $playerTable = $('#player_list > *');
    let numPlayers = $playerTable.length;
    for(let i=0; i < numPlayers; i++) {
      console.log('.. .. ..');
      $playerTable.eq(i).click( (event) => {
        event.preventDefault();
        let dataID = $playerTable.eq(i).attr('data-id');
        console.log('Clicked on ' + dataID);

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
    console.log('Registering player Hover events');
    let $playerTable = $('#player_list > *');
    let numPlayers = $playerTable.length;
    for(let i=0; i < numPlayers; i++) {
      console.log('-- -- --');
      $playerTable.eq(i).hover( (event) => {
        event.preventDefault();
        let dataID = $playerTable.eq(i).attr('data-id');

        //Show a glyphicon upon hover.
        let $iconHolder = $('<li>').addClass('icon-holder');
        $playerTable.eq(i).children().append($iconHolder);
        $iconHolder.html('<span class="glyphicon glyphicon-remove-sign"></span>');
        $playerTable.eq(i).css({
          border: '2px darkgreen solid',
          'border-radius': '15px',
          cursor: 'pointer'
        })
        //$playerTable.eq(i).off();
        $iconHolder.click( (event) => {
//          event.preventDefault();
          event.stopPropagation();
          //click on the icon to delete Player
          let playerID = $playerTable.eq(i).attr('data-id');
          let userID = $('.hidden').html();
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
      console.log('displaying twitter feed')
      $('.player-twtr-div').empty();
      $('.player-twtr-div').show();
     let twitter = $('.player-twtr-div').append('<div>').find('div')
      twitter.attr('class','text center twtr-div');
     console.log(data);
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
    console.log('Displaying login form');
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_show_login(data);
    $form.html('').append(compiledTemplate);
  }


  // =================================================================
  // Render PLAYER templates =========================================
  // =================================================================

  function showPlayerProfile(data){

    resetPlayerView();

    console.log('Showing Player Profile for ' + data.FirstName + ' ' + data.LastName)

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
    console.log('Showing User profile page');
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
    console.log('Displaying user signup form');
    resetForm();

    let $form = $('.forms-div');
    let compiledTemplate = renderTemplate_create_user(data);
    $form.html('').append(compiledTemplate);

    registerPlayerClicks();
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

   function showUserPlayerList(data) {
    console.log('Displaying player list');
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
    console.log('Displaying player stats');
    console.log(data);
    resetPlayerStats();
    $('.player-twtr-div').hide();
    $('.logo').hide();

    let $stats = $('<div/>').attr('id','player_stats');
    $('.player-stats-div').show().append($stats);
    let compiledTemplate = renderTemplate_show_player_stats({player: data});
    $stats.html('').append(compiledTemplate);
  }

  function showPlayerUpdates(data) {
    console.log('Displaying player updates');
    resetPlayerUpdates();
    $('.player-twtr-div').hide();
    $('.player-update-div').show();

    let $updates = $('.player-update-div');
    let compiledTemplate = renderTemplate_show_player_updates({update: data});
    $updates.html('').append(compiledTemplate);
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
  }

  function resetTwtr() {
    $('.forms-div').empty();
    $('.user-profile-div').hide();
    $('.user-player-list-div').hide();
    $('.logo').hide();
  }


  function resetForm() {
    console.log('Resetting forms in view');
    $('.forms-div').empty();
    $('.user-profile-div').hide();
    $('.user-player-list-div').hide();
    $('.logo').hide();
    $('.player-twtr-div').hide();
  }

  function resetUserView() {
    console.log('In ResetUserView!!');
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
