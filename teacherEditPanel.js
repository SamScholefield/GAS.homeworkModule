function doGet(e) {

  var app = UiApp.createApplication();  
  var ss = SpreadsheetApp.openById("0AlOOZ32SnnaCdGhRakZCb3JpLWsxZU5QQkxuQ01HWHc");  
  var formSheet = ss.getSheetByName("formData");  
  var dataSheet = ss.getSheetByName("teacherDetails");  
  var loggedInUser = Session.getActiveUser().getEmail();  
  var classLookuprange = ss.getRangeByName("teacherLookup");

  var ro = formSheet.getLastRow();
  var co = formSheet.getLastColumn();
  
  var eventLookuprange = formSheet.getRange("A3:M" + ro);
  var errorPanel = app.createVerticalPanel().setVisible(false).setId('errorPanel').setStyleAttribute('zIndex','10');

  //create arrays from rows in range using standard getRowsData function
  var classObjects = getRowsData(dataSheet, classLookuprange);

  //identify user as known or unknown, give error message if unknown, proceed if known
  var known = false;
  
  for (var i=0;i<classObjects.length;i++){  
    if(classObjects[i].username === loggedInUser){
     known = true; 
    };
  }
  
  if(known === false){
    var unknownUserPanel = app.createAbsolutePanel().setSize('600','800');
    var unknownUserWarning = app.createLabel('Your email address is not currently registered with the homework system.')
      .setStyleAttribute('fontSize', '15px').setStyleAttribute('fontWeight','bold').setStyleAttribute('color', 'red');
    var unknownUserLabel = app.createLabel('Please contact ict@nexus.edu.my')
      .setStyleAttribute('fontSize', '15px');
     
    unknownUserPanel.add(unknownUserWarning, 0 , 0 )
      .add(unknownUserLabel, 0 , 30);
      
    app.add(unknownUserPanel);
    
    return app;  
  }
  
  var k = 0;
  
  //create objects from formData
  var eventObjects = getRowsData(formSheet, eventLookuprange, 2);
  
  for(var i = 0; i < eventObjects.length; i++){
  
    if(eventObjects[i].username == loggedInUser){
      k++;
    }
  
  }
  
  if(k == 0){  
    var noEventPanel = app.createAbsolutePanel().setSize('800','800');
    var noEventWarning = app.createLabel('There are no homework events associated with your username.')
      .setStyleAttribute('fontSize', '15px').setStyleAttribute('fontWeight','bold').setStyleAttribute('color', 'red');
    var noEventLabel = app.createLabel('Please contact ict@nexus.edu.my if you believe this to be incorrect.')
      .setStyleAttribute('fontSize', '15px');
     
    noEventPanel.add(noEventWarning, 0 , 0 )
      .add(noEventLabel, 0 , 30);
      
    app.add(noEventPanel);
    
    return app;  
  }
  
  //create flexTable
  var flexTable = app.createFlexTable();
    flexTable.setStyleAttribute('marginTop', '10px')
    flexTable.setCellPadding(5);
    flexTable.setCellSpacing(2);
    flexTable.setText(1, 0, 'Class code');
    flexTable.setText(1, 1, 'Title');
    flexTable.setText(1, 2, 'Description');
    flexTable.setText(1, 3, 'Set date');
    flexTable.setText(1, 4, 'Due date');
    flexTable.setText(1, 5, 'Period');
    flexTable.setRowStyleAttribute(1, 'fontWeight', 'bold');
    

  
  var buttonHandler = app.createServerHandler('logCheck');
  
  k = 2;
  
  for(var i = 0; i < eventObjects.length; i++){

    if(eventObjects[i].username == loggedInUser){
      flexTable.setText(k, 0, eventObjects[i].classcode);
      var titleTextLabel = app.createLabel(eventObjects[i].titletext).setWordWrap(true).setWidth('150px');      
        flexTable.setWidget(k, 1, titleTextLabel);
      var descTextLabel = app.createLabel(eventObjects[i].desctext).setWordWrap(true).setWidth('250px');
        flexTable.setWidget(k, 2, descTextLabel);
      flexTable.setText(k, 3, shortDate(new Date(eventObjects[i].setdate)));
      flexTable.setText(k, 4, shortDate(new Date(eventObjects[i].duedate)));
      flexTable.setText(k, 5, eventObjects[i].period);
      var detailsBtn = app.createButton('Edit details', buttonHandler).setId(eventObjects[i].eventid);
        flexTable.setWidget(k, 6, detailsBtn);
      flexTable.setRowStyleAttribute(k, 'background', 'f3f3f3')
      k++
    }

  } 
  
  app.add(flexTable);
  return app;
}

function logCheck(e){

  Logger.log(e.parameter.source);

}

function shortDate(d){
  
  var dayArray = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var curr_day = d.getDay() - 1;
  var curr_date = d.getDate();
    if(curr_date < 10){curr_date = "0" + curr_date;}
  var curr_month = d.getMonth() + 1;
    if(curr_month < 10){curr_month = "0" + curr_month;}
  var curr_year = d.getFullYear();
  
  var shortDate = dayArray[curr_day] + " " + curr_date + "-" + curr_month + "-" + curr_year;
  
  return (shortDate);

}

// STILLMAN > getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}


// STILLMAN > getHeaderLabels returns an array of strings from with the first row.
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getHeaderLabels(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return headers;
}

// STILLMAN > getColumnsData iterates column by column in the input range and returns an array of objects.
// Each object contains all the data for a given column, indexed by its normalized row name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - rowHeadersColumnIndex: specifies the column number where the row names are stored.
//       This argument is optional and it defaults to the column immediately left of the range; 
// Returns an Array of objects.
function getColumnsData(sheet, range, rowHeadersColumnIndex) {
  rowHeadersColumnIndex = rowHeadersColumnIndex || range.getColumnIndex() - 1;
  var headersTmp = sheet.getRange(range.getRow(), rowHeadersColumnIndex, range.getNumRows(), 1).getValues();
  var headers = normalizeHeaders(arrayTranspose(headersTmp)[0]);
  return getObjects(arrayTranspose(range.getValues()), headers);
}


// STILLMAN > For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

// STILLMAN > Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

// STILLMAN > Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

// STILLMAN > Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

// STILLMAN > Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// STILLMAN >Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}

// STILLMAN > Given a JavaScript 2d Array, this function returns the transposed table.
// Arguments:
//   - data: JavaScript 2d Array
// Returns a JavaScript 2d Array
// Example: arrayTranspose([[1,2,3],[4,5,6]]) returns [[1,4],[2,5],[3,6]].
function arrayTranspose(data) {
  if (data.length == 0 || data[0].length == 0) {
    return null;
  }

  var ret = [];
  for (var i = 0; i < data[0].length; ++i) {
    ret.push([]);
  }

  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < data[i].length; ++j) {
      ret[j][i] = data[i][j];
    }
  }

  return ret;
}
