class DataTableUtil {
  static arrayToObject(array, objectKey) {
    return Object.fromEntries(array.map((obj) => [obj[objectKey], obj]));
  }

  static getSelectedRowData(selectedRows, rowObj) {
    const selectedRowData = [];
    selectedRows.forEach((selectedRow) => {
      selectedRowData.push(rowObj[selectedRow.id]);
    });
    return selectedRowData;
  }

  static filterActions(selectedRows, actions, filterFn) {
    actions.forEach((action) => {
      action.shouldShow = true;
      action.isVisible = action.isVisible || action.isVisible === undefined;
    });
    const actionsObj = Object.fromEntries(actions.map((obj) => [obj.id, obj]));
    selectedRows.forEach((selectedRow) => {
      if (filterFn !== undefined) {
        filterFn(selectedRow, actionsObj);
      }
    });
    actions.forEach((action) => {
      if (action.selection === 'single' && selectedRows.length > 1) {
        action.shouldShow = false;
        action.isVisible = false;
      }
    });
    return actions;
  }

  static paginate(data, { page, pageSize }) {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return data.slice(start, end);
  }
}

export default DataTableUtil;
