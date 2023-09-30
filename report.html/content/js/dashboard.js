/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Passangers Details 2"], "isController": false}, {"data": [0.0, 500, 1500, "Passangers Details 1"], "isController": false}, {"data": [0.0, 500, 1500, "Passangers Details 4"], "isController": false}, {"data": [0.0, 500, 1500, "Passangers Details 3"], "isController": false}, {"data": [0.0, 500, 1500, "Passangers Details 6"], "isController": false}, {"data": [0.0, 500, 1500, "Passangers Details 5"], "isController": false}, {"data": [0.0, 500, 1500, "Passangers Details 8"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 10"], "isController": false}, {"data": [0.0, 500, 1500, "Passangers Details 7"], "isController": false}, {"data": [0.5, 500, 1500, "Passangers Details 9"], "isController": false}, {"data": [0.5, 500, 1500, "Choose Flight 10"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 9"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 8"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 7"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 7"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 8"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 9"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 9"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 4"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 3"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 3"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 4"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 6"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 5"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 5"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 6"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 1"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 2"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url 2"], "isController": false}, {"data": [0.0, 500, 1500, "Choose Flight 1"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 1"], "isController": false}, {"data": [0.5, 500, 1500, "Find Flight 10"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 2"], "isController": false}, {"data": [0.5, 500, 1500, "Passangers Details 10"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 3"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 4"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 5"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 6"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 7"], "isController": false}, {"data": [0.0, 500, 1500, "Find Flight 8"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40, 0, 0.0, 1962.7500000000002, 1368, 3310, 1933.0, 2354.6, 3023.249999999999, 3310.0, 11.816838995568686, 27.876604043574595, 10.041428175775481], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Passangers Details 2", 1, 0, 0.0, 2164.0, 2164, 2164, 2164.0, 2164.0, 2164.0, 2164.0, 0.46210720887245843, 1.025300369685767, 0.4625584854436229], "isController": false}, {"data": ["Passangers Details 1", 1, 0, 0.0, 2174.0, 2174, 2174, 2174.0, 2174.0, 2174.0, 2174.0, 0.45998160073597055, 1.0825738845446182, 0.46357520699172033], "isController": false}, {"data": ["Passangers Details 4", 1, 0, 0.0, 2016.0, 2016, 2016, 2016.0, 2016.0, 2016.0, 2016.0, 0.496031746031746, 1.1955140128968254, 0.49942258804563494], "isController": false}, {"data": ["Passangers Details 3", 1, 0, 0.0, 2046.0, 2046, 2046, 2046.0, 2046.0, 2046.0, 2046.0, 0.4887585532746823, 1.1884851539589445, 0.4920996761974585], "isController": false}, {"data": ["Passangers Details 6", 1, 0, 0.0, 1761.0, 1761, 1761, 1761.0, 1761.0, 1761.0, 1761.0, 0.5678591709256104, 1.350883730834753, 0.5722955706984668], "isController": false}, {"data": ["Passangers Details 5", 1, 0, 0.0, 2107.0, 2107, 2107, 2107.0, 2107.0, 2107.0, 2107.0, 0.47460844803037494, 1.1350743058851447, 0.4806337505932605], "isController": false}, {"data": ["Passangers Details 8", 1, 0, 0.0, 1613.0, 1613, 1613, 1613.0, 1613.0, 1613.0, 1613.0, 0.6199628022318661, 1.4391128719776813, 0.6278334237445753], "isController": false}, {"data": ["Open Url 10", 1, 0, 0.0, 1509.0, 1509, 1509, 1509.0, 1509.0, 1509.0, 1509.0, 0.6626905235255136, 1.4302207587806495, 0.4245361166335322], "isController": false}, {"data": ["Passangers Details 7", 1, 0, 0.0, 1868.0, 1868, 1868, 1868.0, 1868.0, 1868.0, 1868.0, 0.5353319057815846, 1.1825398153104925, 0.540036971359743], "isController": false}, {"data": ["Passangers Details 9", 1, 0, 0.0, 1464.0, 1464, 1464, 1464.0, 1464.0, 1464.0, 1464.0, 0.6830601092896175, 1.666293118169399, 0.6877294655054645], "isController": false}, {"data": ["Choose Flight 10", 1, 0, 0.0, 1421.0, 1421, 1421, 1421.0, 1421.0, 1421.0, 1421.0, 0.7037297677691766, 1.7283987948627726, 0.635006157635468], "isController": false}, {"data": ["Find Flight 9", 1, 0, 0.0, 1541.0, 1541, 1541, 1541.0, 1541.0, 1541.0, 1541.0, 0.6489292667099286, 1.5741604477611941, 0.550068948734588], "isController": false}, {"data": ["Choose Flight 8", 1, 0, 0.0, 1625.0, 1625, 1625, 1625.0, 1625.0, 1625.0, 1625.0, 0.6153846153846154, 1.4789663461538463, 0.5552884615384616], "isController": false}, {"data": ["Open Url 7", 1, 0, 0.0, 1786.0, 1786, 1786, 1786.0, 1786.0, 1786.0, 1786.0, 0.5599104143337066, 1.1991050181970884, 0.35869260918253076], "isController": false}, {"data": ["Choose Flight 7", 1, 0, 0.0, 1689.0, 1689, 1689, 1689.0, 1689.0, 1689.0, 1689.0, 0.5920663114268797, 1.4917295737122558, 0.5342473357015985], "isController": false}, {"data": ["Open Url 8", 1, 0, 0.0, 1822.0, 1822, 1822, 1822.0, 1822.0, 1822.0, 1822.0, 0.5488474204171241, 1.1898840559824369, 0.3516053787047201], "isController": false}, {"data": ["Open Url 9", 1, 0, 0.0, 1671.0, 1671, 1671, 1671.0, 1671.0, 1671.0, 1671.0, 0.5984440454817475, 1.3833174371633752, 0.38337821663674443], "isController": false}, {"data": ["Choose Flight 9", 1, 0, 0.0, 2800.0, 2800, 2800, 2800.0, 2800.0, 2800.0, 2800.0, 0.35714285714285715, 0.8729771205357143, 0.322265625], "isController": false}, {"data": ["Choose Flight 4", 1, 0, 0.0, 1966.0, 1966, 1966, 1966.0, 1966.0, 1966.0, 1966.0, 0.5086469989827059, 1.2552255531536114, 0.4589744404883011], "isController": false}, {"data": ["Open Url 3", 1, 0, 0.0, 2154.0, 2154, 2154, 2154.0, 2154.0, 2154.0, 2154.0, 0.46425255338904364, 1.0373142989786444, 0.29741179201485607], "isController": false}, {"data": ["Choose Flight 3", 1, 0, 0.0, 2192.0, 2192, 2192, 2192.0, 2192.0, 2192.0, 2192.0, 0.4562043795620438, 1.1075430542883211, 0.41165317062043794], "isController": false}, {"data": ["Open Url 4", 1, 0, 0.0, 2156.0, 2156, 2156, 2156.0, 2156.0, 2156.0, 2156.0, 0.46382189239332094, 1.0825530496289424, 0.29713589981447125], "isController": false}, {"data": ["Choose Flight 6", 1, 0, 0.0, 1774.0, 1774, 1774, 1774.0, 1774.0, 1774.0, 1774.0, 0.5636978579481398, 1.4009873520293123, 0.5086492390078917], "isController": false}, {"data": ["Open Url 5", 1, 0, 0.0, 1889.0, 1889, 1889, 1889.0, 1889.0, 1889.0, 1889.0, 0.5293806246691372, 1.2391849192694546, 0.339134462678666], "isController": false}, {"data": ["Choose Flight 5", 1, 0, 0.0, 1900.0, 1900, 1900, 1900.0, 1900.0, 1900.0, 1900.0, 0.5263157894736842, 1.3497121710526316, 0.47491776315789475], "isController": false}, {"data": ["Open Url 6", 1, 0, 0.0, 3035.0, 3035, 3035, 3035.0, 3035.0, 3035.0, 3035.0, 0.32948929159802304, 0.7580827841845139, 0.21107907742998352], "isController": false}, {"data": ["Open Url 1", 1, 0, 0.0, 2080.0, 2080, 2080, 2080.0, 2080.0, 2080.0, 2080.0, 0.4807692307692308, 1.1202298677884615, 0.30799278846153844], "isController": false}, {"data": ["Choose Flight 2", 1, 0, 0.0, 2162.0, 2162, 2162, 2162.0, 2162.0, 2162.0, 2162.0, 0.46253469010175763, 1.2168637257169288, 0.41736528677150786], "isController": false}, {"data": ["Open Url 2", 1, 0, 0.0, 2050.0, 2050, 2050, 2050.0, 2050.0, 2050.0, 2050.0, 0.4878048780487805, 1.0561166158536586, 0.3125], "isController": false}, {"data": ["Choose Flight 1", 1, 0, 0.0, 2261.0, 2261, 2261, 2261.0, 2261.0, 2261.0, 2261.0, 0.4422821760283061, 1.1195267580716497, 0.39909055727554177], "isController": false}, {"data": ["Find Flight 1", 1, 0, 0.0, 2050.0, 2050, 2050, 2050.0, 2050.0, 2050.0, 2050.0, 0.4878048780487805, 1.1713986280487807, 0.4134908536585366], "isController": false}, {"data": ["Find Flight 10", 1, 0, 0.0, 1402.0, 1402, 1402, 1402.0, 1402.0, 1402.0, 1402.0, 0.7132667617689016, 1.5860433755349501, 0.6046050285306706], "isController": false}, {"data": ["Find Flight 2", 1, 0, 0.0, 2365.0, 2365, 2365, 2365.0, 2365.0, 2365.0, 2365.0, 0.4228329809725158, 0.9418769820295982, 0.35841701902748413], "isController": false}, {"data": ["Passangers Details 10", 1, 0, 0.0, 1368.0, 1368, 1368, 1368.0, 1368.0, 1368.0, 1368.0, 0.7309941520467835, 1.7768012152777777, 0.74027435124269], "isController": false}, {"data": ["Find Flight 3", 1, 0, 0.0, 3310.0, 3310, 3310, 3310.0, 3310.0, 3310.0, 3310.0, 0.3021148036253776, 0.7243084403323262, 0.256089501510574], "isController": false}, {"data": ["Find Flight 4", 1, 0, 0.0, 2009.0, 2009, 2009, 2009.0, 2009.0, 2009.0, 2009.0, 0.49776007964161273, 1.1160714285714286, 0.42192944250871084], "isController": false}, {"data": ["Find Flight 5", 1, 0, 0.0, 1859.0, 1859, 1859, 1859.0, 1859.0, 1859.0, 1859.0, 0.5379236148466917, 1.2392205150618611, 0.4559743141473911], "isController": false}, {"data": ["Find Flight 6", 1, 0, 0.0, 1993.0, 1993, 1993, 1993.0, 1993.0, 1993.0, 1993.0, 0.5017561465127948, 1.1573711113898644, 0.42531673356748617], "isController": false}, {"data": ["Find Flight 7", 1, 0, 0.0, 1892.0, 1892, 1892, 1892.0, 1892.0, 1892.0, 1892.0, 0.5285412262156448, 1.2671569437103594, 0.4480212737843552], "isController": false}, {"data": ["Find Flight 8", 1, 0, 0.0, 1566.0, 1566, 1566, 1566.0, 1566.0, 1566.0, 1566.0, 0.6385696040868455, 1.5558898068326947, 0.5412875159642401], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
