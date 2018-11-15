( function ( $ ) {
    "use strict";

    var customerActivityResponseData = {};
    var campaignResultResponseData = {};
    $.ajax({url: "http://hackathon-env.23kccc2pvp.ap-south-1.elasticbeanstalk.com/useractivity", success: function(result){
        console.log(result.data);
        customerActivityResponseData = result.data;
        let chartData = [];
        chartData.push(result.data.activeUserCount);
        chartData.push(result.data.inactiveUserCount);
        drawPieChart(chartData);
        drawDoughnutChart(result.data.inactiveArray);
        
    }});

    /*$.ajax({url: "http://hackathon-env.23kccc2pvp.ap-south-1.elasticbeanstalk.com/getloyalityDetails", success: function(result){
        console.log(result.data);
        $('#loyalCustomerCount').html(result.data.count);
    }});*/

    $.ajax({url: "http://hackathon-env.23kccc2pvp.ap-south-1.elasticbeanstalk.com/getcampaigndetails", success: function(result){
        console.log(result.data);
        campaignResultResponseData = result.data;
        let chartData = [];
        chartData.push(result.data.successfullCampaign.count);
        chartData.push(result.data.failedCampaigned.count);
        drawPieChartForCampaignResults(chartData);
    }});
    
    $('.singel-bar-chart-wrapper').hide();

    window.submitCampaign = function() {
        console.log($(".channel_list li input:checkbox"));
        $("input:checkbox").each(function(){
            var $this = $(this);
            if($this.is(":checked")){
                console.log($this.attr("id"));
                let id =  $this.attr("id");
                let req = {
                    "channel":"",
                    "template":""
                };
                if(id === "webpush" || id=== "whatsapp" || id === "email"){
                    req.channel = id;
                    $.ajax({url: "http://hackathon-env.23kccc2pvp.ap-south-1.elasticbeanstalk.com/triggercampaign",
                    type:"POST", 
                    data:JSON.stringify(req), 
                    contentType:'application/json; charset=utf-8',
                    dataType: "json",
                    success: function(result){
                    }});
                }
            }
        });
    }

    $('#campaign_section').hide();

    drawLineChart();

    function drawPieChartForCampaignResults(input) {
        if(input.length>0) {
            //pie chart
            var ctx = document.getElementById( "pieChartForCampaignResult" );
            ctx.height = 150;
            var myChart = new Chart( ctx, {
                type: 'pie',
                data: {
                    datasets: [ {
                        data: input,
                        backgroundColor: [
                            "rgba(36, 168, 216,0.9)",
                            "rgba(224, 97, 59,0.7)"
                                        ],
                        hoverBackgroundColor: [
                            "rgba(36, 168, 216,0.7)",
                            "rgba(224, 97, 59,0.7)"
                                        ]

                                    } ],
                    labels: [
                                    "Success",
                                    "Failed"
                                ]
                },
                options: {
                    responsive: true
                }
            } );
            ctx.onclick = function(evt) {
                var activePoints = myChart.getElementsAtEvent(evt);
                if (activePoints[0]) {
                var chartData = activePoints[0]['_chart'].config.data;
                var idx = activePoints[0]['_index'];
        
                var label = chartData.labels[idx];
                
                drawDrillDownChart(label, 'campaignDetails');
                }
            };
        }
    }

    function drawPieChart(input) {
        if(input.length>0) {
            //pie chart
            var ctx = document.getElementById( "pieChart" );
            ctx.height = 150;
            var myChart = new Chart( ctx, {
                type: 'pie',
                data: {
                    datasets: [ {
                        data: input,
                        backgroundColor: [
                            "rgba(36, 168, 216,0.9)",
                            "rgba(224, 97, 59,0.7)"
                                        ],
                        hoverBackgroundColor: [
                            "rgba(36, 168, 216,0.9)",
                            "rgba(224, 97, 59,0.7)"
                                        ]

                                    } ],
                    labels: [
                                    "Active",
                                    "Inactive"
                                ]
                },
                options: {
                    responsive: true
                }
            } );
        }
    }

    function drawDoughnutChart(input) {
        //doughut chart
        if(input.length>0) {
            var ctx = document.getElementById( "doughutChart" );
            ctx.height = 150;
            var myChart = new Chart( ctx, {
                type: 'doughnut',
                data: {
                    datasets: [ {
                        data: input,
                        backgroundColor: [
                            "rgba(36, 168, 216, 0.9)",
                            // "rgba(0, 123, 255,0.7)",
                            "rgba(36, 168, 216, 0.6)",
                            "rgba(224, 97, 59,0.7)"
                                        ],
                        hoverBackgroundColor: [
                            "rgba(36, 168, 216, 0.7)",
                            // "rgba(0, 123, 255,0.7)",
                            "rgba(36, 168, 216, 0.4)",
                            "rgba(224, 97, 59,0.7)"
                                        ]
    
                                    } ],
                    labels: [
                                    "Idle",
                                    "Dormant",
                                    "Inactive"
                                ]
                },
                options: {
                    responsive: true
                }
            } );
            ctx.onclick = function(evt) {
                var activePoints = myChart.getElementsAtEvent(evt);
                if (activePoints[0]) {
                var chartData = activePoints[0]['_chart'].config.data;
                var idx = activePoints[0]['_index'];
        
                var label = chartData.labels[idx];
                
                showCampaignSection(label);
                }
            };
        }
    }

    function showCampaignSection(label) {
        $("[data-toggle=popover]").popover({
            html: true,
            placement:"left",
            content:'<div class="card-body"><div class=""><h5>Campaign</h5><ul class="campaign_list"> <li class="campaign_list_active"> <div class="checkbox"><input type="checkbox" id="feedback">  <label for="feedback">Feedback</label></div> </li><li class="campaign_list_active"> <div class="checkbox"><input type="checkbox" id="anniversary"> <label for="anniversary">Anniversary</label></div> </li><li class="campaign_list_active"><div class="checkbox"> <input type="checkbox" id="business">  <label for="business">Business Update</label></div></li></ul> </div><div> <h5>Channels</h5><div><ul class="channel__list"><li><div class="checkbox"><input type="checkbox" id="email"> <label for="email">Email</label></div></li><li><div class="checkbox"><input type="checkbox" id="whatsapp"> <label for="whatsapp">Social Media</label></div></li><li><div class="checkbox"><input type="checkbox" id="webpush"> <label for="webpush">Web Notification</label></div></li><li><div class="checkbox"><input type="checkbox" id="sms"> <label for="sms">SMS</label></div></li></ul></div></div><div class="pull-right"><button type="button" class="btn-primary btn-submit" onclick="window.submitCampaign()">Submit</button></div></div>'
        });
    }
    
    function drawLineChart(input) {
        //Line chart
        var ctx = document.getElementById( "lineChart" );
        ctx.height = 150;
        var myChart = new Chart( ctx, {
            type: 'line',
            data: {
                labels: [ "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct" ],
                type: 'line',
                defaultFontFamily: 'Montserrat',
                datasets: [ {
                    label: "Messages sent",
                    data: [ 200, 150, 350, 200, 300, 550, 500 ],
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(36, 168, 216,0.9)',
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'rgba(36, 168, 216,0.9)',
                        }, {
                            label: "Messages read",
                    data: [ 120, 80, 200, 130, 190, 385, 410 ],
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(36, 168, 216,0.5)',
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'rgba(36, 168, 216,0.5)',
                        } ]
            },
            options: {
                responsive: true,

                tooltips: {
                    mode: 'index',
                    titleFontSize: 12,
                    titleFontColor: '#000',
                    bodyFontColor: '#000',
                    backgroundColor: '#fff',
                    titleFontFamily: 'Montserrat',
                    bodyFontFamily: 'Montserrat',
                    cornerRadius: 3,
                    intersect: false,
                },
                legend: {
                    display: false,
                    labels: {
                        usePointStyle: true,
                        fontFamily: 'Montserrat',
                    },
                },
                scales: {
                    xAxes: [ {
                        display: true,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Date'
                        }
                            } ],
                    yAxes: [ {
                        display: true,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'No: of communications'
                        }
                            } ]
                },
                title: {
                    display: false,
                    text: 'Normal Legend'
                }
            }
        } );
    }

    function drawDrillDownChart(identifier, parentChart) {
        let labelText = (identifier == 'Success') ? 'Successful Campaign Details' : 'Failed Campaign Details';
        var ctx;
        let input = [];
        if(identifier == 'Success') {
            input.push(campaignResultResponseData.successfullCampaign.split.email);
            input.push(campaignResultResponseData.successfullCampaign.split.webpush);
            input.push(campaignResultResponseData.successfullCampaign.split.whatsapp);
        } else if(identifier == 'Failed') {
            input.push(campaignResultResponseData.failedCampaigned.split.email);
            input.push(campaignResultResponseData.failedCampaigned.split.webpush);
            input.push(campaignResultResponseData.failedCampaigned.split.whatsapp);
        }
        // single bar chart
        $('.singel-bar-chart-wrapper').show();
        $("canvas#singelBarChart").remove();
        $("div#drillDownGraph").append('<canvas id="singelBarChart" class="animated fadeIn" height="150"></canvas>');
        var ctx = document.getElementById("singelBarChart").getContext("2d");
        ctx.height = 150;
        var myChart = new Chart( ctx, {
            type: 'bar',
            data: {
                labels: [ "Email", "Webpush", "WhatsApp" ],
                datasets: [
                    {
                        label:labelText,
                        data: input,
                        borderColor: "rgba(36, 168, 216,0.9)",
                        borderWidth: "0",
                        backgroundColor: "rgba(36, 168, 216,0.9)"
                                }
                            ]
            },
            options: {
                scales: {
                    yAxes: [ {
                        ticks: {
                            beginAtZero: true
                        }
                                    } ]
                }
            }
        } );
    }

} )( jQuery );

