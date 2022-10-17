type TUseComponent<P, R, S, D, F, A, H> = (
  props: P,
) => (R extends undefined ? unknown : Record<'refs', R>) &
  (S extends undefined ? unknown : Record<'store', S>) &
  (D extends undefined ? unknown : Record<'data', D>) &
  (F extends undefined ? unknown : Record<'forms', F>) &
  (A extends undefined ? unknown : Record<'actions', A>) &
  (H extends undefined ? unknown : Record<'handlers', H>)

export default function createUseComponent<
  P = void,
  R = undefined,
  S = undefined,
  D = undefined,
  F = undefined,
  A = undefined,
  H = undefined,
>(useComponent: TUseComponent<P, R, S, D, F, A, H>) {
  return useComponent
}
