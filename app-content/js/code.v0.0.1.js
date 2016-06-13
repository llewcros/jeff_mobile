/* 
 Created on : 03 Jun 2016, 1:18:33 PM
 Author     : David John Tennant - dev@homecloudsolutions.co.za | davidjohntennantwork@gmail.com - Home Cloud
 */

// Mobile Intitialize

$(document).bind("mobileinit", "ready", function () {

    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;

    //Disable Cache
    
    $.mobile.page.prototype.options.domCache = true;

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

//DataTables



$(document).on("pageshow", "#leads", function () {

    if ($.fn.DataTable.isDataTable('#leads_table')) {
        $('#leads_table').DataTable().columns.adjust();
        return;
    }

    $('#leads_table').dataTable({
        columns: [
            {data: 'leadid'},
            {data: 'lastname'},
            {data: 'firstname'},
            {data: 'emailaddress'},
            {data: 'contactno'},
            {data: 'ldphysicaladdress'}
        ],
        scrollX: true,
        scrollXollapse: true,
        pagingType: "full",
        paging: true,
        order: [1, 'DESC'],
//        responsive: true
    });
    
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

$(document).on("pageremove", function (event) {
    $('#leads_table').DataTable().destroy(false);
});



