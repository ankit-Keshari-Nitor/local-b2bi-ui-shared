import { ObjectUtil } from "../../core";

class DataTableUtil {  

  static getSelectedRowData(selectedRows, rowObj) {
    const selectedRowData = [];
    selectedRows.forEach((selectedRow) => {
      selectedRowData.push(rowObj[selectedRow.id]);
    });
    return selectedRowData;
  }

  static filterActions(selectedRows, actions, filterFn) {
    const tempActions = ObjectUtil.deepClone(actions);
    tempActions.forEach((action) => {
      action.shouldShow = true;
      action.isVisible = action.isVisible || action.isVisible === undefined;
    });
    const actionsObj = Object.fromEntries(tempActions.map((obj) => [obj.id, obj]));
    selectedRows.forEach((selectedRow) => {
      if (filterFn !== undefined) {
        filterFn(selectedRow, actionsObj);
      }
    });
    tempActions.forEach((action) => {
      if (action.selection === 'single' && selectedRows.length > 1) {
        action.shouldShow = false;
        action.isVisible = false;
      }
    });
    return tempActions;
  }

  static paginate(data, { page, pageSize }) {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return data.slice(start, end);
  }
}

export default DataTableUtil;
