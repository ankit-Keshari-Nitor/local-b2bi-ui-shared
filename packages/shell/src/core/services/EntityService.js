import { HttpService } from './HttpService';

export class EntityService {
  entityApiUrl = 'http://localhost:5000/api/entity';

  executeApi(entityName, requestType, input, outputTemplate) {
    const entityBody = {
      request: {
        type: requestType,
        entity: entityName
      },
      input: input,
      template: outputTemplate
    };
    return HttpService.send({
      url: this.entityApiUrl,
      method: 'post',
      data: entityBody
    });
  }

  getEntityList(entityName, input, outputTemplate) {
    return this.executeApi(entityName, 'getEntityList', input, outputTemplate);
  }

  createEntity(entityName, input, outputTemplate) {
    return this.executeApi(entityName, 'createEntity', input, outputTemplate);
  }

  getEntityDetails(entityName, input, outputTemplate) {
    return this.executeApi(entityName, 'getEntityDetails', input, outputTemplate);
  }

  updateEntity(entityName, input, outputTemplate) {
    return this.executeApi(entityName, 'updateEntity', input, outputTemplate);
  }

  deleteEntity(entityName, input, outputTemplate) {
    return this.executeApi(entityName, 'deleteEntity', input, outputTemplate);
  }
}
