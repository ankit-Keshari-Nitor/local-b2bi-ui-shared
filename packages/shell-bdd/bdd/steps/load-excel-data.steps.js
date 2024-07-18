import { Given, When, Then } from '@cucumber/cucumber';
import XLSX from 'xlsx';
import { JSONPath } from 'jsonpath-plus';
import { expect } from '@playwright/test';
import ParameterizedDataTable from '../support_files/ParameterizedDataTable.js';

When('User loads data from {string} excel file', function (filePath, dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'SheetName|assginedAttribute');
  const data = transformedDataTable.transformedHashes();
  let dataDir = '\\bdd\\data\\'; // TODO: Consider loading the file from different folder for different env - dev|sanity|qa|e2e|
  let fullFilePath = process.cwd().concat(dataDir).concat(filePath);
  const workbook = XLSX.readFile(fullFilePath);

  this.excelData = {};
  for (let i = 0; i < data.length; i++) {
    const sheet = data[i];
    const worksheet = workbook.Sheets[sheet.SheetName];
    const sheelData = XLSX.utils.sheet_to_json(worksheet);
    this.excelData[sheet.assginedAttribute] = sheelData;
  }
});

Then('User verifies excel data with path {string} and value as {string}', async function (jsonPath, value) {
  const jsonPathValue = JSONPath({ path: jsonPath, json: this.excelData, wrap: false });
  expect(jsonPathValue).toBe(value);
});
