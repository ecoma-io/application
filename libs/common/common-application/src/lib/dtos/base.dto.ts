export abstract class AbstractDTO {
  constructor(data: Partial<AbstractDTO>) {
    Object.assign(this, data);
  }
}

export abstract class AbstractCommandDTO extends AbstractDTO {}
export abstract class AbstractQueryDTO extends AbstractDTO {}
export abstract class AbstractResponseDTO extends AbstractDTO {}
