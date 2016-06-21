/* 
 Created on : 03 Jun 2016, 1:18:33 PM
 Author     : David John Tennant - dev@homecloudsolutions.co.za | davidjohntennantwork@gmail.com - Home Cloud
 */

// Mobile Intitialize

$(document).bind("mobileinit", "ready", function () {

    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;

    //Cache Setting

    $.mobile.page.prototype.options.domCache = true;

});

//Global Links

var restful_leadmaster = "http://hcdev.ubambosolutions.co.za/restful/lead/leadmaster.php?";

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


//Leads Page Specific Code

$(document).on("pageshow", "#leads", function () {

    // DataTables
    //Populate leads Via Sales Person ID

    $.ajax({
        type: "GET",
        url: restful_leadmaster,
        dataType: 'json',
        data: {
            action: 'listLeadsBySalesperson',
            salesperson: 18
        },
        success: function (data) {
            var table = $('#leads_table').DataTable();
            table.clear();
            table.rows.add(data.leads);
            table.draw();
        },
        error: function () {
            alert("Failure : Reload page and try again");
        }

    });

    function format(d) {
        return 'Lead ID: ' + d.leadid + '<br> Email Address: ' + d.emailaddress + '<br>' +
                'Physical Address: ' + d.ldphysicaladdress + '<br>'
    }

    if ($.fn.DataTable.isDataTable('#leads_table')) {
        $('#leads_table').DataTable().columns.adjust();
        return;
    }

    $('#leads_table').dataTable({
        columns: [
            {
                className: 'details-control',
                orderable: false,
                data: null,
                defaultContent: ''
            },
            {data: 'firstname'},
            {data: 'lastname'},
            {data: 'contactno'},
        ],
        paging: false,
        fixedHeader: true,
        order: [[1, "asc"]]
    });

    $('#leads_table').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = $('#leads_table').DataTable().row(tr);

        //Close all open

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    }); // End of Datatable for Leads

    //Populate Select Options for New Lead

    $.ajax({
        type: "GET",
        url: restful_leadmaster,
        dataType: 'json',
        data: {
            action: 'populateNewLeadOptions'
        },
        success: function (data) {

            $.each(data.leads.title, function (i, e) {
                $("#new_ld_title").append('<option value="' + i + '">' + e.description + '</option>');
            });

            $.each(data.leads.source, function (i, e) {
                $("#new_ld_source").append('<option value="' + i + '">' + e.description + '</option>');
            });

            $.each(data.leads.origin, function (i, e) {
                $("#new_ld_origin").append('<option value="' + i + '">' + e.description + '</option>');
            });

        },
        error: function () {
            alert("Failure : Reload page and try again");
        }

    });

    //Confirm Lead Cancel

    $('#new_lead_close').click(function () {
        var button = $(this);
        var input = button.find('input');
        var box_checked = input.attr('data-cacheval');
        if (box_checked == 'false') {
            //Unset Check Box
            button.find('label').removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
            input.attr('data-cacheval', 'true');
            //Close Popup
            $('#new_lead').popup('close');
        }
    });

//    Create New Lead

    $('#new_lead_submit').click(function () {

        var new_ld_title = $("#new_ld_title option:selected").val();
        var new_ld_firstname = $("#new_ld_firstname").val();
        var new_ld_lastname = $("#new_ld_lastname").val();
        var new_ld_contactno = $("#new_ld_contactno").val();
        var new_ld_email = $("#new_ld_email").val();

        //Date
        var day = $("#new_ld_day option:selected").val();
        var month = $("#new_ld_month option:selected").val();
        var year = $("#new_ld_year option:selected").val();
        var new_ld_date = year + "-" + month + "-" + day;

        var new_ld_address = $("#new_ld_address").val();
        var new_ld_origin = $("#new_ld_origin option:selected").val();
        var new_ld_source = $("#new_ld_source option:selected").val();
        var new_ld_comments = $("#new_ld_comments").val();
        ;

//        Log to Test
//        var output = new_ld_title +" + "+ new_ld_firstname +" + "+ new_ld_lastname +" + "+ new_ld_contactno +" + "+ new_ld_email +" + "+ new_ld_date +" + "+ new_ld_address +" + "+ new_ld_origin +" + "+ new_ld_source + " + " + new_ld_comments;
//        console.log(output);

        alert('AJAX Started');
        $.ajax({
            type: "POST",
            url: restful_leadmaster,
            dataType: 'json',
            data: {
                salesperson: 18,
                title: new_ld_title,
                firstname: new_ld_firstname,
                lastname: new_ld_lastname,
                contactno: new_ld_contactno,
                emailaddress: new_ld_email,
                date: new_ld_date,
                modifiedby: 'Zama',
                source: new_ld_source,
                physicaladdress: new_ld_address,
                comments: new_ld_comments,
                latitude: '-00,000000',
                longitude: '00,000000',
                origin: new_ld_origin,
                action: "appInsertNewLead"
            },
            success: function (data) {

                if (data.success == true) {
                    alert("Lead Created");
                } else {
                    alert(data.error);
                }
            },
            error: function (a, b, c) {
                alert("Send Failure : Reload page and try again");
                alert("" + a + "||" + b + "||" + c + "");
            }
        });
    });

    getdate();

});

$(document).on("pageremove", function (event) {
    $('#leads_table').DataTable().destroy(false);
});

function getdate() {
    var d = new Date();

    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var month = monthNames[d.getMonth()];
    var day = d.getDate();
    var year = d.getFullYear();



//    Set New Lead Date
    $("#new_ld_day-button").find('span').text(day);
    $("#new_ld_month-button").find('span').text(month);
    $("#new_ld_year-button").find('span').text(year);
}

