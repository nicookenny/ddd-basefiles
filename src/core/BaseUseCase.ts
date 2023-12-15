/** @format */

export interface IBaseUseCase<IInput, IResult> {
  exec(payload?: IInput): Promise<IResult> | IResult
}
