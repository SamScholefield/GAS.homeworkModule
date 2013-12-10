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
function sortByDueDate() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getActiveSheet();
  
  var lastRow = mainSheet.getLastRow();
  var dataRange = mainSheet.getRange("A2:N" + lastRow);
  var rowIndex = 0;
  dataRange.sort({column: 4, ascending: false});
  var dateArray = mainSheet.getRange("D1:D" + lastRow).getValues(); 
  
  var arrayIndex = parseInt(getArrayIndex(dateArray, ss, mainSheet));
  
  Logger.log(arrayIndex);
  
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
  
  var copyValues = mainSheet.getRange("A" + rowIndex + ":N" + lastRow).getValues();
  archiveSheet.getRange("A" + pasteStart + ":N" + pasteEnd).setValues(copyValues);

  deleteExpired(rowIndex, lastRow, ss, mainSheet);
  
  return;
  
}

//deletes expired rows from main workbook
function deleteExpired(rowIndex, lastRow, ss, mainSheet){

  mainSheet.getRange("A" + rowIndex + ":N" + lastRow).clear();

}

//returns row index of first row where due date < today
function getArrayIndex(dateArray, ss, mainSheet){
  
  var today = new Date();
  
  var lastRow = mainSheet.getLastRow();
 
  for(var i in dateArray){
    
    var arrayIndex = 0;
   
      if(new Date(dateArray[i]) < today){
        arrayIndex = i;
        return arrayIndex;
      }
   }
}
  