const helpers = {
  getCustomComponent(viewSituation, location) {
    const { viewOptions } = viewSituation;

    if(viewOptions && viewOptions.customComponents && viewOptions.customComponents[location]) {
      return viewOptions.customComponents[location](viewSituation);
    }
  }
}

export default helpers;
