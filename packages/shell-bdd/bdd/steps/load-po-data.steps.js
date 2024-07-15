import { Given, When, Then } from '@cucumber/cucumber';
import { JSONPath } from 'jsonpath-plus';
import { expect } from '@playwright/test';
import ParameterizedDataTable from '../support_files/ParameterizedDataTable.js';

When('User loads data from PageObject files', async function (dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'filePath|assginedAttribute');
  const data = transformedDataTable.transformedHashes();
  let dataDir = '\\bdd\\po\\';

  this.po = {};
  for (let i = 0; i < data.length; i++) {
    let fullFilePath = 'file://' + process.cwd().concat(dataDir).concat(data[i].filePath);
    const { default: poData } = await import(fullFilePath); // { assert: { type: 'json' } }
    this.po[data[i].assginedAttribute] = poData;
  }
});

Then('User verifies po data with path {string} and value as {string}', async function (jsonPath, value) {
  const jsonPathValue = JSONPath({ path: jsonPath.replace("#", "$"), json: this.po, wrap: false });
  expect(jsonPathValue).toBe(value);
});
