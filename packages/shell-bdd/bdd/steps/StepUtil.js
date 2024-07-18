import { JSONPath } from 'jsonpath-plus';

class StepUtil {
  static getFinalValue(context, jsonPathStrValue) {
    if (jsonPathStr.indexOf('$') === 0) {
      const jsonPathValue = JSONPath({ path: jsonPath, json: this.excelData, wrap: false });
      return jsonPathValue;
    } else {
      return jsonPathStrValue;
    }
  }
}


export default StepUtil;