import * as dq2pswd from './dq2pswd';

test("dq2pswd.toStringName", () => {
    const dq2 = new dq2pswd.Dq2Password();
    expect(dq2.toStringName([0, 1, 2, 3])).toEqual("０１２３");
    expect(dq2.toStringName([10, 11, 12, 13])).toEqual("あいうえ");
    expect(dq2.toStringName([62, 62, 62, 62])).toEqual("　　　　");

    expect(dq2.toStringName([0, 1, 2, 3])).toEqual("０１２３");
    expect(dq2.toStringName([4, 5, 6, 7])).toEqual("４５６７");
    expect(dq2.toStringName([8, 9, 10, 11])).toEqual("８９あい");
    expect(dq2.toStringName([12, 13, 14, 15])).toEqual("うえおか");
    expect(dq2.toStringName([16, 17, 18, 19])).toEqual("きくけこ");
    expect(dq2.toStringName([20, 21, 22, 23])).toEqual("さしすせ");
    expect(dq2.toStringName([24, 25, 26, 27])).toEqual("そたちつ");
    expect(dq2.toStringName([28, 29, 30, 31])).toEqual("てとなに");
    expect(dq2.toStringName([32, 33, 34, 35])).toEqual("ぬねのは");
    expect(dq2.toStringName([36, 37, 38, 39])).toEqual("ひふへほ");
    expect(dq2.toStringName([40, 41, 42, 43])).toEqual("まみむめ");
    expect(dq2.toStringName([44, 45, 46, 47])).toEqual("もやゆよ");
    expect(dq2.toStringName([48, 49, 50, 51])).toEqual("らりるれ");
    expect(dq2.toStringName([52, 53, 54, 55])).toEqual("ろわをん");
    expect(dq2.toStringName([56, 57, 58, 59])).toEqual("っゃゅょ");
    expect(dq2.toStringName([60, 61, 62, 62])).toEqual("゛゜　　");
});

it("dq2pswd.toNumberName", () => {
    const dq2 = new dq2pswd.Dq2Password();
    expect(dq2.toNumberName("０１２３")).toEqual([0, 1, 2, 3]);
    expect(dq2.toNumberName("４５６７")).toEqual([4, 5, 6, 7]);
    expect(dq2.toNumberName("８９あい")).toEqual([8, 9, 10, 11]);
    expect(dq2.toNumberName("うえおか")).toEqual([12, 13, 14, 15]);
    expect(dq2.toNumberName("きくけこ")).toEqual([16, 17, 18, 19]);
    expect(dq2.toNumberName("さしすせ")).toEqual([20, 21, 22, 23]);
    expect(dq2.toNumberName("そたちつ")).toEqual([24, 25, 26, 27]);
    expect(dq2.toNumberName("てとなに")).toEqual([28, 29, 30, 31]);
    expect(dq2.toNumberName("ぬねのは")).toEqual([32, 33, 34, 35]);
    expect(dq2.toNumberName("ひふへほ")).toEqual([36, 37, 38, 39]);
    expect(dq2.toNumberName("まみむめ")).toEqual([40, 41, 42, 43]);
    expect(dq2.toNumberName("もやゆよ")).toEqual([44, 45, 46, 47]);
    expect(dq2.toNumberName("らりるれ")).toEqual([48, 49, 50, 51]);
    expect(dq2.toNumberName("ろわをん")).toEqual([52, 53, 54, 55]);
    expect(dq2.toNumberName("っゃゅょ")).toEqual([56, 57, 58, 59]);
    expect(dq2.toNumberName("゛゜　　")).toEqual([60, 61, 62, 62]);

    expect(dq2.toNumberName("がぎ")).toEqual([15, 60, 16, 60]);
    expect(dq2.toNumberName("ぐげ")).toEqual([17, 60, 18, 60]);
    expect(dq2.toNumberName("ござ")).toEqual([19, 60, 20, 60]);
    expect(dq2.toNumberName("じず")).toEqual([21, 60, 22, 60]);
    expect(dq2.toNumberName("ぜぞ")).toEqual([23, 60, 24, 60]);
    expect(dq2.toNumberName("だぢ")).toEqual([25, 60, 26, 60]);
    expect(dq2.toNumberName("づで")).toEqual([27, 60, 28, 60]);
    expect(dq2.toNumberName("どば")).toEqual([29, 60, 35, 60]);
    expect(dq2.toNumberName("びぶ")).toEqual([36, 60, 37, 60]);
    expect(dq2.toNumberName("べぼ")).toEqual([38, 60, 39, 60]);
    expect(dq2.toNumberName("ぱぴ")).toEqual([35, 61, 36, 61]);
    expect(dq2.toNumberName("ぷぺ")).toEqual([37, 61, 38, 61]);
    expect(dq2.toNumberName("ぽ　　")).toEqual([39, 61, 62, 62]);
    expect(dq2.toNumberName("ｱｲｳｴ")).toEqual([10, 11, 12, 13]);
    expect(dq2.toNumberName("0123")).toEqual([0, 1, 2, 3]);
    expect(dq2.toNumberName("ｧｬｦ ")).toEqual([10, 57, 54, 62]);
});

