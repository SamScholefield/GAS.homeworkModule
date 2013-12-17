function doGet(e) {
  
  var app = UiApp.createApplication();  
  var mainPanel = app.createAbsolutePanel().setSize('600', '800').setId('mainPanel');
  
  var searchPanel = app.createHorizontalPanel();
  var searchBtnPanel = app.createHorizontalPanel();
  
  var searchBox = app.createTextBox().setId("searchBox").setName("searchBox")
    searchBox.setStyleAttribute("color","gray").setValue("Input learner email here");
    searchBox.setStyleAttribute('height','40px');
    searchBox.setStyleAttribute('width','400px');
    searchBox.setStyleAttribute('fontSize', '20px')
  var focusHandler = app.createClientHandler().forEventSource().setText("")
    .setStyleAttribute("color","black");
  searchBox.addFocusHandler(focusHandler);
  
  var searchBtn = app.createButton('Search');
    searchBtn.setStyleAttribute('height','40px');
    searchBtn.setStyleAttribute('width','120px');
    searchBtn.setStyleAttribute('background', '#4c8efb');
    searchBtn.setStyleAttribute('color', 'white');
    searchBtn.setStyleAttribute('fontWeight', 'bold');
    searchBtn.setId('searchBtn');  
  
  var disableHandler = app.createClientHandler().forEventSource().setEnabled(false);

  var workingPanel = app.createAbsolutePanel().setSize('600', '800');
    workingPanel.setId('workingPanel');
    workingPanel.setStyleAttribute('zIndex', '10')
    workingPanel.setVisible(false);
  
  var workingLabel = app.createImage('https://go.nexus.edu.my/working.gif');
    workingPanel.add(workingLabel);

  var showWorking = app.createClientHandler().forTargets(workingPanel).setVisible(true);

//Create handler which will execute 'search(e)' on clicking the button
  var searchHandler = app.createServerClickHandler('search');
    searchHandler.addCallbackElement(mainPanel);

//Add handlers to the submit button
  searchBtn.addClickHandler(disableHandler).addClickHandler(searchHandler).addClickHandler(showWorking);
  
//build mainPanel
  searchPanel.add(searchBox);
  searchBtnPanel.add(searchBtn);
  mainPanel.add(searchPanel, 5, 4);
  mainPanel.add(searchBtnPanel, 1, 49);
  app.add(workingPanel);
  app.add(mainPanel);
  
  return app; 
  
};


function search(e){
  
  var app = UiApp.getActiveApplication();
  var searchBtn = app.getElementById('searchBtn');
  
  var mainPanel = app.getElementById('mainPanel');
  var workingPanel = app.getElementById('workingPanel');
  
  mainPanel.clear();
  mainPanel.setVisible(false);
  
  var searchTermRaw = e.parameter.searchBox;  
  var searchTerm = searchTermRaw.toString().toLowerCase();  
  var ss = SpreadsheetApp.openById("0AlOOZ32SnnaCdGhRakZCb3JpLWsxZU5QQkxuQ01HWHc");  
  var dataSheet = ss.getSheetByName("studentDetails");  
  var loggedInUser = searchTerm;  
  var studentLookuprange = ss.getRangeByName("studentLookup");  
  
  //create arrays from rows in range using standard getRowsData function
  var classObjects = getRowsData(dataSheet, studentLookuprange);
  
  //identify user as known or unknown, give error message if unknown, proceed if known
  var known = false;
  
  for (var i=0;i<classObjects.length;i++){  
    if(classObjects[i].username === loggedInUser){
     known = true; 
    };
  }

  if(known === false){
   var mainPanel = app.createAbsolutePanel().setSize('600', '800').setId('mainPanel');
   var unknownUserWarning = app.createLabel('The email address you entered is not recognised.')
     .setStyleAttribute('fontSize', '15px').setStyleAttribute('fontWeight','bold').setStyleAttribute('color', 'red');
    
   var unknownUserLabel = app.createLabel('Please try again below or, alternatively, contact ict@nexus.edu.my') 
     .setStyleAttribute('fontSize', '15px');
    
   var searchPanel = app.createHorizontalPanel();
   var searchBtnPanel = app.createHorizontalPanel();  
  
   var searchBox = app.createTextBox().setId("searchBox").setName("searchBox")
     searchBox.setStyleAttribute("color","gray").setValue("Input learner email here");
     searchBox.setStyleAttribute('height','40px');
     searchBox.setStyleAttribute('width','400px');
     searchBox.setStyleAttribute('fontSize', '20px')
   var focusHandler = app.createClientHandler().forEventSource().setText("")
     .setStyleAttribute("color","black");
   
   searchBox.addFocusHandler(focusHandler);
  
   var searchBtn = app.createButton('Search');
     searchBtn.setStyleAttribute('height','40px');
     searchBtn.setStyleAttribute('width','120px');
     searchBtn.setStyleAttribute('background', '#4c8efb');
     searchBtn.setStyleAttribute('color', 'white');
     searchBtn.setStyleAttribute('fontWeight', 'bold');
     searchBtn.setId('searchBtn');
  
//Create handler which will execute 'search(e)' on clicking the button
   var searchHandler = app.createServerClickHandler('search');
     searchHandler.addCallbackElement(mainPanel);

//Add this handler to the submit button
   searchBtn.addClickHandler(searchHandler);
  
//build mainPanel
   searchPanel.add(searchBox);
   searchBtnPanel.add(searchBtn);
   mainPanel.add(unknownUserWarning, 0 , 0);
   mainPanel.add(unknownUserLabel, 0, 30)
   mainPanel.add(searchPanel, 5, 70);
   mainPanel.add(searchBtnPanel, 1, 115);
  
   workingPanel.setVisible(false);
   app.add(mainPanel);
 
   mainPanel.setVisible(true);    
  
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
  
  var dataSheet = ss.getSheetByName("classStatus");  
  var statusLookuprange = ss.getRangeByName("classLookup");
  
  //create arrays from rows in range using standard getRowsData function
  var statusObjects = getRowsData(dataSheet, statusLookuprange);
  
  //create empty object to index array by username
  var statusObjectsIndex = {};
  
  //iterate through all classobjects and index each array by its first value, username
  for (var i=0;i<statusObjects.length;i++){
  
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
      rowObject.calLink = app.createAbsolutePanel().add(app.createAnchor('Calendar',statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].classcalendarlink));
      
      if(statusObjectsIndex[classObjectsIndex[loggedInUser][classHeader] + '-2013'].homeworkstatus == "Homework set for this class"){
        rowObject.BGColor = "#f3f3f3";
        rowObject.cellColor   = "#0ba55c";        
      }else{
        rowObject.BGColor = "#f3f3f3";
        rowObject.cellColor   = "#707070";   
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

//populate flextable
  for(var i = 0;i<(size-1);i++){
  
      flexTable.setText(i,0, tableArray[i].claName)
        .setText(i,1, tableArray[i].homeworkStatus)
        .setWidget(i,2, tableArray[i].calLink)
        .setRowStyleAttribute(i, 'color', tableArray[i].cellColor)
        .setRowStyleAttribute(i, 'backgroundColor', tableArray[i].BGColor);
      
    };

  //flexTable.setColumnStyleAttribute(3, "background", "#dddddd");
  workingPanel.setVisible(false);
  app.add(flexTable);
  
  
  return app;
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
