/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//Load footer on pageshow / deprecated

$('[data-role=page]').on('pageshow', function (event, ui) {
    $(document).find("[data-role=footer]").load("appcontent/static/footer.html");
    $("#" + event.target.id).find("[data-role=footer]").load("footer.html", function () {
        $("#" + event.target.id).find("[data-role=navbar]").navbar();
    });
});

//Authentication Ajax

$(document).ready(function () {
    $("#login_submit").click(function (event) {
        event.preventDefault();
        var credentials = {type: 'EMAIL', username: $('#login_username').val(), password: $('#login_password').val()};
        $.ajax({
            type: "PUT",
            url: "api/auth",
            cache: false,
            data: JSON.stringify(credentials),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                //validate the response here, set variables... whatever needed
                //and if credentials are valid, forward to the next page
                $.mobile.changePage($('#main_menu'));
                //or show an error message
            },
            error: function () { } // server couldn't be reached or other error 
        });
    });
});


//Global Links for AJAX 

var leads_leads = "leads.php";

$("#leads").pagecontainer({
  show: function( event, ui ) {}
});

$('#leads').on("pagecontainershow", function (event, ui) {
    
    alert('leadspage');
    
    $.ajax({
        type: "GET",
        url: leads_leads,
        dataType: 'json',
        data: {
            action: "getleads"
        },
        success: function (data) {

            var leads_list = $("#leads_list");

            $.each(data, function (i, e) {
                leads_list.append('<ul class="lead_group"><li><span class="lead_name">Name: ' + e.name + ' ' + e.surname + '</span><span>Status:' + e.status + '</span></li><li class="lead_contactno">Contact Number:  ' + e.phonenumber + '</li><li class="lead_email">Email Address: ' + e.email + '</li></ul>');
            });
        },
        error: function () {
            alert("Failure : Reload page and try again");
        }

    });
});


//Attemps to inject pages

$(":mobile-pagecontainer").on("pagecontainershow", function (event, ui) {
    alert("Test");
    $("#leads").find("[data-role=panel]").load("app-content/static/panel.html");
    $("#leads").find("[data-role=header]").load("app-content/static/header.html");
    $("#leads").find("[data-role=footer]").load("app-content/static/footer.html");
});

//$('[data-role=page]').on('pageshow', function (event, ui) {
//    $("#" + event.target.id).find("[data-role=footer]").load("footer.html", function () {
//        $("#" + event.target.id).find("[data-role=navbar]").navbar();
//    });
//});

//Populate Leads by Sales Person
$(document).delegate("#leads", "pagebeforecreate", function () {
    $.ajax({
        type: "GET",
        url: leadmaster,
        dataType: 'json',
        async:true,
        data: {
            action: 'listLeadsBySalesperson',
            salesperson: 18
        },
        success: function (data) {
            var dlist_output = $("#leads_list");

            $.each(data.leads, function (i, e) {
                dlist_output.append('<div id="leads_list"><div leadid="'+e.leadid+'" class="lead_group"><div class="ui-grid-solo"><div class="ui-block-a">'+e.firstname+' '+e.lastname+'</div></div><div class="ui-grid-solo"><div class="ui-block-a">Contact Number: '+e.contactno+'</div></div><div class="ui-grid-solo"><div class="ui-block-a">Email Address: '+e.emailaddress+'</div></div><div class="ui-grid-solo"><div class="ui-block-a">Address: '+e.ldphysicaladdress+'</div></div></div></div>');
            });
        },
        error: function () {
            alert("Failure : Reload page and try again");
        }
        
    });
});


//Ajax Start and Stop
$(document).loader();

$(document)
  .ajaxStart(function () {
    alert('Ajaxstart');
    $(document).loader("show");
  })
  .ajaxStop(function () {
    alert("Ajaxstop");
    $(document).loader("hide");
  })



//DataTables

$(document).ready(function () {
    $('#leads_table').DataTable({
        columns: [
            {data: 'leadid'},
            {data: 'lastname'},
            {data: 'firstname'},
            {data: 'emailaddress'},
            {data: 'contactno'},
            {data: 'ldphysicaladdress'}
        ],
        paging: false,
        order: [1, 'DESC'],
        responsive: true
    });
});

//======= AJAX =======

//Populate Leads by Sales Person
$(document).delegate("#leads", "pagebeforecreate", function () {
    $.ajax({
        type: "GET",
        url: leadmaster,
        dataType: 'json',
        data: {
            action: 'listLeadsBySalesperson',
            salesperson: 18
        },
        success: function (data) {
            var t = $('#leads_table').DataTable();
            t.clear();
            t.rows.add(data.leads);
            t.draw();
        },
        error: function () {
            alert("Failure : Reload page and try again");
        }

    });
});
