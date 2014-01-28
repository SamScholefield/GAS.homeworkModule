//add custom archive menu on open
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Archive and delete expired rows",
    functionName : "sortByDueDate"
  },];
  sheet.addMenu("Archive", entries);
};

//sort existing rows newest to oldest
//run gerArrayIndex() returns row index for first row where date < today
//if expired rows found run archiveExpired(), else exit
function sortByDueDate(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName('formData');
  
  var lastRow = mainSheet.getLastRow();
  var dataRange = mainSheet.getRange("A3:M" + lastRow);
  var rowIndex = 0;
  dataRange.sort({column: 4, ascending: false});
  var dateArray = mainSheet.getRange("D3:D" + lastRow).getValues();
  Logger.log(dateArray.length);
  Logger.log(dateArray[1]);
  
  var arrayIndex = parseInt(getArrayIndex(dateArray, ss, mainSheet));
  
  Logger.log("arrayIndex: " + arrayIndex);
  
  rowIndex = arrayIndex + 1  
  
  if(rowIndex > 1){
      
      var height = (lastRow +1) - rowIndex;
      
      archiveExpired(rowIndex, height, lastRow, ss, mainSheet);

      return;      
      
    }else{

      Logger.log("No expired rows found.")
      return;
  
  }
  
  return;
}

//copys expired rows and pastes them to archive workbook
//runs deleteExpired()
function archiveExpired(rowIndex, height, lastRow, ss, mainSheet){

  var archiveSs = SpreadsheetApp.openById("0AlOOZ32SnnaCdGhTVnpxWXJvTXZnc0lvekRBZGhPMHc");
  var archiveSheet = archiveSs.getSheetByName("Archive");
  var archiveLastRow = archiveSheet.getLastRow();
  var pasteStart = archiveLastRow + 1;
  var pasteEnd = archiveLastRow + height;
  var timeStamp = new Date();
  
  var copyValues = mainSheet.getRange("A" + rowIndex + ":M" + lastRow).getValues();
  archiveSheet.getRange("A" + pasteStart + ":M" + pasteEnd).setValues(copyValues);
  archiveSheet.getRange("N" + pasteStart + ":N" + pasteEnd).setValue(timeStamp);
  
  deleteExpired(rowIndex, lastRow, ss, mainSheet);
  
  return;
  
}

//deletes expired rows from main workbook
function deleteExpired(rowIndex, lastRow, ss, mainSheet){

  mainSheet.getRange("A" + rowIndex + ":M" + lastRow).clear();

}

//returns row index of first row where due date < today
function getArrayIndex(dateArray, ss, mainSheet){
  
  var today = new Date();
  var lastRow = mainSheet.getLastRow();
 
  for(var i = 0; i < dateArray.length; i++){
    
    var arrayIndex = 0;
      Logger.log("short date for array position " + i + " equals: " + shortDate(new Date(dateArray[i])));
      Logger.log("short date for today equals: " + shortDate(new Date(today)));
      if(new Date(shortDate(today)) < new Date(shortDate(new Date(dateArray[i])))){
        arrayIndex = i;
        return arrayIndex;
      }
   }

  return arrayIndex;

}

function shortDate(d){  
 Logger.log("d equals: " + d);
  var curr_date = d.getDate();
    if(curr_date < 10){curr_date = "0" + curr_date;}
  var curr_month = d.getMonth() + 1;
    if(curr_month < 10){curr_month = "0" + curr_month;}
  var curr_year = d.getFullYear();  
  var shortDate = curr_date + "/" + curr_month + "/" + curr_year;  
  return (shortDate);
}


  