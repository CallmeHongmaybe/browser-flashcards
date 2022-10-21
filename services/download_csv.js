import { getDeck } from "./db";

function toCSV(data) {
    var output = [];
    for(var object of data) {
      var row = [];
      for(var prop in object) {
        row.push(to_csv_value(object[prop]));
        row.push(',');
      }
      row.push('\n');
      output.push(row.join(''));
    }
  
    return output.join('');
  }
  
  function to_csv_value(value) {
    var output = '"';
    output += value;
    return output + '"';
  }
  
  function createCSVFileFromString(string) {
    var csv_mime_type = 'text/csv';
    return new Blob([string], {type: csv_mime_type});
  }

  // and then to compose it for example:
export let convertDataToCSVFile = (async (id) => { 
    var { data } = await getDeck(id);
    var csvString = toCSV(data);
    return createCSVFileFromString(csvString); 
})
  