it("dq2pswd.toStringPassword", () => {
    const dq2 = new dq2pswd.Dq2Password();
    expect(dq2.toStringPassword([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])).toEqual("あいうえおかきくけこさしすせそたちつてと");
    expect(dq2.toStringPassword([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39])).toEqual("なにぬねのはひふへほまみむめもやゆよらり");
    expect(dq2.toStringPassword([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59])).toEqual("るれろわがぎぐげござじずぜぞばびぶべぼぱ");
    expect(dq2.toStringPassword([60, 61, 62, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63])).toEqual("ぴぷぺぽぽぽぽぽぽぽぽぽぽぽぽぽぽぽぽぽ");
});

it("dq2pswd.toNumberPassword", () => {
    const dq2 = new dq2pswd.Dq2Password();
    expect(dq2.toNumberPassword("あいうえお　かきくけこさし　すせそたち　つてと")).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    expect(dq2.toNumberPassword("なにぬねのはひふへほまみむめもやゆよらり")).toEqual([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
    expect(dq2.toNumberPassword("るれろわが ぎぐげご ざじずぜ ぞばびぶべぼぱ")).toEqual([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
    expect(dq2.toNumberPassword("ぴぷぺぽぽ　ぽぽぽぽぽぽぽ　ぽぽぽぽぽ　ぽぽぽ")).toEqual([60, 61, 62, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63]);
});

it("dq2pswd.toNormalizePassword", () => {
    const dq2 = new dq2pswd.Dq2Password();
    expect(dq2.toNormalizePassword("あいうえお")).toEqual("あいうえお");
    expect(dq2.toNormalizePassword("ぁぃぅぇぉ")).toEqual("あいうえお");
    expect(dq2.toNormalizePassword("あ　い うaえbお")).toEqual("あいうえお");
    expect(dq2.toNormalizePassword("あい？えお")).toEqual("あい？えお");
});

it("dq2pswd.createPassword", () => {
    const dq2 = new dq2pswd.Dq2Password();
    var info: dq2pswd.Dq2PasswordInfo = {

        ro_name: "あいうえ",
        ro_item: [1],
        ro_exp: 123,

        sa_flag: true,
        sa_item: [2],
        sa_exp: 12,

        mu_flag: true,
        mu_item: [3],
        mu_exp: 3,

        gold: 456,
        town: 1,

        flag_moon: false,
        flag_gate: false,
        flag_plumage: false,
        stat_ship: 0,
        stat_prince: 0,

        crest_life: false,
        crest_water: false,
        crest_moon: false,
        crest_star: false,
        crest_sun: false,

        cryptKey: 1,
        checkCode: 0,
        valid: false,
    };
    expect(dq2.createPassword(info)).toEqual("ぺにはまぜゆされせつにさそはこそてきさひまじさそてきその");
});

it("dq2pswd.createPassword and dq2pswd.analyzePassword", () => {
    const dq2 = new dq2pswd.Dq2Password();
    var info: dq2pswd.Dq2PasswordInfo = {

        ro_name: "あ　　　",
        ro_item: [],
        ro_exp: 0,

        sa_flag: false,
        sa_item: [],
        sa_exp: 0,

        mu_flag: false,
        mu_item: [],
        mu_exp: 0,

        gold: 0,
        town: 0,

        flag_moon: false,
        flag_gate: false,
        flag_plumage: false,
        stat_ship: 0,
        stat_prince: 0,

        crest_life: false,
        crest_water: false,
        crest_moon: false,
        crest_star: false,
        crest_sun: false,

        cryptKey: 0,
        checkCode: 0,
        valid: true,
    };
    const password = dq2.createPassword(info);
    expect(password).toEqual("がぺぎごよけすすたてにやられがげじぞ");
    const info2 = dq2.analyzePassword(password);
    expect(info2).not.toBeNull();
    expect(info2!.ro_name).toEqual(info.ro_name);
    expect(info2!.gold).toEqual(info.gold);
    expect(info2!.town).toEqual(info.town);
    expect(info2!.flag_moon).toEqual(info.flag_moon);
    expect(info2!.flag_gate).toEqual(info.flag_gate);
    expect(info2!.flag_plumage).toEqual(info.flag_plumage);
    expect(info2!.stat_ship).toEqual(info.stat_ship);
    expect(info2!.stat_prince).toEqual(info.stat_prince);
    expect(info2!.crest_life).toEqual(info.crest_life);
    expect(info2!.crest_water).toEqual(info.crest_water);
    expect(info2!.crest_moon).toEqual(info.crest_moon);
    expect(info2!.crest_star).toEqual(info.crest_star);
    expect(info2!.crest_sun).toEqual(info.crest_sun);

    expect(info2!.ro_exp).toEqual(info.ro_exp);
    expect(info2!.ro_item).toEqual(info.ro_item);
    expect(info2!.sa_flag).toEqual(info.sa_flag);
    expect(info2!.sa_exp).toEqual(info.sa_exp);
    expect(info2!.sa_item).toEqual(info.sa_item);
    expect(info2!.mu_flag).toEqual(info.mu_flag);
    expect(info2!.mu_exp).toEqual(info.mu_exp);
    expect(info2!.mu_item).toEqual(info.mu_item);

    expect(info2!.cryptKey).toEqual(info.cryptKey);
    expect(info2!.checkCode).toEqual(info.checkCode);
    expect(info2!.valid).toEqual(info.valid);
});

it("dq2pswd.analyzePassword", () => {
    const dq2 = new dq2pswd.Dq2Password();
    // var info = dq2.analyzePassword("ゆうていみやおうきむこうほりいゆうじとりやまあきらぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺ");
    const info = dq2.analyzePassword("ぺにはまぜゆされせつにさそはこそてきさひまじさそてきその");

    expect(info).not.toBeNull();
    expect(info!.ro_name).toEqual("あいうえ");
    expect(info!.gold).toEqual(456);
    expect(info!.town).toEqual(1);
    expect(info!.flag_moon).toEqual(false);
    expect(info!.flag_gate).toEqual(false);
    expect(info!.flag_plumage).toEqual(false);
    expect(info!.stat_ship).toEqual(0);
    expect(info!.stat_prince).toEqual(0);

    expect(info!.crest_life).toEqual(false);
    expect(info!.crest_water).toEqual(false);
    expect(info!.crest_moon).toEqual(false);
    expect(info!.crest_star).toEqual(false);
    expect(info!.crest_sun).toEqual(false);

    expect(info!.ro_exp).toEqual(123);
    expect(info!.ro_item).toEqual([1]);
    expect(info!.sa_flag).toEqual(true);
    expect(info!.sa_exp).toEqual(12);
    expect(info!.sa_item).toEqual([2]);
    expect(info!.mu_flag).toEqual(true);
    expect(info!.mu_exp).toEqual(3);
    expect(info!.mu_item).toEqual([3]);

    expect(info!.cryptKey).toEqual(1);
    expect(info!.checkCode).toEqual(0);
    expect(info!.valid).toEqual(true);
});

// it("dq2pswd.hatenaPassword", () => {
//     const dq2 = new dq2pswd.Dq2Password();
//     expect(dq2.hatenaPassword("ふるいけや  かわずとびこむ  みずのおと  あ？？")).toEqual([
//         "ふるいけやかわずとびこむみずのおとあえほ",
//         "ふるいけやかわずとびこむみずのおとあおぞ",
//         "ふるいけやかわずとびこむみずのおとあきぐ",
//         "ふるいけやかわずとびこむみずのおとあさお",
//         "ふるいけやかわずとびこむみずのおとあへれ",
//         "ふるいけやかわずとびこむみずのおとあまも",
//         "ふるいけやかわずとびこむみずのおとあむぼ",
//         "ふるいけやかわずとびこむみずのおとあもづ",
//         "ふるいけやかわずとびこむみずのおとあよて",
//         "ふるいけやかわずとびこむみずのおとありし",
//         "ふるいけやかわずとびこむみずのおとあれる",
//         "ふるいけやかわずとびこむみずのおとあわめ",
//         "ふるいけやかわずとびこむみずのおとあぶそ",
//         "ふるいけやかわずとびこむみずのおとあぼく"]);
//     expect(dq2.hatenaPassword("ふるいけや　かわずとびこむ　みずのおと　？？？").length).toEqual(900);
// });

// it("dq2pswd.countHatena", () => {
//     const dq2 = new dq2pswd.Dq2Password();
//     expect(dq2.countHatena("ふるいけやかわずとびこむみずのおとばしや")).toEqual(0);
//     expect(dq2.countHatena("ふるいけやかわずとびこむみずのおとばし？")).toEqual(1);
//     expect(dq2.countHatena("ふるいけやかわずとびこむみずのおとば？？")).toEqual(2);
//     expect(dq2.countHatena("？るいけやかわずとびこむみずのおとば？？")).toEqual(3);
// });

it("dq2pswd.editPassword", () => {
    const dq2 = new dq2pswd.Dq2Password();
    expect(dq2
        .editPassword("ゆうていみやおうきむこうほりいゆうじとりやまあきらぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺぺ"))
        .toEqual("ゆうて　いみや　おうきむ\nこうほ　りいゆ　うじとり\nやまあ　きらぺ　ぺぺぺぺ\nぺぺぺ　ぺぺぺ　ぺぺぺぺ\nぺぺぺ　ぺぺぺ　ぺぺぺぺ　ぺぺ");
    expect(dq2
        .editPassword("ゆうていみやおうきむこうほりいゆうじ"))
        .toEqual("ゆうて　いみや　おうきむ\nこうほ　りいゆ　うじ");
});
