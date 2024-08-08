class ObjectUtil {
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      const arrCopy = [];
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = ObjectUtil.deepClone(obj[i]);
      }
      return arrCopy;
    }

    const objCopy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = ObjectUtil.deepClone(obj[key]);
      }
    }
    return objCopy;
  }
  
  static arrayToObject(array, objectKey) {
    return Object.fromEntries(array.map((obj) => [obj[objectKey], obj]));
  }
}

export default ObjectUtil;
export { ObjectUtil };
