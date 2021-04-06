

export const maper = {
  assignProp(ctx: object, assignList: [string, any][]) {
    assignList.forEach((prop: [string, any]) => ctx[prop[0]] = this.checkProp(prop[1]))
  },
  checkProp(val) {
    if (typeof val === 'string') {
      return val.length > 0 ? val : '';
    } else
      if (Array.isArray(val)) {
        return val.length > 0 ? val : [];
      } else
        if (typeof val === 'object' && val !== null) {
          return Object.keys(val).length > 0 ? val : null;
        } else
          if (typeof val === 'number') {
            return val;
          } else {
            return val;
          }
  }
}
