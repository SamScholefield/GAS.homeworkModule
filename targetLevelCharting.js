function doGet(e) {

  var ss = SpreadsheetApp.openById('0AlOOZ32SnnaCdDlBU3RVenVBNkZ3NDMwTXVVNEFFcFE');
  var sheet = ss.getSheetByName('Data');
  var studentLookup = ss.getRangeByName("studentLookup");  
  var studentObjects = getRowsData(sheet, studentLookup);  
  var headers = getHeaderLabels(sheet, studentLookup);
  var headersArray = normalizeHeaders(headers);  
  var subjectArray = ['Art', 'Bahasa', 'Drama', 'English', 'French', 'Humanities', 'Mandarin', 'Maths', 'Music', 'PE', 'Science', 'Spanish'];
  
  var app = UiApp.createApplication();
  
  var panel = app.createAbsolutePanel().setHeight('600px').setWidth('1000px');
  
  var sampleData = Charts.newDataTable()
       .addColumn(Charts.ColumnType.STRING, "Subject")
       .addColumn(Charts.ColumnType.NUMBER, "Target")
       .addColumn(Charts.ColumnType.NUMBER, "Level")
       .addRow([subjectArray[0], returnAsNumeric(studentObjects[0][headersArray[4]]),returnAsNumeric(studentObjects[0][headersArray[2]])])
       .addRow([subjectArray[1], returnAsNumeric(studentObjects[0][headersArray[7]]),returnAsNumeric(studentObjects[0][headersArray[5]])]) 
       .addRow([subjectArray[2], returnAsNumeric(studentObjects[0][headersArray[10]]),returnAsNumeric(studentObjects[0][headersArray[8]])])
       .addRow([subjectArray[3], returnAsNumeric(studentObjects[0][headersArray[13]]),returnAsNumeric(studentObjects[0][headersArray[11]])])
       .addRow([subjectArray[4], returnAsNumeric(studentObjects[0][headersArray[16]]),returnAsNumeric(studentObjects[0][headersArray[14]])])
       .addRow([subjectArray[5], returnAsNumeric(studentObjects[0][headersArray[19]]),returnAsNumeric(studentObjects[0][headersArray[17]])])
       .addRow([subjectArray[6], returnAsNumeric(studentObjects[0][headersArray[22]]),returnAsNumeric(studentObjects[0][headersArray[20]])])
       .addRow([subjectArray[7], returnAsNumeric(studentObjects[0][headersArray[25]]),returnAsNumeric(studentObjects[0][headersArray[23]])])
       .addRow([subjectArray[8], returnAsNumeric(studentObjects[0][headersArray[28]]),returnAsNumeric(studentObjects[0][headersArray[26]])])
       .addRow([subjectArray[9], returnAsNumeric(studentObjects[0][headersArray[31]]),returnAsNumeric(studentObjects[0][headersArray[29]])])
       .addRow([subjectArray[10], returnAsNumeric(studentObjects[0][headersArray[33]]),returnAsNumeric(studentObjects[0][headersArray[32]])])
       .addRow([subjectArray[11], returnAsNumeric(studentObjects[0][headersArray[35]]),returnAsNumeric(studentObjects[0][headersArray[35]])])
       .build();
   
   var textStyle = Charts.newTextStyle().setFontSize(11);
   var seriesOneColor = '#00b6de';
   var seriesTwoColor = '#c1d82f';
   
   var chart = Charts.newColumnChart()
       .setTitle(studentObjects[0][headersArray[0]] +  ' \n Year 7 - target vs. level')
       .setXAxisTitle('Subject')
       .setYAxisTitle('Grade')
       .setDimensions(900, 500)
       .setDataTable(sampleData)
       .setOption('vAxis.ticks', [{v:1, f:"c"}, {v:2, f:"b"},{v:3, f:"2a"},{v:4, f:"c"},{v:5, f:"b"},{v:6, f:"3a"},{v:7, f:"c"},{v:8, f:"b"},{v:9, f:"4a"},{v:10, f:"c"},
       {v:11, f:"b"},{v:12, f:"5a"},{v:13, f:"c"},{v:14, f:"b"},{v:15, f:"6a"},{v:16, f:"c"},{v:17, f:"b"},{v:18, f:"7a"},{v:19, f:"c"},{v:20, f:"b"},{v:21, f:"8a"}])
       .setXAxisTextStyle(textStyle)
       .setYAxisTextStyle(textStyle)
       .setOption('tooltip.trigger', 'none')
       .setColors([seriesOneColor, seriesTwoColor])
       .setOption('hAxis.slantedText', 'true')
       .setOption('hAxis.slantedTextAngle', '45')
       .setLegendTextStyle(textStyle)
       .build();
   
   panel.add(chart);
   app.add(panel);
   
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

function returnAsNumeric(grade)
{

switch(grade)
{
case '8a': var numeric = 21;
           break;
case '8b': var numeric = 20;
           break;
case '8c': var numeric = 19;
           break;           
case '7a': var numeric = 18;
           break;
case '7b': var numeric = 17;
           break;
case '7c': var numeric = 16;
           break;
case '6a': var numeric = 15;
           break;
case '6b': var numeric = 14;
           break;
case '6c': var numeric = 13;
           break;
case '5a': var numeric = 12;
           break;
case '5b': var numeric = 11;
           break;
case '5c': var numeric = 10;
           break;
case '4a': var numeric = 9;
           break;
case '4b': var numeric = 8;
           break;
case '4c': var numeric = 7;
           break;
case '3a': var numeric = 6;
           break;
case '3b': var numeric = 5;
           break;
case '3c': var numeric = 4;
           break;
case '2a': var numeric = 3;
           break;
case '2b': var numeric = 2;
           break;
case '2c': var numeric = 1;
           break;
default: var numeric = 0;
}

/*some jiggery stuff to try and ensure that the value returned is a whole number. 
Probably excessive but the script wasn't working so I was changing a lot of things on the fly. 
Should come back and redo this block*/
  var fixed = numeric.toFixed(0);
  var int = parseInt(fixed);
  return int;
  
}
