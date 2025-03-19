import { expect, it } from 'vitest';
import * as dq2 from './dq2pswd';

it('dq2pswd.toStringName', () => {
  expect(dq2.toStringName([0, 1, 2, 3])).toEqual('０１２３');
  expect(dq2.toStringName([10, 11, 12, 13])).toEqual('あいうえ');
  expect(dq2.toStringName([62, 62, 62, 62])).toEqual('　　　　');

  expect(dq2.toStringName([0, 1, 2, 3])).toEqual('０１２３');
  expect(dq2.toStringName([4, 5, 6, 7])).toEqual('４５６７');
  expect(dq2.toStringName([8, 9, 10, 11])).toEqual('８９あい');
  expect(dq2.toStringName([12, 13, 14, 15])).toEqual('うえおか');
  expect(dq2.toStringName([16, 17, 18, 19])).toEqual('きくけこ');
  expect(dq2.toStringName([20, 21, 22, 23])).toEqual('さしすせ');
  expect(dq2.toStringName([24, 25, 26, 27])).toEqual('そたちつ');
  expect(dq2.toStringName([28, 29, 30, 31])).toEqual('てとなに');
  expect(dq2.toStringName([32, 33, 34, 35])).toEqual('ぬねのは');
  expect(dq2.toStringName([36, 37, 38, 39])).toEqual('ひふへほ');
  expect(dq2.toStringName([40, 41, 42, 43])).toEqual('まみむめ');
  expect(dq2.toStringName([44, 45, 46, 47])).toEqual('もやゆよ');
  expect(dq2.toStringName([48, 49, 50, 51])).toEqual('らりるれ');
  expect(dq2.toStringName([52, 53, 54, 55])).toEqual('ろわをん');
  expect(dq2.toStringName([56, 57, 58, 59])).toEqual('っゃゅょ');
  expect(dq2.toStringName([60, 61, 62, 62])).toEqual('゛゜　　');
});

it('dq2pswd.toNumberName', () => {
  expect(dq2.toNumberName('０１２３')).toEqual([0, 1, 2, 3]);
  expect(dq2.toNumberName('４５６７')).toEqual([4, 5, 6, 7]);
  expect(dq2.toNumberName('８９あい')).toEqual([8, 9, 10, 11]);
  expect(dq2.toNumberName('うえおか')).toEqual([12, 13, 14, 15]);
  expect(dq2.toNumberName('きくけこ')).toEqual([16, 17, 18, 19]);
  expect(dq2.toNumberName('さしすせ')).toEqual([20, 21, 22, 23]);
  expect(dq2.toNumberName('そたちつ')).toEqual([24, 25, 26, 27]);
  expect(dq2.toNumberName('てとなに')).toEqual([28, 29, 30, 31]);
  expect(dq2.toNumberName('ぬねのは')).toEqual([32, 33, 34, 35]);
  expect(dq2.toNumberName('ひふへほ')).toEqual([36, 37, 38, 39]);
  expect(dq2.toNumberName('まみむめ')).toEqual([40, 41, 42, 43]);
  expect(dq2.toNumberName('もやゆよ')).toEqual([44, 45, 46, 47]);
  expect(dq2.toNumberName('らりるれ')).toEqual([48, 49, 50, 51]);
  expect(dq2.toNumberName('ろわをん')).toEqual([52, 53, 54, 55]);
  expect(dq2.toNumberName('っゃゅょ')).toEqual([56, 57, 58, 59]);
  expect(dq2.toNumberName('゛゜　　')).toEqual([60, 61, 62, 62]);

  expect(dq2.toNumberName('がぎ')).toEqual([15, 60, 16, 60]);
  expect(dq2.toNumberName('ぐげ')).toEqual([17, 60, 18, 60]);
  expect(dq2.toNumberName('ござ')).toEqual([19, 60, 20, 60]);
  expect(dq2.toNumberName('じず')).toEqual([21, 60, 22, 60]);
  expect(dq2.toNumberName('ぜぞ')).toEqual([23, 60, 24, 60]);
  expect(dq2.toNumberName('だぢ')).toEqual([25, 60, 26, 60]);
  expect(dq2.toNumberName('づで')).toEqual([27, 60, 28, 60]);
  expect(dq2.toNumberName('どば')).toEqual([29, 60, 35, 60]);
  expect(dq2.toNumberName('びぶ')).toEqual([36, 60, 37, 60]);
  expect(dq2.toNumberName('べぼ')).toEqual([38, 60, 39, 60]);
  expect(dq2.toNumberName('ぱぴ')).toEqual([35, 61, 36, 61]);
  expect(dq2.toNumberName('ぷぺ')).toEqual([37, 61, 38, 61]);
  expect(dq2.toNumberName('ぽ　　')).toEqual([39, 61, 62, 62]);
  expect(dq2.toNumberName('ｱｲｳｴ')).toEqual([10, 11, 12, 13]);
  expect(dq2.toNumberName('0123')).toEqual([0, 1, 2, 3]);
  expect(dq2.toNumberName('ｧｬｦ ')).toEqual([10, 57, 54, 62]);
});

