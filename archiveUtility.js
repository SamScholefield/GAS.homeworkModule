//add custom archive menu on open
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Archive and delete expired rows",
    functionName : "sortByDueDate"
  }];
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
  
  //sort data by due date, youngest at top
  dataRange.sort({column: 4, ascending: false});
  
  //create array of duedates
  var dateArray = mainSheet.getRange("D3:D" + lastRow).getValues();
  
  //return index where first duedate<today
  var arrayIndex = parseInt(getArrayIndex(dateArray, ss, mainSheet));
  
  Logger.log("arrayIndex: " + arrayIndex);
  
  //determine row number of first expired date (2 header rows = +2)
  rowIndex = arrayIndex + 2;  
  
  //if rowindex is greater than 2 then expired rows have been found
  if(rowIndex > 2){
      
      var height = (lastRow +1) - rowIndex;
      Logger.log(rowIndex +","+ height+","+ lastRow);
      archiveExpired(rowIndex, height, lastRow, ss, mainSheet);

      return;      
      
    }else{
      Logger.log(rowIndex);
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
  
  //deleteExpired(rowIndex, lastRow, ss, mainSheet);
  
  return;
  
}

//deletes expired rows from main workbook
function deleteExpired(rowIndex, lastRow, ss, mainSheet){

  mainSheet.getRange("A" + rowIndex + ":M" + lastRow).clear();

}

//returns row index of first row where due date has expired ie. less than today
function getArrayIndex(dateArray, ss, mainSheet){
  
  var today = new Date();
  today.setHours(0,0,0,0);
  var lastRow = mainSheet.getLastRow();
  var arrayIndex = 0;
  
  if(dateArray.length == 0){
    return arrayIndex;
  }
  
  for(var i = 0; i < dateArray.length; i++){
  
    var targetDate = new Date(dateArray[i]);
    
    if(today > targetDate){
        
      arrayIndex = i+1;
      return arrayIndex;
       
    }
  }
  
  return arrayIndex;
}

// dd/mm/yyyy
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


  