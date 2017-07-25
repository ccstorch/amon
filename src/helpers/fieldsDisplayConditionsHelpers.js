const helpers = {
  shouldShowField(field, ...locales) {
    if(field.hideOn && field.hideOn.includes(...locales)) return false;
    if(field.showOn && !field.showOn.includes(...locales)) return false;
    return true;
  }
}

export default helpers;
