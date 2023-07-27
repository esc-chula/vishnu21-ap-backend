var ss = SpreadsheetApp.openById(
    '1M7n46c270oqOsKqVWDuPod9h8Tq-Dd271FFNAEGt5RY'
);

function doGet(e) {
    var action = e.parameter.action;

    if (action == 'getSlots') {
        var sheetName = e.parameter.sheet;

        return getSlots(sheetName);
    } else {
        var result = JSON.stringify({ success: false });
        return ContentService.createTextOutput(result).setMimeType(
            ContentService.MimeType.JSON
        );
    }
}

function doPost(e) {
    var action = e.parameter.action;

    if (action == 'updateSlots') {
        var sheetName = e.parameter.sheet;
        var updateObject = JSON.parse(e.postData.contents);
        return updateSlots(sheetName, updateObject);
    } else {
        var result = JSON.stringify({ success: false });
        return ContentService.createTextOutput(result).setMimeType(
            ContentService.MimeType.JSON
        );
    }
}

function getSlots(sheetName) {
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
        return ContentService.createTextOutput(
            JSON.stringify({ success: false })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet
        .getRange(3, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
        .getValues();
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var record = {};

        record['slot'] = row[0];
        record['start'] = row[1];
        record['end'] = row[2];
        record['duration'] = row[3];
        record['department'] = row[4];
        record['event'] = row[5];
        record['location'] = row[6];
        record['contact'] = row[7];
        record['note'] = row[8];

        if (!isNaN(Number(row[0]))) {
            data.push(record);
        }
    }
    var result = JSON.stringify({ success: true, data: data });
    return ContentService.createTextOutput(result).setMimeType(
        ContentService.MimeType.JSON
    );
}

function updateSlots(sheetName, updateObject) {
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
        return ContentService.createTextOutput(
            JSON.stringify({ success: false })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    for (var cellPosition in updateObject) {
        var value = updateObject[cellPosition];
        var cell = sheet.getRange(cellPosition);
        cell.setValue(value);
    }

    var result = JSON.stringify({ success: true });
    return ContentService.createTextOutput(result).setMimeType(
        ContentService.MimeType.JSON
    );
}
