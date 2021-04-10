
export interface ITrigger<S> {
  cond: (reactive: {state: S, track?: any}, orders:  number[]) => boolean,
  before?: (reactive: {state: S, track?: any}) => void,
  on?: (reactive: {state: S, track?: any}) => void,
  after?: (reactive: {state: S, track?: any}) => void,
}

export type IStepFunction<S> = { [x: number] : ( trigger: () => void, reactive: {state?: S, track?: any}) => any }

export interface IMachine<S> {
  state: S,
  stepFunction: IStepFunction<S>,
  trigger: () => any,
  mutate: () => void,
}

export default class OrderStepper<S> {
  state: S
  track: any
  mutate: () => void;
  trigger: () => void;
  constructor(state: S, stepFunction: IStepFunction<S>, trigger: ITrigger<S>) {
    this.state = state
    let _functions = Object.values(stepFunction);
    let v = 0;
    const self = this;
    const gen = function *() {
      for(let i = 0; i < _functions.length; i++) {
          yield _functions?.[v++]?.(self.trigger, { state: self?.state, track: self?.track });
      }
    }
    this.mutate = () => {
      this.track = gen().next().value;
    }
    this.trigger = () =>  {
      trigger?.before?.({ state: this.state, track: this?.track })
      if(trigger.cond({ state: this.state, track: this?.track }, Object.keys(stepFunction).map(step => Number(step))))  {
        trigger?.on?.({ state: this.state, track: this?.track })
        this.mutate();
      }
      trigger?.after?.({ state: this.state, track: this?.track })
    }
  }
}
