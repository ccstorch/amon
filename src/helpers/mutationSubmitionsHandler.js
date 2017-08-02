const helper = {
  handle(formSituation, props, onSuccess) {
    const { form, mutate, changePage, data } = props;
    const { viewOptions, model, mutationName } = formSituation;
    const record = data && data[model.api.single];
    const idParams = record && record.id ? { id: record.id } : {};

    form.validateFields((err, newRecord) => {
      if (!err) {
        console.log('Received values of form: ', record);
        mutate({ variables: { ...idParams, ...newRecord } }).then((response) => {
          console.log('response', response);
          form.resetFields();
          const id = response.data[mutationName].id;
          if(viewOptions) changePage(`/${viewOptions.url}/${id}/show`);
          if(!!onSuccess) onSuccess(formSituation, props, { id, ...newRecord });
        }).catch((error) => {
          console.log('ERROD: ', error);
          const errorData = JSON.parse(JSON.stringify(error))
          const fieldName = errorData.message.split("'$")[1].split("'")[0];
          form.setFields({
            [fieldName]: {
              value: newRecord[fieldName],
              errors: [new Error('There is some error here!')],
            },
          })

        });
      }
    });
  }
}

export default helper;
