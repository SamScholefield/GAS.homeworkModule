function doGet(e) {
 
  var app                = UiApp.createApplication();  
  var ss                 = SpreadsheetApp.openById("0AlOOZ32SnnaCdGhRakZCb3JpLWsxZU5QQkxuQ01HWHc");  
  var dataSheet          = ss.getSheetByName("studentDetails");  
  var loggedInUser       = Session.getActiveUser().getEmail();  
  var studentLookuprange = ss.getRangeByName("studentLookup");  
  
  //create arrays from rows in range using standard getRowsData function
  var classObjects       = getRowsData(dataSheet, studentLookuprange);
  
  //identify user as known or unknown, give error message if unknown, proceed if known
  var known              = false;
  
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
    unknownUserPanel.add(unknownUserWarning, 0 , 0 );
    unknownUserPanel.add(unknownUserLabel, 0 , 30);
    app.add(unknownUserPanel);    
    return app;
  }
  
  //create empty object to index array by username
  var classObjectsIndex = {};
  
  //iterate through all classobjects and index each array by its first value, username
  for (var i=0;i<classObjects.length;i++){
  
    classObjectsIndex[classObjects[i].username] = classObjects[i];
    
  }
  
  var nameLabel = app.createLabel('Displaying homework details for: ' + loggedInUser);
    nameLabel.setStyleAttribute('fontSize','15px');
  app.add(nameLabel);
  
  dataSheet = ss.getSheetByName("classStatus");  
  var statusLookuprange = ss.getRangeByName("classLookup");
  
  //create arrays from rows in range using standard getRowsData function
  var statusObjects = getRowsData(dataSheet, statusLookuprange);
  
  //create empty object to index array by username
  var statusObjectsIndex = {};
  
  //iterate through all statusobjects and index each array by its first value, classcode
  for (var i=0;i<statusObjects.length;i++){
    //Logger.log('index number: ' + i + ' index string: ' + statusObjects[i].classcode);
    statusObjectsIndex[statusObjects[i].classcode] = statusObjects[i];
    
  }
  
  //function to get size of array by counting keys with corresponding values only   
  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  // Get the size of an object
  var size = Object.size(classObjectsIndex[loggedInUser]);  
  
  //create flexTable
  var flexTable = app.createFlexTable();
    flexTable.setStyleAttribute('marginTop', '10px')
    flexTable.setCellPadding(5);
    flexTable.setCellSpacing(2);
 
 //create empty table array to store rowObjects
  var tableArray =[];

//create rowObjects
  for(var i = 0; i<(size-1); i++){
    var rowObject = {};
    var classHeader = 'class' + (i+1);
    
      rowObject.claName = statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].classname;
      rowObject.homeworkStatus = statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].homeworkstatus;
      
      if(statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].homeworkstatus === "Study group - No homework"){
        rowObject.calLink = app.createLabel('No calendar');
      }else{
        rowObject.calLink = app.createAbsolutePanel().add(app.createAnchor('Open calendar',statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].classcalendarlink));
      }      
      
      if(statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].homeworkstatus === "Homework set for this class"){
        rowObject.BGColor = "#f3f3f3";
        rowObject.cellColor   = "#0ba55c";        
      }else{
        rowObject.BGColor = "#f3f3f3";
        rowObject.cellColor   = "#707070"; 
      }

      if(statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].due === "Not set"){
        rowObject.dueOn = "-";
      }else{
        rowObject.dueOn = shortDate(statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].due);
      }

      tableArray.push(rowObject);
  }
 
//sort objects in array by homework status 
  tableArray.sort(function (a, b) {
    if (a.homeworkStatus > b.homeworkStatus)
      return 1;
    if (a.homeworkStatus < b.homeworkStatus)
      return -1;
    // a must be equal to b
    return 0;
  });

//create flextable header row
  flexTable.setText(0,0, "Class name")
    .setText(0,1, "Class homework status")
    .setText(0,2, "Next due on")
    .setText(0,3, "Calendar link")
    .setRowStyleAttribute(0, 'color', 'FFFFFF')
    .setRowStyleAttribute(0, 'backgroundColor', '#3A80F7')
    .setRowStyleAttribute(0, 'textAlign', 'center');

//populate flextable
  for(var i = 0;i<(size-1);i++){
  
      flexTable.setText(i+1,0, tableArray[i].claName)
        .setText(i+1,1, tableArray[i].homeworkStatus)
        .setText(i+1, 2, tableArray[i].dueOn)
          .setStyleAttribute(i+1, 2, 'textAlign', 'center')
        .setWidget(i+1,3, tableArray[i].calLink)
        .setRowStyleAttribute(i+1, 'color', tableArray[i].cellColor)
        .setRowStyleAttribute(i+1, 'backgroundColor', tableArray[i].BGColor);    
    };

  app.add(flexTable);
  
  return app;
}


//return date as string in DDD dd-mm-yyyy format
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


/////////////////////////////////////////////////////////////////////////////////////

// getRowsData iterates row by row in the input range and returns an array of objects.
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


// getHeaderLabels returns an array of strings from with the first row.
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

// getColumnsData iterates column by column in the input range and returns an array of objects.
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


// For every row of data in data, generates an object that contains the data. Names of
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

// Returns an Array of normalized Strings.
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

// Normalizes a string, by removing all alphanumeric characters and using mixed case
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

// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

// Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}

// Given a JavaScript 2d Array, this function returns the transposed table.
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
