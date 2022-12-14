import { DataFromTypes, Erreur } from '../src/mod';

test('Declare Erreur', () => {
  const MyErreur = Erreur.declare<{ num: number }>('MyErreur');

  const err = MyErreur.create({ num: 42 });

  expect(err.message).toBe('[Erreur]: MyErreur {"num":42}');
});

test('Declare Erreur.withTransform', () => {
  const MyErreur = Erreur.declare<{ num: number }>('MyErreur').withTransform((num: number) => ({
    num,
  }));

  const err = MyErreur.create(42);

  expect(err.message).toBe('[Erreur]: MyErreur {"num":42}');
});

test('Erreur.declareFromTypes', () => {
  interface IErreurs {
    MyErreur: { num: number };
    MyOtherErreur: { str: string };
  }

  type IErreur = DataFromTypes<IErreurs>;
  const err: IErreur = { kind: 'MyErreur', data: { num: 42 } };
  expect(err).toBeDefined();

  const Erreurs = Erreur.declareManyFromTypes<IErreurs>()({
    MyErreur: (num: number) => ({ num }),
    MyOtherErreur: (str: string) => ({ str }),
  });

  const err1 = Erreurs.MyErreur.create(42);
  const err2 = Erreurs.MyOtherErreur.create('hello');

  expect(err1).toBeInstanceOf(Erreur);
  expect(err2).toBeInstanceOf(Erreur);
});

test('Erreur.declareMany', () => {
  const Erreurs = Erreur.declareMany({
    MyErreur: (num: number) => ({ num }),
    MyOtherErreur: (str: string) => ({ str }),
  });

  Erreurs.MyErreur.create(42);
});

test('Create Erreur.declareWithTransform', () => {
  const MyErreur = Erreur.declareWithTransform('MyErreur', (num: number) => ({
    num,
  }));

  const err = MyErreur.create(42);

  expect(err.message).toBe('[Erreur]: MyErreur {"num":42}');
});

test('Basic usage', () => {
  const StuffGoneWrongErreur = Erreur.declare<{ count: number }>('StuffGoneWrong');

  const err = StuffGoneWrongErreur.create({ count: 42 });

  expect(err).toBeInstanceOf(Erreur);
  expect(err.is(StuffGoneWrongErreur)).toBe(true);
});

describe('Wrap', () => {
  const InvalidNumberErreur = Erreur.declare<{ num: number }>('InvalidNumber');
  const Unknown = Erreur.declare<{ error: unknown }>('Unknown');

  test('Return result when no error', () => {
    const result = Erreur.wrap(
      () => 42,
      (error) => Unknown.create({ error })
    );

    expect(result).toBe(42);
  });

  test('throw error when error is MyError', () => {
    const run = () =>
      Erreur.wrap(
        () => {
          throw InvalidNumberErreur.create({ num: -4 });
        },
        (error) => Unknown.create({ error })
      );

    expect(run).toThrowError();
  });
});

describe('Cause', () => {
  test('Cause is undefined by default', () => {
    const MyErreur = Erreur.declare<{ num: number }>('MyErreur');
    const err = MyErreur.create({ num: 42 });
    expect(err.cause).toBeUndefined();
  });

  test('createWithCause', () => {
    const MyErreur = Erreur.declare<{ num: number }>('MyErreur');
    const cause = MyErreur.create({ num: 0 });
    const err = MyErreur.createWithCause(cause, { num: 42 });
    expect(err.cause).toBe(cause);
    expect(err.erreurCause).toBe(cause);
  });
});

describe('Match', () => {
  test('matchObj', () => {
    const Erreurs = Erreur.declareMany({
      ErrA: (num: number) => ({ num }),
      ErrB: (str: string) => ({ str }),
      ErrC: (bool: boolean) => ({ bool }),
    });

    const err = Erreurs.ErrA.create(42);

    const res = Erreur.matchObj(err, Erreurs);

    expect(res?.kind).toBe('ErrA');
  });

  test('macthExec', () => {
    const Erreurs = Erreur.declareMany({
      ErrA: (num: number) => ({ num }),
      ErrB: (str: string) => ({ str }),
      ErrC: (bool: boolean) => ({ bool }),
    });

    const err = Erreurs.ErrA.create(42);

    const res = Erreur.matchExec(err, Erreurs.ErrA, (err) => err.num);

    expect(res).toBe(42);
  });
});