it('dq2pswd.toStringPassword', () => {
  expect(dq2.toStringPassword([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])).toEqual(
    'あいうえおかきくけこさしすせそたちつてと'
  );
  expect(
    dq2.toStringPassword([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39])
  ).toEqual('なにぬねのはひふへほまみむめもやゆよらり');
  expect(
    dq2.toStringPassword([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59])
  ).toEqual('るれろわがぎぐげござじずぜぞばびぶべぼぱ');
  expect(
    dq2.toStringPassword([60, 61, 62, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63])
  ).toEqual('ぴぷぺぽぽぽぽぽぽぽぽぽぽぽぽぽぽぽぽぽ');
});

it('dq2pswd.toNumberPassword', () => {
  expect(dq2.toNumberPassword('あいうえお　かきくけこさし　すせそたち　つてと')).toEqual([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ]);
  expect(dq2.toNumberPassword('なにぬねのはひふへほまみむめもやゆよらり')).toEqual([
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ]);
  expect(dq2.toNumberPassword('るれろわが ぎぐげご ざじずぜ ぞばびぶべぼぱ')).toEqual([
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  ]);
  expect(dq2.toNumberPassword('ぴぷぺぽぽ　ぽぽぽぽぽぽぽ　ぽぽぽぽぽ　ぽぽぽ')).toEqual([
    60, 61, 62, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63,
  ]);
});

it('dq2pswd.toNormalizePassword', () => {
  expect(dq2.toNormalizePassword('あいうえお')).toEqual('あいうえお');
  expect(dq2.toNormalizePassword('ぁぃぅぇぉ')).toEqual('あいうえお');
  expect(dq2.toNormalizePassword('あ　い うaえbお')).toEqual('あいうえお');
  expect(dq2.toNormalizePassword('あい？えお')).toEqual('あい？えお');
});

it('dq2pswd.createPassword', () => {
  const info: dq2.Dq2PasswordInfo = {
    roName: 'あいうえ',
    roItems: [1],
    roExp: 123,

    saFlag: true,
    saItems: [2],
    saExp: 12,

    muFlag: true,
    muItems: [3],
    muExp: 3,

    gold: 456,
    town: 1,

    flagMoon: false,
    flagGate: false,
    flagPlumage: false,
    statShip: 0,
    statPrince: 0,

    crestLife: false,
    crestWater: false,
    crestMoon: false,
    crestStar: false,
    crestSun: false,

    cryptKey: 1,
    checkCode: 0,
    valid: false,
  };
  expect(dq2.createPassword(info)).toEqual('ぺにはまぜゆされせつにさそはこそてきさひまじさそてきその');
});

it('dq2pswd.createPassword and dq2pswd.analyzePassword', () => {
  const info: dq2.Dq2PasswordInfo = {
    roName: 'あ　　　',
    roItems: [],
    roExp: 0,

    saFlag: false,
    saItems: [],
    saExp: 0,

    muFlag: false,
    muItems: [],
    muExp: 0,

    gold: 0,
    town: 0,

    flagMoon: false,
    flagGate: false,
    flagPlumage: false,
    statShip: 0,
    statPrince: 0,

    crestLife: false,
    crestWater: false,
    crestMoon: false,
    crestStar: false,
    crestSun: false,

    cryptKey: 0,
    checkCode: 0,
    valid: true,
  };
  const password = dq2.createPassword(info);
  expect(password).toEqual('がぺぎごよけすすたてにやられがげじぞ');
  const info2 = dq2.analyzePassword(password);
  expect(info2).not.toBeUndefined();
  if (!info2) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info2.roName).toEqual(info.roName);
  expect(info2.gold).toEqual(info.gold);
  expect(info2.town).toEqual(info.town);
  expect(info2.flagMoon).toEqual(info.flagMoon);
  expect(info2.flagGate).toEqual(info.flagGate);
  expect(info2.flagPlumage).toEqual(info.flagPlumage);
  expect(info2.statShip).toEqual(info.statShip);
  expect(info2.statPrince).toEqual(info.statPrince);
  expect(info2.crestLife).toEqual(info.crestLife);
  expect(info2.crestWater).toEqual(info.crestWater);
  expect(info2.crestMoon).toEqual(info.crestMoon);
  expect(info2.crestStar).toEqual(info.crestStar);
  expect(info2.crestSun).toEqual(info.crestSun);

  expect(info2.roExp).toEqual(info.roExp);
  expect(info2.roItems).toEqual(info.roItems);
  expect(info2.saFlag).toEqual(info.saFlag);
  expect(info2.saExp).toEqual(info.saExp);
  expect(info2.saItems).toEqual(info.saItems);
  expect(info2.muFlag).toEqual(info.muFlag);
  expect(info2.muExp).toEqual(info.muExp);
  expect(info2.muItems).toEqual(info.muItems);

  expect(info2.cryptKey).toEqual(info.cryptKey);
  expect(info2.checkCode).toEqual(info.checkCode);
  expect(info2.valid).toEqual(info.valid);
});

