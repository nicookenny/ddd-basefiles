/** @format */

export class Result<T> {
  public isSuccess: boolean
  public isFailure: boolean
  private error: T | string | null
  private _value: T | null

  public constructor(
    isSuccess: boolean,
    error?: T | string | null,
    value?: T | null
  ) {
    if (isSuccess && error) {
      throw new Error(
        'Operación inválida: un resultado exitoso no puede contener un error'
      )
    }

    const falsy = error === false

    if (!isSuccess && !falsy && !error) {
      throw new Error(
        'Operación inválida: un resultado fallido debe contener un error'
      )
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error!
    this._value = value!

    Object.freeze(this)
  }

  public getValue(): T | null {
    if (!this.isSuccess) {
      console.log(this.error)
      throw new Error(
        "No se puede obtener el valor de un resultado fallido. Use 'errorValue' en su lugar."
      )
    }

    return this._value
  }

  public getErrorValue(): T | string | null {
    return this.error as T | string | null
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value)
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error)
  }

  public static combine(results: Result<any>[]): Result<string> {
    const errs: string[] = []

    for (let result of results) {
      if (result.isFailure) {
        errs.push(result.getErrorValue())
      }
    }

    if (errs.length) {
      return Result.fail(errs.join(' - '))
    }

    return Result.ok()
  }
}
