function doGet(e) {
  var app = UiApp.createApplication();  
  var ss = SpreadsheetApp.openById("0AlOOZ32SnnaCdGhRakZCb3JpLWsxZU5QQkxuQ01HWHc");  
  var dataSheet = ss.getSheetByName("teacherDetails");  
  var loggedInUser = Session.getActiveUser().getEmail();  
  var classLookuprange = ss.getRangeByName("teacherLookup");
  //var errorLabel1 = app.createLabel('oldtext').setStyleAttribute('color','#d64937').setStyleAttribute('fontSize','15px');
  var errorPanel = app.createVerticalPanel().setVisible(false).setId('errorPanel').setStyleAttribute('zIndex','10');
   //errorPanel.add(errorLabel1,0,0);
  
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
    //unknownUserLabel.setWidth('400px').setWordWrap(true);
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
  
//CREATE MAIN PANEL/////////////////////////////////////////////////////////////////////
  
  var flowPanel = app.createAbsolutePanel().setSize('600', '800').setId('flowPanel');

//CLASS SELECT LISTBOX//////////////////////////////////////////////////////////////////
  
  var listBox = app.createListBox();
    listBox.setWidth('150px').setHeight('20px');
    listBox.setName('classSelect');
    listBox.setId('classSelect');
  var classListLabel = app.createLabel('Select class');
  
  listBox.addItem('');
  
  for(var i = 0;i<(size-3);i++){
    
    var class = "class" + (i+1);
    var classCode = classObjectsIndex[loggedInUser][class];
    listBox.addItem(classCode, classCode);   
    
  }  
  
  flowPanel.add(classListLabel, 20, 20); 
  flowPanel.add(listBox, 20, 40);
  
//TITLE///////////////////////////////////////////////////////////////////////////

  var titleText = app.createTextBox().setWidth('320px').setHeight('20px');
    titleText.setName('titleText');
    titleText.setId('titleText');
    
  var titlelabel = app.createLabel('Homework title');
  
  flowPanel.add(titlelabel, 190, 20);
  flowPanel.add(titleText, 190, 40);

//DATE SECTION//////////////////////////////////////////////////////////////////////////
  
  var setDate = app.createDateBox().setWidth('150px').setHeight('20px');
    setDate.setId('setDate');
    setDate.setName('setDate');
  var setDateLabel = app.createLabel('Set active start date').setId('setDatelabel');
  
  var dueDate = app.createDateBox().setWidth('150px').setHeight('20px');
    dueDate.setId('dueDate');
    dueDate.setName('dueDate');
  var dueDateLabel = app.createLabel('Set due date').setId('dueDateLabel');
  
  flowPanel.add(setDateLabel, 20, 70);
  flowPanel.add(setDate, 20, 90);
  
  flowPanel.add(dueDateLabel, 190, 70);
  flowPanel.add(dueDate, 190, 90);
//PERIOD/////////////

  var periodList = app.createListBox()
    .setWidth('150px').setHeight('20px')
    .setName('periodSelect')
    .setId('periodSelect');
  var periodListLabel = app.createLabel('Select due period');
  
  periodList.addItem('').addItem(1).addItem(2).addItem(3).addItem(4).addItem(5)
    .addItem(6).addItem(7).addItem(8);
  
  flowPanel.add(periodListLabel, 360, 70); 
  flowPanel.add(periodList, 360, 90);
  
  
//DESCRIPTION////////////////////////////////////////////////////////////////////////////// 

  var descText = app.createTextArea().setSize('490px', '100px');
    descText.setStyleAttribute('backgroundColor','white');
    descText.setStyleAttribute('zIndex', '1')
    descText.setName('descText');
    descText.setId('descText');
  
  var descLabel = app.createLabel('Enter homework details (inc. links)');
  
  flowPanel.add(descLabel, 20, 120);
  flowPanel.add(descText, 20, 140);
  
  
//DOCUMENT LINK////////////////////////////////////////////////////////////////////////////

  //var docLink = app.createTextBox().setWidth('420px').setHeight('20px');
    //docLink.setName('docLink');
    //docLink.setId('docLink');
    
  //var docLabel = app.createLabel('Document link');
  
 // flowPanel.add(docLabel, 20, 250);
  //flowPanel.add(docLink, 20, 270);
  
  
//BUTTONS AND HANDLERS//////////////////////////////////////////////////////////////////

  var btnPanel = app.createHorizontalPanel();
    btnPanel.setVisible(true);
    btnPanel.setId('btnPanel');  
  
  var submitBtn = app.createButton('Set homework');
    submitBtn.setStyleAttribute('height','40px');
    submitBtn.setStyleAttribute('width','120px');
    submitBtn.setStyleAttribute('background', '#4c8efb');
    submitBtn.setStyleAttribute('color', 'white');
    submitBtn.setStyleAttribute('fontWeight', 'bold');
    submitBtn.setId('submitBtn');
    
  var clearBtn = app.createButton('Clear form');
    clearBtn.setStyleAttribute('height','40px');
    clearBtn.setStyleAttribute('width','120px');
    clearBtn.setStyleAttribute('background', '#d64937');
    clearBtn.setStyleAttribute('marginLeft', '30px');
    clearBtn.setId('clearBtn');
    clearBtn.setStyleAttribute('color', 'white');
    clearBtn.setStyleAttribute('fontWeight', 'bold');
  
  btnPanel.add(submitBtn);
  btnPanel.add(clearBtn);
  
  flowPanel.add(btnPanel, 20, 250);
 
var workingPanel = app.createAbsolutePanel().setSize('600', '800');
  workingPanel.setId('workingPanel');
  workingPanel.setStyleAttribute('backgroundColor','white');
  workingPanel.setStyleAttribute('zIndex', '10')
  workingPanel.setVisible(false);
  
var workingLabel = app.createImage('https://go.nexus.edu.my/working.gif');
  workingPanel.add(workingLabel, 0, 0);

var showWorking = app.createClientHandler().forTargets(workingPanel).setVisible(true);

//create button disable handler  
  var disableHandler = app.createClientHandler().forEventSource().setEnabled(false);  
  
//Create handler which will execute 'submit(e)' on clicking the button
  var submitHandler = app.createServerClickHandler('submit');
  submitHandler.addCallbackElement(flowPanel);

//Add this handler to the submit button
  submitBtn.addClickHandler(submitHandler).addClickHandler(showWorking).addClickHandler(disableHandler);
  
//Create handler which will execute 'clear(e)' on clicking the button
  var clearHandler = app.createServerClickHandler('clear');
  submitHandler.addCallbackElement(flowPanel);

//Add this handler to the clear button
  clearBtn.addClickHandler(clearHandler).addClickHandler(disableHandler);
  
//BUILD APP//////////////////////////////////////////////////////////////////////////////////// 

  flowPanel.add(errorPanel, 20, 310);
  flowPanel.add(workingPanel, 0 , 0);
  app.add(flowPanel);
  
  return app;
  
}

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

