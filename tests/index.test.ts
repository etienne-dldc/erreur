import { Erreur } from '../src/mod';

test('Create Erreur', () => {
  const MyErreur = Erreur.create<{ num: number }>('MyErreur');

  const err = MyErreur.create({ num: 42 });

  expect(err.message).toBe('[Erreur]: MyErreur {"num":42}');
});

test('Basic usage', () => {
  const StuffGoneWrongErreur = Erreur.create<{ count: number }>('StuffGoneWrong');

  const err = StuffGoneWrongErreur.create({ count: 42 });

  expect(err).toBeInstanceOf(Erreur);
  expect(err.is(StuffGoneWrongErreur)).toBe(true);
});

describe('Wrap', () => {
  const InvalidNumberErreur = Erreur.create<{ num: number }>('InvalidNumber');
  const Unknown = Erreur.create<{ error: unknown }>('Unknown');

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

  // test('Return mapOtherErr result when error is not MyError', () => {
  //   const result = MyError.wrap(
  //     () => {
  //       throw new Error('oops');
  //     },
  //     (err) => MyError.create.Unknown(err)
  //   );

  //   expect(result).toBeInstanceOf(Erreur);
  //   expect(result.kind).toBe('Unknown');

  //   const result2 = MyError.wrap(
  //     () => {
  //       throw 'Yolo';
  //     },
  //     (err) => MyError.create.Unknown(err)
  //   );

  //   expect(result2).toBeInstanceOf(Erreur);
  //   expect(result2.kind).toBe('Unknown');
  // });
});

// describe('WrapAsync', () => {
//   const MyError = new ErreursMap({
//     Unknown: (error: unknown) => ({ message: `Unknow error`, error }),
//     InvalidNumber: (number: number) => ({ message: `Invalid number`, number }),
//   });

//   test('Return result when no error', async () => {
//     const result = await MyError.wrapAsync(
//       () => Promise.resolve(42),
//       (err) => MyError.create.Unknown(err)
//     );

//     expect(result).toBe(42);
//   });

//   test('Return error when error is MyError', async () => {
//     const result = await MyError.wrapAsync(
//       async () => {
//         throw MyError.create.InvalidNumber(-4);
//       },
//       (err) => MyError.create.Unknown(err)
//     );

//     expect(result).toBeInstanceOf(Erreur);
//     expect(result.kind).toBe('InvalidNumber');
//   });

//   test('Return mapOtherErr result when error is not MyError', async () => {
//     const result = await MyError.wrapAsync(
//       async () => {
//         throw new Error('oops');
//       },
//       (err) => MyError.create.Unknown(err)
//     );

//     expect(result).toBeInstanceOf(Erreur);
//     expect(result.kind).toBe('Unknown');

//     const result2 = await MyError.wrapAsync(
//       async () => {
//         throw 'Yolo';
//       },
//       (err) => MyError.create.Unknown(err)
//     );

//     expect(result2).toBeInstanceOf(Erreur);
//     expect(result2.kind).toBe('Unknown');
//   });
// });
