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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9551724137931035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "-68-1"], "isController": false}, {"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-68-0"], "isController": false}, {"data": [1.0, 500, 1500, "-66-1"], "isController": false}, {"data": [1.0, 500, 1500, "-66-0"], "isController": false}, {"data": [1.0, 500, 1500, "-68-2"], "isController": false}, {"data": [1.0, 500, 1500, "-133"], "isController": false}, {"data": [1.0, 500, 1500, "-130"], "isController": false}, {"data": [1.0, 500, 1500, "-132"], "isController": false}, {"data": [1.0, 500, 1500, "-131"], "isController": false}, {"data": [1.0, 500, 1500, "-8-1"], "isController": false}, {"data": [1.0, 500, 1500, "-8-0"], "isController": false}, {"data": [1.0, 500, 1500, "-138"], "isController": false}, {"data": [1.0, 500, 1500, "-137"], "isController": false}, {"data": [1.0, 500, 1500, "-139"], "isController": false}, {"data": [1.0, 500, 1500, "-39-0"], "isController": false}, {"data": [1.0, 500, 1500, "-39-1"], "isController": false}, {"data": [1.0, 500, 1500, "-7"], "isController": false}, {"data": [1.0, 500, 1500, "-8"], "isController": false}, {"data": [1.0, 500, 1500, "-66"], "isController": false}, {"data": [1.0, 500, 1500, "-67"], "isController": false}, {"data": [1.0, 500, 1500, "-23"], "isController": false}, {"data": [1.0, 500, 1500, "-68"], "isController": false}, {"data": [1.0, 500, 1500, "-24"], "isController": false}, {"data": [1.0, 500, 1500, "-26"], "isController": false}, {"data": [1.0, 500, 1500, "-27"], "isController": false}, {"data": [1.0, 500, 1500, "-28"], "isController": false}, {"data": [1.0, 500, 1500, "-141"], "isController": false}, {"data": [1.0, 500, 1500, "-29"], "isController": false}, {"data": [1.0, 500, 1500, "-140"], "isController": false}, {"data": [1.0, 500, 1500, "-143"], "isController": false}, {"data": [1.0, 500, 1500, "-142"], "isController": false}, {"data": [1.0, 500, 1500, "-67-1"], "isController": false}, {"data": [1.0, 500, 1500, "-67-0"], "isController": false}, {"data": [1.0, 500, 1500, "-31"], "isController": false}, {"data": [1.0, 500, 1500, "-32"], "isController": false}, {"data": [1.0, 500, 1500, "-33"], "isController": false}, {"data": [0.5, 500, 1500, "-38"], "isController": false}, {"data": [1.0, 500, 1500, "-114"], "isController": false}, {"data": [1.0, 500, 1500, "-39"], "isController": false}, {"data": [1.0, 500, 1500, "-7-0"], "isController": false}, {"data": [1.0, 500, 1500, "-7-1"], "isController": false}, {"data": [1.0, 500, 1500, "-116"], "isController": false}, {"data": [1.0, 500, 1500, "-115"], "isController": false}, {"data": [1.0, 500, 1500, "-118"], "isController": false}, {"data": [1.0, 500, 1500, "-117"], "isController": false}, {"data": [1.0, 500, 1500, "-38-1"], "isController": false}, {"data": [0.9, 500, 1500, "-38-0"], "isController": false}, {"data": [1.0, 500, 1500, "-123"], "isController": false}, {"data": [1.0, 500, 1500, "-122"], "isController": false}, {"data": [1.0, 500, 1500, "-125"], "isController": false}, {"data": [1.0, 500, 1500, "-124"], "isController": false}, {"data": [1.0, 500, 1500, "-121"], "isController": false}, {"data": [1.0, 500, 1500, "-127"], "isController": false}, {"data": [1.0, 500, 1500, "-126"], "isController": false}, {"data": [1.0, 500, 1500, "-129"], "isController": false}, {"data": [1.0, 500, 1500, "-128"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 560, 0, 0.0, 175.9964285714286, 116, 1231, 141.0, 291.60000000000014, 411.3999999999992, 627.0699999999998, 35.010940919037196, 133.2889062011566, 31.38676148796499], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-68-1", 10, 0, 0.0, 148.1, 126, 221, 143.0, 214.60000000000002, 221.0, 221.0, 1.2075836251660428, 0.6521423288250211, 0.955217516000483], "isController": false}, {"data": ["", 20, 0, 0.0, 3647.399999999999, 1768, 6207, 3583.5, 5507.7, 6172.049999999999, 6207.0, 1.2379301807378065, 113.89979196970167, 22.98905253853058], "isController": true}, {"data": ["-68-0", 10, 0, 0.0, 142.49999999999997, 128, 161, 139.5, 160.8, 161.0, 161.0, 1.2030798845043311, 0.4770023760827719, 0.9516549867661214], "isController": false}, {"data": ["-66-1", 10, 0, 0.0, 151.5, 137, 191, 147.5, 188.10000000000002, 191.0, 191.0, 1.1997600479904018, 3.644036817636472, 0.9373125374925014], "isController": false}, {"data": ["-66-0", 10, 0, 0.0, 142.29999999999998, 118, 185, 139.5, 183.0, 185.0, 185.0, 1.198609612849095, 0.45181963921850654, 0.9364137600383555], "isController": false}, {"data": ["-68-2", 10, 0, 0.0, 141.10000000000002, 127, 170, 138.0, 168.5, 170.0, 170.0, 1.2110936175366356, 2.9781785530459004, 1.0135812795204069], "isController": false}, {"data": ["-133", 10, 0, 0.0, 145.10000000000002, 117, 221, 138.5, 214.00000000000003, 221.0, 221.0, 1.2125621438098702, 1.8322240284345823, 0.8419254728992361], "isController": false}, {"data": ["-130", 10, 0, 0.0, 139.9, 121, 187, 132.0, 184.10000000000002, 187.0, 187.0, 1.2088974854932302, 3.1662725157156673, 0.8488254805367504], "isController": false}, {"data": ["-132", 10, 0, 0.0, 142.49999999999997, 129, 162, 141.0, 161.1, 162.0, 162.0, 1.2106537530266344, 2.2510593220338984, 0.8500586410411622], "isController": false}, {"data": ["-131", 10, 0, 0.0, 141.70000000000002, 126, 170, 139.5, 168.3, 170.0, 170.0, 1.20962864400629, 2.9257892826902143, 0.8481575843715979], "isController": false}, {"data": ["-8-1", 10, 0, 0.0, 151.79999999999998, 123, 188, 146.0, 186.70000000000002, 188.0, 188.0, 1.2265423770391266, 5.353905387587391, 0.8875663099472586], "isController": false}, {"data": ["-8-0", 10, 0, 0.0, 136.6, 120, 154, 136.5, 153.7, 154.0, 154.0, 1.2331976815883585, 0.4744920767048958, 0.8923823066962634], "isController": false}, {"data": ["-138", 10, 0, 0.0, 141.89999999999998, 118, 221, 133.5, 214.60000000000002, 221.0, 221.0, 1.2146240738491436, 2.3758711132029635, 0.8504740829588242], "isController": false}, {"data": ["-137", 10, 0, 0.0, 145.0, 134, 157, 143.5, 156.8, 157.0, 157.0, 1.2306177701206005, 28.151583266674873, 0.8965242739355157], "isController": false}, {"data": ["-139", 10, 0, 0.0, 144.8, 125, 167, 143.5, 166.2, 167.0, 167.0, 1.2272950417280315, 3.532068835910653, 0.858147704958272], "isController": false}, {"data": ["-39-0", 10, 0, 0.0, 140.5, 131, 162, 137.0, 161.0, 162.0, 162.0, 1.2025012025012025, 0.44624068061568056, 0.9735092742905243], "isController": false}, {"data": ["-39-1", 10, 0, 0.0, 148.7, 133, 167, 145.5, 166.8, 167.0, 167.0, 1.203804020705429, 6.327847560792103, 0.9745639972312508], "isController": false}, {"data": ["-7", 10, 0, 0.0, 294.7, 263, 316, 296.0, 315.4, 316.0, 316.0, 1.2140342357654486, 5.771286383088503, 1.7024933228117032], "isController": false}, {"data": ["-8", 10, 0, 0.0, 288.8, 250, 318, 281.0, 317.7, 318.0, 318.0, 1.2071463061323031, 5.733709183365524, 1.747061353211009], "isController": false}, {"data": ["-66", 10, 0, 0.0, 294.1, 255, 324, 299.0, 323.5, 324.0, 324.0, 1.1789672247111531, 4.025298057651497, 1.8421362886111767], "isController": false}, {"data": ["-67", 10, 0, 0.0, 283.6, 257, 314, 282.5, 312.7, 314.0, 314.0, 1.1893434823977165, 2.369395218839201, 1.8978391115604187], "isController": false}, {"data": ["-23", 10, 0, 0.0, 141.8, 127, 169, 138.0, 167.20000000000002, 169.0, 169.0, 1.2281994595922379, 7.629469494595923, 0.8671759856300664], "isController": false}, {"data": ["-68", 10, 0, 0.0, 432.8, 389, 494, 431.5, 491.0, 494.0, 494.0, 1.1665888940737283, 3.961275628499767, 2.821914736934205], "isController": false}, {"data": ["-24", 10, 0, 0.0, 131.6, 120, 146, 131.0, 145.3, 146.0, 146.0, 1.2303149606299213, 1.5991691529281495, 0.8686696450541338], "isController": false}, {"data": ["-26", 10, 0, 0.0, 131.5, 118, 150, 129.5, 149.6, 150.0, 150.0, 1.2339585389930898, 2.5209387339585394, 0.915828603158934], "isController": false}, {"data": ["-27", 10, 0, 0.0, 134.1, 120, 165, 131.0, 162.70000000000002, 165.0, 165.0, 1.2368583797155226, 3.497990105132962, 0.9155650896722324], "isController": false}, {"data": ["-28", 10, 0, 0.0, 134.3, 123, 150, 132.5, 149.5, 150.0, 150.0, 1.2350253180190194, 4.389043588674818, 0.9130021149808571], "isController": false}, {"data": ["-141", 10, 0, 0.0, 133.3, 117, 161, 130.5, 160.9, 161.0, 161.0, 1.2304663467454167, 2.227696836163406, 0.8603651408883967], "isController": false}, {"data": ["-29", 10, 0, 0.0, 146.3, 133, 169, 146.5, 167.6, 169.0, 169.0, 1.2379301807378065, 27.28402954010894, 0.8933890659816787], "isController": false}, {"data": ["-140", 10, 0, 0.0, 135.6, 121, 164, 131.5, 162.8, 164.0, 164.0, 1.2295585884667404, 2.7737112689044636, 0.8621319008975779], "isController": false}, {"data": ["-143", 10, 0, 0.0, 136.8, 119, 150, 136.5, 149.9, 150.0, 150.0, 1.2376237623762376, 2.1743019028465347, 0.8665783570544554], "isController": false}, {"data": ["-142", 10, 0, 0.0, 139.2, 121, 160, 137.5, 159.1, 160.0, 160.0, 1.2338062924120914, 3.035115283775447, 0.8614956045650832], "isController": false}, {"data": ["-67-1", 10, 0, 0.0, 145.70000000000002, 137, 168, 142.0, 167.2, 168.0, 168.0, 1.2078753472641623, 1.9108965454765068, 0.963705233119942], "isController": false}, {"data": ["-67-0", 10, 0, 0.0, 137.79999999999998, 120, 154, 136.5, 153.8, 154.0, 154.0, 1.2135922330097086, 0.49776243932038833, 0.9682664593446602], "isController": false}, {"data": ["-31", 10, 0, 0.0, 130.4, 121, 143, 129.5, 142.8, 143.0, 143.0, 1.2373174956693886, 3.095710374907201, 0.9352380289532293], "isController": false}, {"data": ["-32", 10, 0, 0.0, 150.2, 127, 190, 149.5, 187.8, 190.0, 190.0, 1.2368583797155226, 25.85444689239332, 0.8889919604205317], "isController": false}, {"data": ["-33", 10, 0, 0.0, 140.7, 117, 163, 139.0, 163.0, 163.0, 163.0, 1.2388503468780971, 27.275274482779984, 0.895262945986125], "isController": false}, {"data": ["-38", 10, 0, 0.0, 681.3, 575, 1231, 615.5, 1176.1000000000001, 1231.0, 1231.0, 1.0615711252653928, 5.568790638269639, 3.2018187699044587], "isController": false}, {"data": ["-114", 10, 0, 0.0, 134.6, 119, 174, 131.5, 171.0, 174.0, 174.0, 1.211680600993578, 2.0683766509148187, 0.849596358899794], "isController": false}, {"data": ["-39", 10, 0, 0.0, 289.3, 264, 329, 294.5, 326.40000000000003, 329.0, 329.0, 1.1830119484206791, 6.657561479652195, 1.9154627055483262], "isController": false}, {"data": ["-7-0", 10, 0, 0.0, 142.8, 126, 171, 136.0, 170.5, 171.0, 171.0, 1.2379301807378065, 0.47631297969794506, 0.8401967535281011], "isController": false}, {"data": ["-7-1", 10, 0, 0.0, 151.39999999999998, 137, 167, 149.0, 166.7, 167.0, 167.0, 1.2328936012822094, 5.386565119898902, 0.8921622642090987], "isController": false}, {"data": ["-116", 10, 0, 0.0, 139.0, 122, 166, 137.0, 165.0, 166.0, 166.0, 1.2017786323759163, 2.2793891208989305, 0.8403061531065978], "isController": false}, {"data": ["-115", 10, 0, 0.0, 132.10000000000002, 119, 156, 128.0, 155.6, 156.0, 156.0, 1.2081672103419112, 1.6482515555152835, 0.8447731666062583], "isController": false}, {"data": ["-118", 10, 0, 0.0, 132.1, 119, 157, 128.5, 155.8, 157.0, 157.0, 1.2084592145015105, 2.5844977341389725, 0.8378965256797583], "isController": false}, {"data": ["-117", 10, 0, 0.0, 135.29999999999998, 125, 158, 132.5, 156.4, 158.0, 158.0, 1.20033609410635, 2.1105518920297683, 0.8381253000840235], "isController": false}, {"data": ["-38-1", 10, 0, 0.0, 164.49999999999997, 130, 194, 163.5, 193.5, 194.0, 194.0, 1.192890373374687, 5.325719648395563, 1.0775621048550639], "isController": false}, {"data": ["-38-0", 10, 0, 0.0, 515.7, 412, 1032, 444.0, 983.9000000000001, 1032.0, 1032.0, 1.0811979673478214, 0.8446859119904854, 2.284347463239269], "isController": false}, {"data": ["-123", 10, 0, 0.0, 140.0, 124, 168, 136.5, 166.9, 168.0, 168.0, 1.20598166907863, 2.0731343086710083, 0.8514890104920405], "isController": false}, {"data": ["-122", 10, 0, 0.0, 142.4, 123, 176, 140.0, 174.4, 176.0, 176.0, 1.199184554502938, 2.4042245023384097, 0.8384923252188511], "isController": false}, {"data": ["-125", 10, 0, 0.0, 142.30000000000004, 118, 159, 143.5, 159.0, 159.0, 159.0, 1.205109664979513, 2.4090424650518196, 0.8473427331887202], "isController": false}, {"data": ["-124", 10, 0, 0.0, 146.0, 125, 170, 146.5, 169.0, 170.0, 170.0, 1.2026458208057726, 2.293835500601323, 0.8397380487071557], "isController": false}, {"data": ["-121", 10, 0, 0.0, 140.8, 124, 163, 134.5, 162.8, 163.0, 163.0, 1.2020675561966583, 2.154447837780983, 0.8416820681572303], "isController": false}, {"data": ["-127", 10, 0, 0.0, 136.60000000000002, 120, 165, 136.0, 163.10000000000002, 165.0, 165.0, 1.2030798845043311, 2.7668487578200196, 0.837691364894129], "isController": false}, {"data": ["-126", 10, 0, 0.0, 147.79999999999998, 129, 214, 135.5, 209.60000000000002, 214.0, 214.0, 1.2023566189731876, 3.2489460592761814, 0.8418844685583744], "isController": false}, {"data": ["-129", 10, 0, 0.0, 145.0, 122, 164, 141.5, 163.7, 164.0, 164.0, 1.2040939193257074, 2.3270526038531005, 0.8360456803130645], "isController": false}, {"data": ["-128", 10, 0, 0.0, 129.5, 116, 161, 127.5, 159.0, 161.0, 161.0, 1.2046741356463078, 2.187001189615709, 0.8564480183110469], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 560, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
