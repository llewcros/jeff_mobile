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
//document.addEventListener('deviceready', function () {
//    // cordova.plugins.notification.local is now available
//}, false);
//
//cordova.plugins.notification.local.hasPermission(function (granted) {
//    // console.log('Permission has been granted: ' + granted);
//});
//
//cordova.plugins.notification.local.registerPermission(function (granted) {
//    // console.log('Permission has been granted: ' + granted);
//});
//
//cordova.plugins.notification.local.on("trigger", function (notification) {
//    if (1 == 1)
//        return;
//    // After 10 minutes update notification's title 
//    setTimeout(function () {
//        cordova.plugins.notification.local.update({
//            id: 10,
//            title: "Meeting in 5 minutes!"
//        });
//    }, 600000);
//});
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

$(document).on('pagebeforecreate', '#leads', function () {
    var interval = setInterval(function () {
        $.mobile.loading('show');
        clearInterval(interval);
    }, 1);
});
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
            $.mobile.loading('hide');
            $("#leads_table_wrapper").show();
            $(".dataTables").show();
        },
        error: function () {
            alert("Failure : Reload page and try again");
        }

    });
    function format(d) {
        $.mobile.Jeffster.leadid = d.leadid;
        return '<span>Lead ID: ' + d.leadid + '</span><br> Email Address: ' + d.emailaddress + '<br>' +
                'Physical Address: ' + d.ldphysicaladdress + '<br><a href="#full_lead" class="lead_info"><i class="fa fa-info" aria-hidden="true"></i> Info</a>'
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

    $('#leads_table').on('click', 'tr', function () {

        var table = $('#leads_table').DataTable();
        var tr = $(this).closest('tr');
        var row = $('#leads_table').DataTable().row(tr);

        if (row.child.isShown() !== true) {
            //Close all open rows, when click upopened rows
            table.rows().eq(0).each(function (idx) {
                var row = table.row(idx);

                if (row.child.isShown()) {
                    row.child.hide();
                    $('#leads_table tr').removeClass('shown');
                }
            });
        }

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

    // End of Datatable for Leads

    //Populate Select Options for New Lead

    $.ajax({
        type: "GET",
        url: restful_leadmaster,
        dataType: 'json',
        data: {
            action: 'populateNewLeadOptions'
        },
        success: function (data) {

//            $.each(data.leads.title, function (i, e) {
//                $("#new_ld_title").append('<option value="' + i + '">' + e.description + '</option>');
//            });
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

//Date Vars
        var day = $("#new_ld_day option:selected").val();
        var month = $("#new_ld_month option:selected").val();
        var year = $("#new_ld_year option:selected").val();
        var new_ld_title = $("#new_ld_title option:selected").val();
        var new_ld_firstname = $("#new_ld_firstname").val();
        var new_ld_lastname = $("#new_ld_lastname").val();
        var new_ld_contactno = $("#new_ld_contactno").val();
        var new_ld_email = $("#new_ld_email").val();
        var new_ld_date = year + "-" + month + "-" + day;
        var new_ld_address = $("#new_ld_address").val();
        var new_ld_origin = $("#new_ld_origin option:selected").val();
        var new_ld_source = $("#new_ld_source option:selected").val();
        var new_ld_comments = $("#new_ld_comments").val();
//        Log to Test
//        var output = new_ld_title +" + "+ new_ld_firstname +" + "+ new_ld_lastname +" + "+ new_ld_contactno +" + "+ new_ld_email +" + "+ new_ld_date +" + "+ new_ld_address +" + "+ new_ld_origin +" + "+ new_ld_source + " + " + new_ld_comments;
//        console.log(output);


        //create new lead
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
//Sets Current Date and Generates the Years for New Leads Date Chooser

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
//    Load Current Years -1 0 +1 into options
    var years_offset = -1; //Starts with curret year - 1
    var max_years = 3; //Set years for list item

    function makeYears() {
        $("#new_ld_year").append($('<option>', {
            value: year + years_offset,
            text: year + years_offset
        }));
        years_offset++; //add one year for each create
    }

    (function (count) {
        if (count < max_years) {
            makeYears();
            var caller = arguments.callee;
            window.setTimeout(function () {
                caller(count + 1);
            }, 0);
        }
    })(0);
}

$(document).on("pageshow", "#full_lead", function () {

    $.ajax({
        type: "GET",
        url: restful_leadmaster,
        dataType: 'json',
        data: {
            action: 'appFullLeadInfo',
            leadid: $.mobile.Jeffster.leadid
        },
        success: function (data) {
            $.each(data, function (i, e) {

                //RegEx
                ldcontactno = e.ldcontactno.replace(/\s+/g, '');

                var not_avail = ("N/A");

                $("#ldid_val").text($.mobile.Jeffster.leadid);
                $("#ldtitle_val").text(e.ldtitle === null | e.ldtitle === 0 | e.ldtitle === "" ? not_avail : e.ldtitle);
                $("#ldleadtype_val").text(e.ldleadtype === null | e.ldleadtype === "" ? not_avail : e.ldleadtype);
                $("#ldsalespersonid_val").text(e.ldsalespersonid === null | e.ldsalespersonid === "" ? not_avail : e.ldsalespersonid);
                $("#ldlastname_val").text(e.ldlastname === null | e.ldlastname === "" ? not_avail : e.ldlastname);
                $("#ldfirstname_val").text(e.ldfirstname === null | e.ldfirstname === "" ? not_avail : e.ldfirstname);
                $("#ldcontactno_val").text(ldcontactno === null | ldcontactno === "" ? not_avail : ldcontactno);
                $("#ldemailaddress_val").text(e.ldemailaddress === null | e.ldemailaddress === "" ? not_avail : e.ldemailaddress);
                $("#ldphysicaladdress_val").text(e.ldphysicaladdress === null | e.ldphysicaladdress === "" ? not_avail : e.ldphysicaladdress);
                $("#lddate_val").text(e.lddate === null | e.lddate === "" ? not_avail : e.lddate);
                $("#ldstatus_val").text(e.ldstatus === null | e.ldstatus === "" ? not_avail : e.ldstatus);
                $("#ldsource_val").text(e.ldsource === null | e.ldsource === "" ? not_avail : e.ldsource);
                $("#ldorigin_val").text(e.ldorigin === null | e.ldorigin === "" ? not_avail : e.ldorigin);
                $("#ldnextactivitydate_val").text(e.ldnextactivitydate === null | e.ldnextactivitydate === "" ? not_avail : e.ldnextactivitydate);
                $("#ldcustomerid_val").text(e.ldcustomerid === null | e.ldcustomerid === "" ? not_avail : e.ldcustomerid);
                $("#ldcomments_val").text(e.ldcomments === null | e.ldcomments === "" ? not_avail : e.ldcomments);
                $("#ldcreatedby_val").text(e.ldcreatedby === null | e.ldcreatedby === "" ? not_avail : e.ldcreatedby);
                $("#ldcreateddate_val").text(e.ldcreateddate === null | e.ldcreateddate === "" ? not_avail : e.ldcreateddate);
                $("#ldmodifiedby_val").text(e.ldmodifiedby === null | e.ldmodifiedby === "" ? not_avail : e.ldmodifiedby);
                $("#ldmodifieddate_val").text(e.ldmodifieddate === null | e.ldmodifieddate === "" ? not_avail : e.ldmodifieddate);
                $("#ldlatitude_val").text(e.ldlatitude === null | e.ldlatitude === "" ? not_avail : e.ldlatitude);
                $("#ldlongitude_val").text(e.ldlongitude === null | e.ldlongitude === "" ? not_avail : e.ldlongitude);

                //Data to Buttons
                $("#lead_favourte").on('click', function () {
                    alert("Favourite");
                });
                $("#lead_call0").attr("href", "tel:" + e.contactno + "");
                $("#lead_call1").on('click', function () {
                    alert("Call Second Number");
                });
                $("#lead_call2").on('click', function () {
                    alert("Call Third Number");
                });
                $("#lead_email").attr("href", "mailto:" + e.ldemailaddress + "");
                $("#lead_sms0").attr("href", "sms:" + e.contactno + "");
                $("#lead_sms1").on('click', function () {
                    alert("SMS Second Number");
                });
                $("#lead_sms2").on('click', function () {
                    alert("SMS Third Number");
                });
                $("#lead_map").attr("href", "https://maps.google.com?saddr=Current+Location&daddr=" + e.ldphysicaladdress.replace(/\s+/g, '+') + "");

            });

        },
        error: function () {
            alert("Failure : Reload page and try again");
        }

    });

});