/*borrowed function to detect if value is a avlid date. 
original thread here: http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript*/
function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

/*This is the main function that runs when user submits. It writes the values to 
the spreadsheet and then creates a calendar event*/
function submit(e){
  
  var app = UiApp.getActiveApplication();  
  var timeCheck = new Date();
  var errorPanel = app.getElementById('errorPanel');
    errorPanel.clear();
//get form values
  var classCode = e.parameter.classSelect;
  var titleText = e.parameter.titleText;
  var setDate = e.parameter.setDate;
  var dueDate = e.parameter.dueDate;
  var descText = e.parameter.descText;  
  
  
  var period = e.parameter.periodSelect;
  
  Logger.log(period);
  Logger.log(typeof period);
  
  if(period == ''){
    var period = 10;
    } else {
    var period = parseInt(period);
    }
  
  Logger.log(period);
  Logger.log(typeof period);

//Validation section, server side ugh, this is ugly and should proabably be its own function
  var errors = new Array();
  
  if(classCode == ''){
    errors.push(0);
  }
  
  if(titleText == ''){
    errors.push(1);
  }
  
  if(isValidDate(setDate) == false){
    errors.push(2); 
  }
  
  if(isValidDate(dueDate) == false){
    errors.push(3);
  }
  
  if(setDate>dueDate){
    errors.push(4);
  }
  
  if(dueDate<=timeCheck){  
    errors.push(5);
  }
  
  if(period == 10){
    errors.push(6);
  }
    
  if(descText == ''){
    errors.push(7); 
  }
  
  if(errors.length >= 1){
    buildErrorPanel(errors);
    return app;
  }

  Logger.log('passed validation');
  var ss = SpreadsheetApp.openById("0AlOOZ32SnnaCdGhRakZCb3JpLWsxZU5QQkxuQ01HWHc");
  
  var dataSheet = ss.getSheetByName("formData");
  
  var lastRow = dataSheet.getLastRow();
  var ro = lastRow + 1;
  
  var callStart = new Date().getTime();

//define calculation formula
  var form1 = '=IF(NOW()>RC[-3], \"1\", \"0\")';
  var form2 = '=IF(NOW()<RC[-3], \"1\", \"0\")';
  var form3 = '=IF(SUM(RC[-2]:RC[-1])=2, \"1\",\"0\")';
  var form4 = '=RC[-6]& \" 00:00:01\"';
  var form5 = '=RC[-6]& \" 23:59:59\"';
  var form6 = '=VLOOKUP(RC[-10],classLookup,4,False)';
  var user = Session.getActiveUser().getEmail();

//set values
  dataSheet.appendRow([classCode,titleText,setDate,dueDate,descText,form1,form2,form3,form4,form5,form6,user]);
  
  var callStop = new Date().getTime();
  Logger.log("Elapsed time for write to sheet: " + (callStop - callStart));  
  
//create calendar event timings  
  //var setDateText = setDate.toDateString();
  //var setDateTextLong = setDateText + " " + startTime + " GMT+0800 (HKT)";
  //var startTimeFull = new Date(setDateTextLong);
  
  var startTime = getPeriod(period).start;
  var endTime = getPeriod(period).end;
  
  var dueDateText = dueDate.toDateString();
  var startDateTextLong = dueDateText + " " + startTime + " GMT+0800 (HKT)";
  var dueDateTextLong = dueDateText + " " + endTime + " GMT+0800 (HKT)";
  var startTimeFull = new Date(startDateTextLong);
  var endTimeFull = new Date(dueDateTextLong); 
  
//return calendar by name
 var calStart = new Date().getTime();
  var calName = dataSheet.getRange(ro, 11).getValue();  
  var cal = CalendarApp.getCalendarsByName(calName)[0];
  Logger.log('calname returned');
  var calStop = new Date().getTime();
    Logger.log("Elapsed time for calName: " + (calStop - calStart));
  
//create event
  Logger.log('event creation fired');
  var start = new Date().getTime();
  var event = cal.createEvent('Homework - ' + titleText, startTimeFull, endTimeFull, {description: descText, location: 'Nexus International School'});
  var stop = new Date().getTime();
  Logger.log("Elapsed time for createEvent: " + (stop - start));
  
 var flowPanel = app.getElementById('flowPanel');
 var workingPanel = app.getElementById('workingPanel');

 var proceedBtn = app.createButton('OK').setSize('120px','40px')
      .setStyleAttribute('background', '#4c8efb')
      .setStyleAttribute('marginTop', '30px')
      .setId('proceedBtn')
      .setStyleAttribute('color', 'white')
      .setStyleAttribute('fontWeight', 'bold');
    
//Create handler which will execute 'proceed(e)' on clicking the button
 var proceedHandler = app.createServerClickHandler('proceed');
    proceedHandler.addCallbackElement(flowPanel);

//Add this handler to the proceed button
 proceedBtn.addClickHandler(proceedHandler);

//create proceed panel info text
 var proceedSuccess = app.createLabel('Homework set successfully');
    proceedSuccess.setStyleAttribute('color','#0ba55c');
    proceedSuccess.setStyleAttribute('fontSize','30px');
    proceedSuccess.setStyleAttribute('fontWeight','Bold');
 var proceedTitle = app.createLabel('Title: ' + titleText);
    proceedTitle.setStyleAttribute('marginTop','15px');
    proceedTitle.setStyleAttribute('fontSize','20px');
 var proceedClass = app.createLabel('Class: ' + classCode);
    proceedClass.setStyleAttribute('marginTop','15px');
    proceedClass.setStyleAttribute('fontSize','20px');
    
//clear panel of 'working...' animation and load proceed info text and button
 workingPanel.clear();
 workingPanel.add(proceedSuccess).add(proceedClass).add(proceedTitle).add(proceedBtn);
 
 return app;

}

