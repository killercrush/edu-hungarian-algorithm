/**
 * Created by Admin on 17.01.2015.
 */
"use strict";
// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printArray(arr, markCell, caption, row_id) {
    var block_table = document.createElement('div');
    block_table.setAttribute('class', 'col-md-8');
    var panel =  document.createElement('div');
    var panel_body = document.createElement('div');
    var tbl = document.createElement('table');
    var panel_header = document.createElement('div');

    var row, cell, i, j;
    for (i = 0; i < arr.length; ++i) {
        row = tbl.insertRow(i);
        for ( j = 0; j < arr[i].length; ++j) {
            cell = row.insertCell(j);
            cell.innerHTML = '<b>' + arr[i][j].toString() + '<b>';
            var setColor = function(p_cell, p_i, p_j) {
                return function(item) {
                    if ((item.row === p_i) && (item.col === p_j))
                        p_cell.setAttribute('class', item.color);
                };
            }(cell, i, j);
            if (markCell !== undefined) markCell.forEach(setColor);
        }
    }

    tbl.setAttribute('class', 'bordered');
    panel.setAttribute('class', 'panel panel-default');
    panel_body.setAttribute('class', 'panel-body');
    panel_header.setAttribute('class', 'panel-heading');
    panel_header.innerHTML = '<h3 class="panel-title">' + caption.toString() + '</h3>';

    document.getElementById(row_id).appendChild(block_table);
    block_table.appendChild(panel);
    panel.appendChild(panel_header);
    panel.appendChild(panel_body);
    panel_body.appendChild(tbl);

}

function addRow(header, id){
    var container_row = document.createElement('div');
    container_row.setAttribute('class', 'row bs-callout');
    container_row.setAttribute('id', id);
    container_row.innerHTML = "<h3>" + header + "</h3>";
    document.getElementById('main').appendChild(container_row);
}

function addInfo(row_id, info, title){
    var block_info = document.createElement('div');
    var panel =  document.createElement('div');
    var panel_body = document.createElement('div');
    var panel_header = document.createElement('div');
    block_info.setAttribute('class', 'col-md-4');
    panel.setAttribute('class', 'panel panel-default');
    panel_body.setAttribute('class', 'panel-body');
    panel_header.setAttribute('class', 'panel-heading');
    document.getElementById(row_id).appendChild(block_info);
    block_info.appendChild(panel);
    panel.appendChild(panel_header);
    panel.appendChild(panel_body);
    panel_header.innerHTML = '<h3 class="panel-title">'+ title + '</h3>';
    panel_body.innerHTML = info;
}

function solveAssignmentProblem(arr){
    var u, v, minimums, i, j, solution, curRow, markedCol, delta, rowCount, colCount;
    var used, way, colNumOfMinimum;
    solution = [];
    used = [];
    minimums = [];
    way = [];
    v = [];
    u = [];
    rowCount =  arr.length;
    colCount =  arr[0].length;
    for(j = 0; j < colCount; ++j){
        u[j] = 0;
        v[j] = 0;
    }
    // основной цикл по строкам
    for(i = 0; i < rowCount; ++i){
        for(j = 0; j < colCount; ++j){
            minimums[j] = Infinity;
            used[j] = false;
        }
        addRow('Обработка <span class="label label-primary">' + (i + 1).toString() + '</span> строки', 'row' + i.toString()); // вывод
        curRow = i;
        markedCol = undefined;
        colNumOfMinimum = 0;
        // коллизии (чередующася цепь)
        do {
            delta = Infinity;
            // находим минимум
            for(j = 0; j < colCount; ++j){
                if (!used[j]) {
                    if (arr[curRow][j] - u[curRow] - v[j] < minimums[j]) {
                        minimums[j] = arr[curRow][j] - u[curRow] - v[j];
                        way[j] = markedCol;
                    }
                    if(minimums[j] < delta) {
                        delta = minimums[j];
                        colNumOfMinimum = j;
                    }
                }
            }

            // пересчитываем минимумы и потенциал
            for(j = 0; j < colCount; ++j) {
                if (used[j]) {
                    u[solution[j]] += delta;
                    v[j] -= delta;
                }
                else minimums[j] -= delta;
            }
            u[i] += delta;
            //-----------------------------------------------------------------------------------------
            var i1, j1, p, panel_header;
            var tmp_arr = [];
            var markedCell = [];
            var minRow = solution[way[colNumOfMinimum]] === undefined ? i: solution[way[colNumOfMinimum]];
            markedCell[0] = {row: minRow, col: colNumOfMinimum, color: "yellow"};
            markedCell[1] = {row: solution[colNumOfMinimum], col: colNumOfMinimum, color: "red"};

            if (solution[colNumOfMinimum] === undefined) {
                panel_header = "Для найденного минимума коллизий нет";
                markedCell[0].color = "green";
            }
            else panel_header = "Обнаружена коллизия";
            for(i1 = 0; i1 <= i; ++i1){
                tmp_arr[i1] = [];
                for(j1 = 0; j1 < colCount; ++j1) tmp_arr[i1][j1] = arr[i1][j1] - u[i1] - v[j1];
            }
            p = "<p><b>Минимумы:</b> [" +  minimums.toString() + "]<br>";
            p += "<b>Потенциал:</b> <b>u</b> = [" + u.toString() + "] <b>v</b> = [" + v.toString() + "]<br>";
            p += "<b>Путь:</b> = [" +  way.toString() + "]<br></p>";
            printArray(tmp_arr, markedCell, panel_header, "row" + i.toString());
            addInfo("row" + i.toString(), p, "Значения вспомогательных массивов");
            //----------------------------------------------------------------------------------------
            used[colNumOfMinimum] = true;
            markedCol = colNumOfMinimum;
            curRow = solution[colNumOfMinimum];
            } while(curRow != undefined);
        markedCell = []; // вывод
        j1 = 0; // вывод
        for(i1 in solution) markedCell[j1++] = {row: solution[i1], col: Number(i1), color: "yellow"};// вывод
        console.log(markedCell);// вывод
        printArray(tmp_arr, markedCell, "Старые минимумы", "row" + i.toString());// вывод
        while (way[colNumOfMinimum] != undefined){
            solution[colNumOfMinimum] = solution[way[colNumOfMinimum]];
            colNumOfMinimum = way[colNumOfMinimum];
        }
        solution[colNumOfMinimum] = i;
        j1 = 0; // вывод
        for(i1 in solution) markedCell[j1++] = {row: solution[i1], col: Number(i1), color: "green"};// вывод
        console.log(markedCell);// вывод
        printArray(tmp_arr, markedCell, "Новые минимумы", "row" + i.toString());// вывод
    }
return solution;
}

