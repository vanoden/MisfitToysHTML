/** 
 * sort.js
 *  Javascript handle for sortable website HTML tables
 */
var SortableTable = {
	columns: [],
	addColumn: function(element) {
	    element.sorted = 'none';
        this.columns.push(element);
        document.getElementById(element.id).innerHTML = '<i class="fa fa-sort" aria-hidden="true"></i> ' + element.columnText;
        document.getElementById(element.id).style.cursor = "pointer";
	},
	sortColumn: function(tableColumnId, direction) {
	    console.log('SortableTable: "' + tableColumnId + '" sorting direction-> ' + direction);
        this.columns.forEach(function(column) {
            if (column) {
                if (column.id != tableColumnId) column.sorted = 'none';
                if (column.id == tableColumnId) column.sorted = direction;
                SortableTable.applyIcon(column.id, column.sorted, column.columnText);
            }
        });
	},
	applyIcon: function (elementId, sortDirection, columnText) {
	    var icon = 'fa fa-sort';
	    if (sortDirection == 'up') icon = 'fa fa-sort-asc';
	    if (sortDirection == 'down') icon = 'fa fa-sort-desc';
	    document.getElementById(elementId).innerHTML = '<i class="' + icon + '" aria-hidden="true"></i> ' + columnText;
	}
}

// document loaded - start table sort
window.addEventListener('DOMContentLoaded', (event) => {        
    var columns = document.getElementsByClassName("sortableHeader");
    for(var i = 0; i < columns.length; i++) SortableTable.addColumn({id: columns[i].id, columnText: columns[i].innerHTML});
});