/*The clear function clears the form (excluding f*****g dateboxes)*/
function clear(){

  var app = UiApp.getActiveApplication();
  
  var clearBtn = app.getElementById('clearBtn');
  var submitBtn = app.getElementById('submitBtn');
  clearBtn.setEnabled(true);
  submitBtn.setEnabled(true);
  
  app.getElementById('classSelect').setItemSelected(0,true);
  app.getElementById('periodSelect').setItemSelected(0,true);
  app.getElementById('titleText').setValue('');
  app.getElementById('descText').setValue('');  
  app.getElementById('classSelect').setFocus(true);
  
  return app;

}

/*The 'proceed' function removes the dialog panel, renables the submit button and runs the clear function
to set the form up for re-use following successful submit*/
function proceed(){

  var app = UiApp.getActiveApplication();
  
  var workingPanel = app.getElementById('workingPanel');
  workingPanel.setVisible(false);
  
  var submitBtn = app.getElementById('submitBtn');
  submitBtn.setEnabled(true);
  //var errorPanel = app.getElementById('errorPanel');
  //errorPanel.setVisible(false);
  clear();
  
  return app;
  
}

/*this is the validation function that informs user of input issues
and will stop submission if errors exist, should probably chain messages together into the panel
if more than one error exists*/
/*function errorInform(errors){

  var app = UiApp.getActiveApplication();
  var workingPanel = app.getElementById('workingPanel');
    workingPanel.setVisible(false);
  
  var flowPanel = app.getElementById('flowPanel');  
  
  var errorLabel = app.getElementById('errorLabel');  
    errorLabel.setVisible(true);
  
  if(error == 1){
    errorLabel.setText('The due date you have chosen is in the past.');
    }else if(error == 2){
    errorLabel.setText('The due date you have chosen occurs before the set date.');
    }else if(error == 3){
    errorLabel.setText('The title field is blank.');
    }else if(error == 4){
    errorLabel.setText('The description field is blank.');
    }else if(error == 6){
    errorLabel.setText('The set date you provided is not a valid date.');
    }else if(error == 7){
    errorLabel.setText('The due date you provided is not a valid date.');
    }else{
    errorLabel.setText('You must select a class code.');
    }
    
  var submitBtn = app.getElementById('submitBtn');
  submitBtn.setEnabled(true);
  
  Logger.log('error code: ' + error);
  return app;

}/*

/*this is a function to produce error labels and add them to errorPanel
based on the values in the passed array*/
function buildErrorPanel(errorArray){
  
  var app = UiApp.getActiveApplication();
  var workingPanel = app.getElementById('workingPanel');
    workingPanel.setVisible(false);
  
  var flowPanel = app.getElementById('flowPanel');  
  
  var errorPanel = app.getElementById('errorPanel');  
    errorPanel.setVisible(true);

  var errors = [
    {
      label: 'Error 0',
      description: 'You must select a class code.'
    },
    {
      label: 'Error 1',
      description: 'The title field is blank.'
    },
    {
      label: 'Error 2',
      description: 'The set date you provided is not a valid date.'
    },
    {
      label: 'Error 3',
      description: 'The due date you provided is not a valid date.'
    },
    {
      label: 'Error 4',
      description: 'The due date you have chosen occurs before the set date.'
    },
    {
      label: 'Error 5',
      description: 'The due date you have chosen is in the past.'
    },
    {
      label: 'Error 6',
      description: 'You have not selected a due period.'
    },
    {
      label: 'Error 7',
      description: 'The description field is blank.'
    }
  ];

  for(var i in errorArray){
    var errorId = errorArray[i];
    Logger.log('errorId is: ' + errorId);
    Logger.log('value at errorArray[i] is: ' + errorArray[i]);
    Logger.log('error at position of errors is: ' + errors[errorId]);
    Logger.log('description is:' + errors[errorId].description);
      var errorLabel = app.createLabel(errors[errorId].description)
      .setStyleAttribute('color', 'red').setStyleAttribute('fontSize', '15px').setVisible(true);
    errorPanel.add(errorLabel);
    }
  
//insert errorlabel text array and creation loop here
  
  var submitBtn = app.getElementById('submitBtn');
  submitBtn.setEnabled(true);
 Logger.log('error routine completed: ' + errorArray);
  return app;
  
}

/**
 * Returns an object representing a period.
 */
function getPeriod(number) {
    var periods = [
        {   // 1
            start: '08:35:00',
            end:   '09:20:00'
        },
        {   // 2
            start: '09:20:00',
            end:   '10:00:00'
        },
        {   // 3
            start: '10:20:00',
            end:   '11:00:00'
        },
        {   // 4
            start: '11:00:00',
            end:   '11:40:00'
        },
        {   // 5
            start: '11:40:00',
            end:   '12:20:00'
        },
        {   // 6
            start: '12:20:00',
            end:   '13:00:00'
        },
        {   // 7
            start: '13:55:00',
            end:   '14:35:00'
        },
        {   // 8
            start: '14:35:00',
            end:   '15:15:00'
        },
        {   // default
            start: '00:00:00',
            end:   '00:00:01'
        }
    ];
    if ( typeof number == 'number' && number > 0 && number < 9 ) {
        return periods[number-1];
    } else {
        return periods[9];
    }
}