function createEmptyTable() {
    if (document.getElementById('priceTable')) return;
    var n = document.getElementById('elemCount').value;
    var tbl = document.createElement('table');
    var row, cell, i, j, input;
    for (i = 0; i < n ; ++i) {
        row = tbl.insertRow(i);
        for ( j = 0; j < n; ++j) {
            cell = row.insertCell(j);
            input = document.createElement('input');
            input.setAttribute('id', 'cell_input' + (i * n + j).toString());
            input.setAttribute('type', 'text');
            input.setAttribute('class', 'cell-input form-control');
            cell.appendChild(input);
        }
    }
    tbl.setAttribute('class', 'table table-bordered');
    tbl.setAttribute('id', 'priceTable');
    document.getElementById('tabCont').appendChild(tbl);
}

function fillTableWithRandomValues() {
    var cell_input;
    var i = -1;
    while (cell_input = document.getElementById('cell_input' + (++i).toString()))
        cell_input.value = getRandomInt(1, 99);
}
function removePriceTable() {
    var tbl = document.getElementById('priceTable');
    if (tbl) tbl.parentNode.removeChild(tbl);
}
function CreateArray(){
    var cell_input;
    var array = [];
    var array2d = [];
    var i = -1;
    var j = 0;
    //while (i < (500 * 500) - 1) // для теста скорости
    //    array[++i] = getRandomInt(1, 99);
    while (cell_input = document.getElementById('cell_input' + (++i).toString()))
        array[i] = parseInt(cell_input.value);
    var n = Math.sqrt(array.length);
    for (i = 0; i < n; ++i) {
        array2d[i] = [];
        for (j = 0; j < n; ++j) array2d[i][j] = array[i * n + j];
    }
    var rows = document.getElementsByClassName("row bs-callout");
    for (i in rows)
        if (rows[i].parentNode !== undefined)rows[i].parentNode.removeChild(rows[i]);
    addRow("Строки  - это рабочие, столбцы - задания", "origin");
    printArray(array2d, undefined,  "Исходный массив", "origin");
    var time_start = Date.now();
    var res = solveAssignmentProblem(array2d);
    var time_end = Date.now();
    var markedCell = [];
    var sol_str = "<p>";
    var sol_sum = 0;
    for(i = 0; i < res.length; ++i) {
        markedCell[i] = {row: res[i], col: i, color: "green"};
        sol_str += (array2d[res[i]][i]).toString() + " + ";
        sol_sum += array2d[res[i]][i];
    }
    sol_str = sol_str.slice(0, -2) + "= <b>" + sol_sum.toString() + "</b></p>";
    sol_str += "<p>Время выполнения алгоритма (+ отрисовка таблиц): <b>" + (time_end - time_start).toString() + " мс</b></p>";
    addRow("", "result");
    printArray(array2d, markedCell, "Оптимальное решение", "result");
    addInfo("result", sol_str, "Суммарные расходы");
}