const helpers = {
  shouldShowField(fieldSituation) {
    const { field, location } = fieldSituation;
    if(!field) return false;
    if(field.hideOn && field.hideOn.includes(location)) return false;
    if(field.showOn && !field.showOn.includes(location)) return false;
    return true;
  }
}

export default helpers;
