/* 
 Created on : 03 Jun 2016, 1:18:33 PM
 Author     : David John Tennant - dev@homecloudsolutions.co.za | davidjohntennantwork@gmail.com - Home Cloud
 */

// Mobile Intitialize

$(document).bind("mobileinit", "ready", function () {

    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;

    //Enable Scanner on ScanBars
    
   
});

//Global Links

var leadmaster = "http://hcdev.ubambosolutions.co.za/restful/lead/leadmaster.php?";

$('#refresher').click(function () {
    location.reload(true);
    alert('refreshing');
});

//Bypass Security

$(document).ready(function () {

    $("#login_submit").click(function () {
        $.mobile.changePage($('#index'));
    });

});

//Clone Static Content
$(document).delegate("#index", "pagebeforecreate", function () {
    $(".panelMaster").clone().appendTo(".panelChild");
    $("#headerMaster").clone().appendTo(".headerChild");
    $("#footerMaster").clone().appendTo(".footerChild");
});

//======= AJAX =======

//Ajax Start and Stop
//$(document).loader();
//
//$(document)
//  .ajaxStart(function () {
//    alert('Ajaxstart');
//    $(document).loader("show");
//  })
//  .ajaxStop(function () {
//    alert("Ajaxstop");
//    $(document).loader("hide");
//  });
  
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


