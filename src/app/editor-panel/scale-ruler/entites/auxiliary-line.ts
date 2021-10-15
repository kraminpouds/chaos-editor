export enum AuxiliaryLineType {
  Horizontal,
  Vertical,
}

// 辅助线
export class AuxiliaryLine {
  private readonly _type: AuxiliaryLine;
  // 面板中的坐标
  private _distanceInCanvas = 0;
  // 容器中的坐标
  private _distanceInVessel = 0;
  // 是否允许删除
  private _isAllowDelete = false;

  set distanceInCanvas(value: number) {
    this._distanceInCanvas = Math.round(value);
  }

  get distanceInCanvas(): number {
    return this._distanceInCanvas;
  }

  set distanceInVessel(value: number) {
    this._distanceInVessel = Math.round(value);
  }

  get distanceInVessel(): number {
    return this._distanceInVessel;
  }

  get type(): AuxiliaryLine {
    return this._type;
  }

  constructor(type: AuxiliaryLine) {
    this._type = type;
  }
}