it('dq2pswd.analyzePassword 18文字', () => {
  const info = dq2.analyzePassword('がぺぎごよけすすげあえふまめゆりろぎ');

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('あ　　　');
  expect(info.gold).toEqual(0);
  expect(info.town).toEqual(0);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(0);
  expect(info.statPrince).toEqual(0);

  expect(info.crestLife).toEqual(false);
  expect(info.crestWater).toEqual(false);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(false);

  expect(info.roExp).toEqual(0);
  expect(info.roItems).toEqual([]);
  expect(info.saFlag).toEqual(false);
  expect(info.saExp).toEqual(0);
  expect(info.saItems).toEqual([]);
  expect(info.muFlag).toEqual(false);
  expect(info.muExp).toEqual(0);
  expect(info.muItems).toEqual([]);

  expect(info.cryptKey).toEqual(15);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.analyzePassword 19文字', () => {
  const info = dq2.analyzePassword('じえざずりこすしせつとなぬのひまむうゆ');

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('あ　　　');
  expect(info.gold).toEqual(0);
  expect(info.town).toEqual(0);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(0);
  expect(info.statPrince).toEqual(0);

  expect(info.crestLife).toEqual(false);
  expect(info.crestWater).toEqual(false);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(false);

  expect(info.roExp).toEqual(0);
  expect(info.roItems).toEqual([1, 2]);
  expect(info.saFlag).toEqual(false);
  expect(info.saExp).toEqual(0);
  expect(info.saItems).toEqual([]);
  expect(info.muFlag).toEqual(false);
  expect(info.muExp).toEqual(0);
  expect(info.muItems).toEqual([]);

  expect(info.cryptKey).toEqual(2);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.analyzePassword 20文字', () => {
  const info = dq2.analyzePassword('ごあぎぐめうおうやらりはひふへむめうやぴ');

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('あ　　　');
  expect(info.gold).toEqual(0);
  expect(info.town).toEqual(0);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(0);
  expect(info.statPrince).toEqual(0);

  expect(info.crestLife).toEqual(false);
  expect(info.crestWater).toEqual(false);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(false);

  expect(info.roExp).toEqual(0);
  expect(info.roItems).toEqual([1, 2, 3]);
  expect(info.saFlag).toEqual(false);
  expect(info.saExp).toEqual(0);
  expect(info.saItems).toEqual([]);
  expect(info.muFlag).toEqual(false);
  expect(info.muExp).toEqual(0);
  expect(info.muItems).toEqual([]);

  expect(info.cryptKey).toEqual(3);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.analyzePassword 22文字', () => {
  const info = dq2.analyzePassword('さふこしぽめゆやよわぎのひへまゆらけろおぬの');

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('あ　　　');
  expect(info.gold).toEqual(0);
  expect(info.town).toEqual(0);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(0);
  expect(info.statPrince).toEqual(0);

  expect(info.crestLife).toEqual(false);
  expect(info.crestWater).toEqual(false);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(false);

  expect(info.roExp).toEqual(0);
  expect(info.roItems).toEqual([1, 2, 3, 4]);
  expect(info.saFlag).toEqual(false);
  expect(info.saExp).toEqual(0);
  expect(info.saItems).toEqual([]);
  expect(info.muFlag).toEqual(false);
  expect(info.muExp).toEqual(0);
  expect(info.muItems).toEqual([]);

  expect(info.cryptKey).toEqual(4);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.analyzePassword 23文字', () => {
  const info = dq2.analyzePassword('へぐほむにぶぴぴみられぱぺいおすたじにごえちと');

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('あ　　　');
  expect(info.gold).toEqual(0);
  expect(info.town).toEqual(0);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(0);
  expect(info.statPrince).toEqual(0);

  expect(info.crestLife).toEqual(false);
  expect(info.crestWater).toEqual(false);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(false);

  expect(info.roExp).toEqual(0);
  expect(info.roItems).toEqual([1, 2, 3, 4, 5]);
  expect(info.saFlag).toEqual(false);
  expect(info.saExp).toEqual(0);
  expect(info.saItems).toEqual([]);
  expect(info.muFlag).toEqual(false);
  expect(info.muExp).toEqual(0);
  expect(info.muItems).toEqual([]);

  expect(info.cryptKey).toEqual(5);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.analyzePassword 28文字', () => {
  const info = dq2.analyzePassword('ぺにはまぜゆされせつにさそはこそてきさひまじさそてきその');

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('あいうえ');
  expect(info.gold).toEqual(456);
  expect(info.town).toEqual(1);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(0);
  expect(info.statPrince).toEqual(0);

  expect(info.crestLife).toEqual(false);
  expect(info.crestWater).toEqual(false);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(false);

  expect(info.roExp).toEqual(123);
  expect(info.roItems).toEqual([1]);
  expect(info.saFlag).toEqual(true);
  expect(info.saExp).toEqual(12);
  expect(info.saItems).toEqual([2]);
  expect(info.muFlag).toEqual(true);
  expect(info.muExp).toEqual(3);
  expect(info.muItems).toEqual([3]);

  expect(info.cryptKey).toEqual(1);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.analyzePassword 52文字', () => {
  const info = dq2.analyzePassword(
    'けのかきべひへひふもゆぜぞばびあいもえへぎぶぽえらげござずぜはぐぼいかねけかりるれろずぴめおまげひざぺか'
  );

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('あ　　　');
  expect(info.gold).toEqual(0);
  expect(info.town).toEqual(0);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(0);
  expect(info.statPrince).toEqual(0);

  expect(info.crestLife).toEqual(false);
  expect(info.crestWater).toEqual(false);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(false);

  expect(info.roExp).toEqual(0);
  expect(info.roItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  expect(info.saFlag).toEqual(true);
  expect(info.saExp).toEqual(0);
  expect(info.saItems).toEqual([9, 10, 11, 12, 13, 14, 15, 16]);
  expect(info.muFlag).toEqual(true);
  expect(info.muExp).toEqual(0);
  expect(info.muItems).toEqual([17, 18, 19, 20, 21, 22, 24, 25]);

  expect(info.cryptKey).toEqual(6);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.analyzePassword 後ろに余計なデータ', () => {
  const info = dq2.analyzePassword(
    'ゆうていみやおうきむこうほりいゆうじとりやまあきらぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺ'
  );

  expect(info).not.toBeUndefined();
  if (!info) {
    // ESLint の警告を抑止するため。
    throw new Error('前段で undefined でないことのチェックをしているので、ここに来ることはない');
  }
  expect(info.roName).toEqual('もょもと');
  expect(info.gold).toEqual(27671);
  expect(info.town).toEqual(1);
  expect(info.flagMoon).toEqual(false);
  expect(info.flagGate).toEqual(false);
  expect(info.flagPlumage).toEqual(false);
  expect(info.statShip).toEqual(1);
  expect(info.statPrince).toEqual(1);

  expect(info.crestLife).toEqual(true);
  expect(info.crestWater).toEqual(true);
  expect(info.crestMoon).toEqual(false);
  expect(info.crestStar).toEqual(false);
  expect(info.crestSun).toEqual(true);

  expect(info.roExp).toEqual(942197);
  expect(info.roItems).toEqual([]);
  expect(info.saFlag).toEqual(false);
  expect(info.saExp).toEqual(0);
  expect(info.saItems).toEqual([]);
  expect(info.muFlag).toEqual(false);
  expect(info.muExp).toEqual(0);
  expect(info.muItems).toEqual([]);

  expect(info.cryptKey).toEqual(6);
  expect(info.checkCode).toEqual(0);
  expect(info.valid).toEqual(true);
});

it('dq2pswd.editPassword', () => {
  expect(
    dq2.editPassword(
      'ゆうていみやおうきむこうほりいゆうじとりやまあきらぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺ'
    )
  ).toEqual(
    'ゆうて　いみや　おうきむ\nこうほ　りいゆ　うじとり\nやまあ　きらぺ　ぺぺぺぺ\nぺぺぺ　ぺぺぺ　ぺぺぺぺ\nぺぺぺ　ぺぺぺ　ぺぺぺぺ　ぺぺ'
  );
  expect(dq2.editPassword('ゆうていみやおうきむこうほりいゆうじ')).toEqual(
    'ゆうて　いみや　おうきむ\nこうほ　りいゆ　うじ'
  );
});
