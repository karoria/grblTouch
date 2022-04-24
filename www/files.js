var filePath = '';
var fileUrl;
var sdSize;
var sdUsed;
var sdOccupation;
function updateFileUrl() {
    fileUrl = new URL('http://' + serverUrl + '/upload?path=/' + filePath);
    return Promise.resolve(fileUrl);
}
function backOneLevel() {
    filePath = filePath + '../'     //adding '../' after URL takes it one directory up
    reloadList();
}
function reloadList() {
    updateFileUrl().then(
        () => {
            fetch(fileUrl).then(function (response) {
                return response.text();
            }).then(function (text) {
                fileJson = text;
                return fileJson;
            }).then(function makeTable() {
                //console.log(fileJson);
                fileStr = JSON.parse(fileJson);
                var k = '<tbody>'
                for (i = 0; i < fileStr.files.length; i++) {
                    k += '<tr>';
                    if (fileStr.files[i].name != 'www') {       //system directory "www" will not be listed in files table
                        k += '<td>' + fileStr.files[i].name + '</td>';
                        k += '<td>' + fileStr.files[i].size + '</td>';
                    }
                    k += '</tr>';
                }
                k += '</tbody>';
                document.getElementById('tabledata').innerHTML = k;
                sdSize = fileStr.total;
                sdUsed = fileStr.used;
                sdOccupation = fileStr.occupation;
                document.getElementById('sdsize').innerHTML = sdUsed + '/' + sdSize;
                document.getElementById('sdpercent').innerHTML = sdOccupation + '%';
                document.getElementById('sdprogressbar').style.width = sdOccupation + "%";
            }).then(function tableFunc() {
                var table = document.getElementById('tabledata');
                var cells = table.getElementsByTagName('td');
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if (cell.innerHTML == '-1') {   //replacing innerText with innerHTML solved first instance folder color issue
                        cell.innerHTML = 'Dir';
                        cell.parentElement.className = 'directory';  //to style directory row in different background color
                    }
                    cell.onclick = function () {
                        var rows = table.getElementsByTagName('tr');
                        var rowId = this.parentNode.rowIndex - 1;
                        for (var row = 0; row < rows.length; row++) { //this is required to stop multiple selection
                            rows[row].classList.remove('selected');
                        }
                        var rowSelected = table.getElementsByTagName('tr')[rowId];
                        rowSelected.className += 'selected';
                        if (rowSelected.cells[1].innerText == 'Dir') {   //these are directories
                            filePath = filePath + rowSelected.cells[0].innerText + '/';
                            reloadList();
                        }
                        else {
                            selectedFile = filePath + rowSelected.cells[0].innerHTML;
                        }
                    }
                }
            })
        }
    )
}
reloadList(); //this loads the file table but folder background color doesn't apply for the first instance