import { expect } from '@playwright/test';
import checkElementStatus from './ElementStatus.js';

class FormField {
  constructor(page, parent, formName, fieldName, fieldType) {
    this.formName = formName;
    this.fieldName = fieldName;
    this.fieldType = fieldType;
    this.parent = parent;
    this.page = page;
  }

  async _getFormField() {
    return this.parent.locator(`${this.fieldType.field}`).filter({ has: await this.page.locator(`[name="${this.fieldName}"]`) });
  }
  async verifyLabel(fieldLabel) {
    const formField = await this._getFormField();
    const labelEle = await formField.locator(this.fieldType.label);
    const label = await labelEle.textContent();
    await expect(label).toBe(fieldLabel);
  }

  async verifyElementStatus(elementStatus) {
    const formField = await this._getFormField();
    const formFieldControl = await formField.locator(this.fieldType.control);
    if (this.fieldType.type === 'RadioGroup' || this.fieldType.type === 'CheckboxGroup') {
      // TODO: Need to handle radio group properly
      /*const count = await formFieldControl.count();
        for(let i=0; i< count; i++) {
            await checkElementStatus(await formFieldControl.nth(i), elementStatus);
        }*/
      await checkElementStatus(await formFieldControl.nth(0), elementStatus);
    } else {
      await checkElementStatus(formFieldControl, elementStatus);
    }
  }

  async verifyErrorMessage(message, elementStatus) {
    const formField = await this._getFormField();
    const errorMessage = await formField.locator(`[id="${this.formName + '.' + this.fieldName}-error-msg"]`);
    checkElementStatus(errorMessage, elementStatus);
    if (elementStatus === 'visible') {
      const text = await errorMessage.textContent();
      expect(text).toBe(message);
    }
  }

  async verifyValue(fieldValue) {
    const formField = await this._getFormField();
    let formFieldControl = await formField.locator(this.fieldType.control);
    let value;
    switch (this.fieldType.type) {
      case 'TextInput':
      case 'NumberInput':
      case 'Password':
        await expect(formFieldControl).toBeVisible();
        value = await formFieldControl.inputValue();
        await expect(value).toBe(fieldValue);
        break;
      case 'Select':
        value = await formFieldControl.inputValue();
        const selectedOption = await formFieldControl.locator(`option[value="${value}"]`);
        const valueLabel = await selectedOption.textContent();
        expect(valueLabel).toBe(fieldValue);
        break;
      case 'RadioGroup':
        // TODO: Need to handle radio group properly
        await expect(await formFieldControl.nth(0)).toBeVisible();
        formFieldControl = await formField.locator(this.fieldType.control).filter({ hasText: fieldValue });
        const radioButton = await formFieldControl.locator('input');
        await expect(radioButton).toBeChecked();
        break;
      case 'CheckboxGroup':
        await expect(await formFieldControl.nth(0)).toBeVisible();
        const checkboxCount = await formFieldControl.count();
        for (let i = 0; i < checkboxCount; i++) {
          const checkboxFormField = await formFieldControl.nth(i);
          const checkboxFormFieldLabel = await (await checkboxFormField.locator('label.cds--checkbox-label')).textContent();
          const checkbox = await checkboxFormField.locator('input');
          if (fieldValue.split('|').indexOf(checkboxFormFieldLabel) > -1) {
            await expect(checkbox).toBeChecked();
          } else {
            await expect(checkbox).not.toBeChecked();
          }
        }

      default:
        break;
    }
  }

  async updateValue(fieldValue) {
    const formField = await this._getFormField();
    let formFieldControl = await formField.locator(this.fieldType.control);
    await formField.click();
    switch (this.fieldType.type) {
      case 'TextInput':
      case 'NumberInput':
      case 'Password':
        await expect(formFieldControl).toBeVisible();
        await formFieldControl.click();
        await formFieldControl.fill(fieldValue);
        await formFieldControl.blur();
        break;
      case 'Select':
        await expect(formFieldControl).toBeVisible();
        await formFieldControl.click();
        await formFieldControl.selectOption({ label: fieldValue });
        await formFieldControl.blur();
        break;
      case 'RadioGroup':
        // TODO: Need to handle radio group properly
        await expect(await formFieldControl.nth(0)).toBeVisible();
        formFieldControl = await formField.locator(this.fieldType.control).filter({ hasText: fieldValue });
        await formFieldControl.click();
        break;
      case 'CheckboxGroup':
        await expect(await formFieldControl.nth(0)).toBeVisible();
        const checkboxCount = await formFieldControl.count();
        for (let i = 0; i < checkboxCount; i++) {
          const checkboxFormField = await formFieldControl.nth(i);
          const checkboxFormFieldLabel = await (await checkboxFormField.locator('label.cds--checkbox-label')).textContent();
          const checkbox = await checkboxFormField.locator('label.cds--checkbox-label');
          const checkboxvalue = await checkbox.inputValue();
          if (fieldValue.split('|').indexOf(checkboxFormFieldLabel) > -1) {
            await checkbox.setChecked(true);
          } else {
            await checkbox.setChecked(false);
          }
        }
      default:
        break;
    }
    await formField.blur();
  }
}

export default FormField;
