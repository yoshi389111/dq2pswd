/** DQ2用復活の呪文の解析/捏造 */
import { BitArray, BitReader } from "./bitarray"

/** 名前の長さ */
const NAME_LENGTH = 4;
/** 復活の呪文の長さ[文字数](1文字=6bit) */
const JUMON_MAX_LENGTH = 52;
/** 復活の呪文の長さ[文字数](1文字=6bit) */
const JUMON_MIN_LENGTH = 18;
/** 経験値の最大 */
export const EXP_MAX_VALUE = 1000000;
/** 名前用五十音 */
const NAME_ALPHABET =
    "０１２３４５６７８９" +
    "あいうえお" +
    "かきくけこ" +
    "さしすせそ" +
    "たちつてと" +
    "なにぬねの" +
    "はひふへほ" +
    "まみむめも" +
    "やゆよ" +
    "らりるれろ" +
    "わをん" +
    "っゃゅょ" +
    "゛゜　"; // 全角スペース

/** 半角カナを全角かなに変換する読み替えデータ */
const HANKAKU_TO_ZENKAKU: Readonly<{ [key: string]: string }> = {
    "0": "０", "1": "１", "2": "２", "3": "３", "4": "４",
    "5": "５", "6": "６", "7": "７", "8": "８", "9": "９",
    "ｦ": "を", "ｧ": "ぁ", "ｨ": "ぃ", "ｩ": "ぅ", "ｪ": "ぇ", "ｫ": "ぉ",
    "ｬ": "ゃ", "ｭ": "ゅ", "ｮ": "ょ", "ｯ": "っ", "ｰ": "ー",
    "ｱ": "あ", "ｲ": "い", "ｳ": "う", "ｴ": "え", "ｵ": "お",
    "ｶ": "か", "ｷ": "き", "ｸ": "く", "ｹ": "け", "ｺ": "こ",
    "ｻ": "さ", "ｼ": "し", "ｽ": "す", "ｾ": "せ", "ｿ": "そ",
    "ﾀ": "た", "ﾁ": "ち", "ﾂ": "つ", "ﾃ": "て", "ﾄ": "と",
    "ﾅ": "な", "ﾆ": "に", "ﾇ": "ぬ", "ﾈ": "ね", "ﾉ": "の",
    "ﾊ": "は", "ﾋ": "ひ", "ﾌ": "ふ", "ﾍ": "へ", "ﾎ": "ほ",
    "ﾏ": "ま", "ﾐ": "み", "ﾑ": "む", "ﾒ": "め", "ﾓ": "も",
    "ﾔ": "や", "ﾕ": "ゆ", "ﾖ": "よ",
    "ﾗ": "ら", "ﾘ": "り", "ﾙ": "る", "ﾚ": "れ", "ﾛ": "ろ",
    "ﾜ": "わ", "ﾝ": "ん", "ﾞ": "゛", "ﾟ": "゜", " ": "　",
};

/** 名前読み換えデータ */
const NAME_ALIAS: Readonly<{ [key: string]: string }> = {
    "ぁ": "あ", "ぃ": "い", "ぅ": "う", "ぇ": "え", "ぉ": "お",
    "が": "か゛", "ぎ": "き゛", "ぐ": "く゛", "げ": "け゛", "ご": "こ゛",
    "ざ": "さ゛", "じ": "し゛", "ず": "す゛", "ぜ": "せ゛", "ぞ": "そ゛",
    "だ": "た゛", "ぢ": "ち゛", "づ": "つ゛", "で": "て゛", "ど": "と゛",
    "ば": "は゛", "び": "ひ゛", "ぶ": "ふ゛", "べ": "へ゛", "ぼ": "ほ゛",
    "ぱ": "は゜", "ぴ": "ひ゜", "ぷ": "ふ゜", "ぺ": "へ゜", "ぽ": "ほ゜",
    "ゐ": "い", "ゑ": "え", "\u3094": "う゛", // 「う」＋濁点
    "\u308e": "わ", "\u3095": "か", "\u3096": "け", // 小さい「わ」「か」「け」
    "ァ": "あ", "ィ": "い", "ゥ": "う", "ェ": "え", "ォ": "お",
    "ア": "あ", "イ": "い", "ウ": "う", "エ": "え", "オ": "お",
    "カ": "か", "キ": "き", "ク": "く", "ケ": "け", "コ": "こ",
    "サ": "さ", "シ": "し", "ス": "す", "セ": "せ", "ソ": "そ",
    "タ": "た", "チ": "ち", "ツ": "つ", "テ": "て", "ト": "と",
    "ナ": "な", "ニ": "に", "ヌ": "ぬ", "ネ": "ね", "ノ": "の",
    "ハ": "は", "ヒ": "ひ", "フ": "ふ", "ヘ": "へ", "ホ": "ほ",
    "マ": "ま", "ミ": "み", "ム": "む", "メ": "め", "モ": "も",
    "ヤ": "や", "ユ": "ゆ", "ヨ": "よ",
    "ラ": "ら", "リ": "り", "ル": "る", "レ": "れ", "ロ": "ろ",
    "ワ": "わ", "ヲ": "を", "ン": "ん",
    "ガ": "か゛", "ギ": "き゛", "グ": "く゛", "ゲ": "け゛", "ゴ": "こ゛",
    "ザ": "さ゛", "ジ": "し゛", "ズ": "す゛", "ゼ": "せ゛", "ゾ": "そ゛",
    "ダ": "た゛", "ヂ": "ち゛", "ヅ": "つ゛", "デ": "て゛", "ド": "と゛",
    "バ": "は゛", "ビ": "ひ゛", "ブ": "ふ゛", "ベ": "へ゛", "ボ": "ほ゛",
    "パ": "は゜", "ピ": "ひ゜", "プ": "ふ゜", "ペ": "へ゜", "ポ": "ほ゜",
    "ャ": "ゃ", "ュ": "ゅ", "ョ": "ょ", "ッ": "っ",
    "ヰ": "い", "ヱ": "え", "ヴ": "う゛",
    "\u30ee": "わ", "\u30f5": "か", "\u30f6": "け", // 小さい「ワ」「カ」「ケ」
    "\u30f7": "わ゛", "\u30f8": "い゛", "\u30f9": "え゛", "\u30fa": "を゛", // 「ワ」「ヰ」「ヱ」「ヲ」＋濁点
    "\u3099": "\u309b", "\u309a": "\u309c", // 結合文字用濁点/半濁点
    // アイヌ語表音拡張（小さいカタカナ）
    "\u31f0": "く", "\u31f1": "し", "\u31f2": "す", "\u31f3": "と", "\u31f4": "ぬ",
    "\u31f5": "は", "\u31f6": "ひ", "\u31f7": "ふ", "\u31f8": "へ", "\u31f9": "ほ",
    "\u31fa": "む",
    "\u31fb": "ら", "\u31fc": "り", "\u31fd": "る", "\u31fe": "れ", "\u31ff": "ろ",
};

/** 復活の呪文用五十音 */
const JUMON_ALPHABET: Readonly<string> =
    "あいうえお" +
    "かきくけこ" +
    "さしすせそ" +
    "たちつてと" +
    "なにぬねの" +
    "はひふへほ" +
    "まみむめも" +
    "やゆよ" +
    "らりるれろ" +
    "わ" +
    "がぎぐげご" +
    "ざじずぜぞ" +
    "ばびぶべぼ" +
    "ぱぴぷぺぽ";

/** 復活の呪文読み換えデータ */
const JUMON_ALIAS: Readonly<{ [key: string]: string }> = {
    "ぁ": "あ", "ぃ": "い", "ぅ": "う", "ぇ": "え", "ぉ": "お",
    "ゃ": "や", "ゅ": "ゆ", "ょ": "よ", "っ": "つ", "を": "お",
    "?": "？", "*": "＊"
};

/** 選択肢 */
export interface LabelInfo {
    /** id */
    id: number;
    /** 名称 */
    name: string;
    /** 装備可能者. 1=ローレシア,2=サマルトリア,4=ムーンブルク */
    equip?: number;
    /** 異例データ */
    illegal?: boolean;
    /** 装備品の種類 */
    type?: string;
}

/** アイテム一覧. id でソートしているので添え字アクセスも可能 */
export const items: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "（なし）" },
    { id: 1, name: "ひのきのぼう", equip: 7, type: "weapon" },
    { id: 2, name: "せいなるナイフ", equip: 7, type: "weapon" },
    { id: 3, name: "まどうしのつえ", equip: 7, type: "weapon" },
    { id: 4, name: "いかずちのつえ", equip: 7, type: "weapon" },
    { id: 5, name: "こんぼう", equip: 3, type: "weapon" },
    { id: 6, name: "どうのつるぎ", equip: 3, type: "weapon" },
    { id: 7, name: "くさりがま", equip: 3, type: "weapon" },
    { id: 8, name: "てつのやり", equip: 3, type: "weapon" },
    { id: 9, name: "はやぶさのけん", equip: 3, type: "weapon" },
    { id: 10, name: "はがねのつるぎ", equip: 1, type: "weapon" },
    { id: 11, name: "おおかなずち", equip: 1, type: "weapon" },
    { id: 12, name: "はかいのつるぎ", equip: 1, type: "weapon" },
    { id: 13, name: "ドラゴンキラー", equip: 1, type: "weapon" },
    { id: 14, name: "ひかりのつるぎ", equip: 1, type: "weapon" },
    { id: 15, name: "ロトのつるぎ", equip: 1, type: "weapon" },
    { id: 16, name: "いなずまのけん", equip: 1, type: "weapon" },
    { id: 17, name: "ぬののふく", equip: 7, type: "armor" },
    { id: 18, name: "みかわしのふく", equip: 7, type: "armor" },
    { id: 19, name: "みずのはごろも", equip: 7, type: "armor" },
    { id: 20, name: "ミンクのコート", equip: 7, type: "armor" },
    { id: 21, name: "かわのよろい", equip: 3, type: "armor" },
    { id: 22, name: "くさりかたびら", equip: 3, type: "armor" },
    { id: 23, name: "あくまのよろい", equip: 3, type: "armor" },
    { id: 24, name: "まほうのよろい", equip: 3, type: "armor" },
    { id: 25, name: "はがねのよろい", equip: 1, type: "armor" },
    { id: 26, name: "ガイアのよろい", equip: 1, type: "armor" },
    { id: 27, name: "ロトのよろい", equip: 1, type: "armor" },
    { id: 28, name: "かわのたて", equip: 3, type: "shield" },
    { id: 29, name: "ちからのたて", equip: 3, type: "shield" },
    { id: 30, name: "はがねのたて", equip: 1, type: "shield" },
    { id: 31, name: "しにがみのたて", equip: 1, type: "shield" },
    { id: 32, name: "ロトのたて", equip: 1, type: "shield" },
    { id: 33, name: "ふしぎなぼうし", equip: 7, type: "helmet" },
    { id: 34, name: "てつかぶと", equip: 1, type: "helmet" },
    { id: 35, name: "ロトのかぶと", equip: 1, type: "helmet" },
    { id: 36, name: "ロトのしるし" },
    { id: 37, name: "ふねのざいほう" },
    { id: 38, name: "つきのかけら" },
    { id: 39, name: "ルビスのまもり" },
    { id: 40, name: "じゃしんのぞう" },
    { id: 41, name: "せかいじゅのは" },
    { id: 42, name: "やまびこのふえ" },
    { id: 43, name: "ラーのかがみ" },
    { id: 44, name: "あまつゆのいと" },
    { id: 45, name: "せいなりおりき" },
    { id: 46, name: "かぜのマント", equip: 7 },
    { id: 47, name: "あくまのしっぽ", equip: 7 },
    { id: 48, name: "まよけのすず", equip: 7 },
    { id: 49, name: "ふっかつのたま" },
    { id: 50, name: "ゴールドカード" },
    { id: 51, name: "ふくびきけん" },
    { id: 52, name: "せいすい" },
    { id: 53, name: "キメラのつばさ" },
    { id: 54, name: "（みみせん / 使用不可）", illegal: true },
    { id: 55, name: "きんのかぎ" },
    { id: 56, name: "ぎんのかぎ" },
    { id: 57, name: "ろうやのかぎ" },
    { id: 58, name: "すいもんのかぎ" },
    { id: 59, name: "どくけしそう" },
    { id: 60, name: "やくそう" },
    { id: 61, name: "いのりのゆびわ" },
    { id: 62, name: "（しのオルゴール / 使用不可）", illegal: true },
    { id: 63, name: "（あぶないみずぎ / MSX 専用）", equip: 4, type: "armor", illegal: true },
];

/** 復活の場所の一覧 */
export const towns: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "ローレシア" },
    { id: 1, name: "サマルトリア" },
    { id: 2, name: "ラダトーム" },
    { id: 3, name: "デルコンダル" },
    { id: 4, name: "ベラヌール" },
    { id: 5, name: "ロンダルキア" },
    { id: 6, name: "ムーンペタ" },
    { id: 7, name: "（不正な場所）", illegal: true },
];

export const flagMoonLabels: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "何もしていない" },
    { id: 1, name: "月のかけらを使った" },
];

export const flagGateLabels: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "何もしていない" },
    { id: 1, name: "水門を開けた" },
];

export const flagPlumageLabels: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "まだ織ってもらっていない" },
    { id: 1, name: "織ってもらった" },
];

export const statShipLabels: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "何もしていない" },
    { id: 1, name: "女の子を助けた" },
    { id: 2, name: "船をもらった" },
    { id: 3, name: "（不正な状態）", illegal: true },
];

export const statPrinceLabels: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "見つけていない" },
    { id: 1, name: "探して、王様にあった" },
    { id: 2, name: "探して、勇者の泉に行った" },
    { id: 3, name: "見つけた" },
];

export const crestLabels: ReadonlyArray<LabelInfo> = [
    { id: 0, name: "未入手" },
    { id: 1, name: "入手済" },
];


/** 復活の呪文の素 */
export interface Dq2PasswordInfo {
    /** 名前(4文字) */
    ro_name: string;
    /** アイテム(0～8) 下位 6 bit = アイテム番号, 7 bit 目 = 装備 */
    ro_item: number[];
    /** 経験値(0～1,000,000) */
    ro_exp: number;

    /** サマルトリアの王子 */
    sa_flag: boolean;
    /** アイテム(0～8) 下位 6 bit = アイテム番号, 7 bit 目 = 装備 */
    sa_item: number[];
    /** 経験値(0～1,000,000) */
    sa_exp: number;

    /** ムーンブルクの王女 */
    mu_flag: boolean;
    /** アイテム(0～8) 下位 6 bit = アイテム番号, 7 bit 目 = 装備 */
    mu_item: number[];
    /** 経験値(0～1,000,000) */
    mu_exp: number;

    /** 所持金(0-65535) */
    gold: number;
    /** 復活の場所 */
    town: number;

    /** 洞窟の浅瀬で月のかけらを false:使ってない, true:使った */
    flag_moon: boolean;
    /** テパの村の水門を false:開いていない, true:開いた */
    flag_gate: boolean;
    /** 「みずのはごろも」を false:織ってもらっていない, true:織ってもらった */
    flag_plumage: boolean;
    /** ルプガナの街で 0:何もしていない, 1:女の子を助けた, 2:船をもらった */
    stat_ship: number;
    /** サマルトリアの王子を 0:見つけていない, 1:探して、王様にあった, 2:探して、勇者の泉に行った, 3:見つけた */
    stat_prince: number;

    /** 命の紋章 */
    crest_life: boolean;
    /** 水の紋章 */
    crest_water: boolean;
    /** 月の紋章 */
    crest_moon: boolean;
    /** 星の紋章 */
    crest_star: boolean;
    /** 太陽の紋章 */
    crest_sun: boolean;

    /** 暗号化のキー(0-7) */
    cryptKey: number;
    /** チェックコード */
    checkCode: number;
    /** 解析成功の場合に真 */
    valid: boolean;
}

/** 復活の呪文 */
export class Dq2Password {

    /**
     * 名前を文字列に変換.
     * @param nameNums 数字配列の名前
     * @return 名前
     */
    toStringName(nameNums: number[]): string {
        return nameNums
            .filter(num => 0 <= num && num < NAME_ALPHABET.length)
            .map(num => NAME_ALPHABET.charAt(num))
            .join('');
    }

    /**
     * 名前を数値配列に変換.
     * @param name 名前
     * @return 数値配列
     */
    toNumberName(name: string): number[] {
        const nameNums = name.split('')
            .map(ch => HANKAKU_TO_ZENKAKU[ch] || ch)
            .map(ch => NAME_ALIAS[ch] || ch)
            .flatMap(ch => ch.split(''))
            .map(ch => NAME_ALPHABET.indexOf(ch))
            .filter(num => num !== -1);

        while (nameNums.length < NAME_LENGTH) {
            nameNums.push(62); // スペース
        }

        return nameNums.length === NAME_LENGTH
            ? nameNums
            : nameNums.slice(0, NAME_LENGTH);
    }

    /**
     * 数値配列を復活の呪文に変換.
     * @param passwordNums 復活の呪文(数値配列)
     * @return 復活の呪文
     */
    toStringPassword(passwordNums: number[]): string {
        return passwordNums
            .filter(num => 0 <= num && num < JUMON_ALPHABET.length)
            .map(num => JUMON_ALPHABET.charAt(num))
            .join('');
    }

    /**
     * 復活の呪文を数値配列に変換.
     * @param password 復活の呪文
     * @return 数値配列
     */
    toNumberPassword(password: string): number[] {
        return password.split('')
            .map(ch => JUMON_ALPHABET.indexOf(ch))
            .filter(num => num !== -1);
    }

    /**
     * 呪文を正規化する.
     * @param password 復活の呪文
     * @return 正規化した復活の呪文
     */
    toNormalizePassword(password: string): string {
        return password.split('')
            .map(ch => HANKAKU_TO_ZENKAKU[ch] || ch)
            .map(ch => JUMON_ALIAS[ch] || ch)
            .filter(ch => ch === "？" || ch === '＊' || JUMON_ALPHABET.includes(ch))
            .join('');
    }

    /**
     * 呪文に使えない文字を返す
     * @param password 復活の呪文
     * @return 呪文に使えない文字
     */
    invalidCharsInPassword(password: string): string {
        const invalidChars = password.replaceAll(/\s/g, '').split('')
            .map(ch => HANKAKU_TO_ZENKAKU[ch] || ch)
            .map(ch => JUMON_ALIAS[ch] || ch)
            .filter(ch => ch !== "？" && ch !== '＊' && !JUMON_ALPHABET.includes(ch));
        return Array.from(new Set(invalidChars)).join('');
    }

    /** CRC を計算する */
    private calcuteCrc(code: BitArray): number {
        let crc = code.len * 0x0101;
        for (let i = code.len - 1; i >= 0; i--) {
            let octed = code.bytes[i];
            for (let j = 0; j < 8; j++) {
                const carryBit = (((crc >> 8) ^ octed) & 0x80) !== 0;
                crc = (crc << 1) & 0xffff;
                octed = (octed << 1) & 0xff;
                if (carryBit) {
                    crc ^= 0x1021;
                }
            }
        }
        return crc & 0x07ff;
    }

    /**
     * DQ2 復活の呪文作成.
     * @param info 復活の呪文の素
     * @return 復活の呪文
     */
    createPassword(info: Dq2PasswordInfo): string {

        const ro_name = this.toNumberName(info.ro_name);
        const code = new BitArray();

        // 復活の場所 (CRC は後で入れる)
        code.appendBits(info.town & 0x07, 8);

        // ローレシアの王子の名前と所持金
        code.appendBits((
            ((ro_name[2] & 0x3f) << 2) |
            ((ro_name[1] & 0x30) >> 4)
        ), 8);
        code.appendBits((info.gold >> 8) & 0xff, 8);
        code.appendBits((
            ((ro_name[1] & 0x06) << 5) |
            (ro_name[0] & 0x3f)
        ), 8);
        code.appendBits(info.gold & 0xff, 8);
        code.appendBits((
            ((ro_name[1] & 0x01) << 7) |
            ((ro_name[3] & 0x3f) << 1) |
            ((ro_name[1] & 0x08) >> 3)
        ), 8);
        // 暗号化キーと各種フラグ
        code.appendBits((
            ((info.cryptKey) << 7) |
            ((info.flag_moon ? 1 : 0) << 6) |
            ((info.flag_gate ? 1 : 0) << 5) |
            ((info.flag_plumage ? 1 : 0) << 4) |
            ((info.stat_ship & 0x03) << 2) |
            (info.stat_prince & 0x03)
        ), 8);
        // 暗号化キーと紋章
        code.appendBits((
            ((info.cryptKey & 0x0e) << 4) |
            ((info.crest_life) ? 0x10 : 0) |
            ((info.crest_water) ? 0x08 : 0) |
            ((info.crest_moon) ? 0x04 : 0) |
            ((info.crest_star) ? 0x02 : 0) |
            ((info.crest_sun) ? 0x01 : 0)
        ), 8);
        // CRC 他(後で入れる)
        code.appendBits(0, 8);

        // ローレシアの王子の経験値
        code.appendBits(info.ro_exp, 16);
        code.appendBits(info.ro_exp >> 16, 4);

        // ローレシアの王子のアイテム
        const ro_items = [...info.ro_item];
        while (ro_items[ro_items.length-1] === 0) {
            ro_items.pop();
        }
        code.appendBits(ro_items.length, 4);
        for (const item of ro_items) {
            code.appendBits(item, 7);
        }

        // サマルトリアの王子が仲間になっているか？
        code.appendBits(info.sa_flag ? 1 : 0, 1);
        if (info.sa_flag) {

            // サマルトリアの王子の経験値
            code.appendBits(info.sa_exp, 16);
            code.appendBits(info.sa_exp >> 16, 4);

            // サマルトリアの王子のアイテム
            const sa_items = [...info.sa_item];
            while (sa_items[sa_items.length-1] === 0) {
                sa_items.pop();
            }
                code.appendBits(sa_items.length, 4);
            for (const item of sa_items) {
                code.appendBits(item, 7);
            }

            // ムーンブルクの王女が仲間になっているか？
            code.appendBits(info.mu_flag ? 1 : 0, 1);
            if (info.mu_flag) {
                // ムーンブルクの王女の経験値
                code.appendBits(info.mu_exp, 16);
                code.appendBits(info.mu_exp >> 16, 4);

                // ムーンブルクの王女のアイテム
                const mu_items = [...info.mu_item];
                while (mu_items[mu_items.length-1] === 0) {
                    mu_items.pop();
                }
                code.appendBits(mu_items.length, 4);
                for (const item of mu_items) {
                    code.appendBits(item, 7);
                }
            }
        }

        if (code.bit !== 0) {
            // ビットが半端だった場合、byte 単位に切り上げる
            code.len++;
            code.bit = 0;
        }

        if (code.len === 40) {
            // 40 byte ある場合。最終バイトは 2bit までしかありえない。
            // 全員が 8 個づつアイテムを持っている時に、314 bit になる
            // 314 bit = 39 byte + 2 bit
            // その場合には、code[39] を、code[8] に格納する(上位 2 bit)
            code.bytes[8] = code.bytes[39];
            code.len--;
        }

        // 最小 97 bit (13 byte / 18 文字) ～ 最大 312 bit (39 byte / 52 文字)

        // チェックコード(CRC)を計算する
        const crc = this.calcuteCrc(code);
        code.bytes[0] |= (crc << 3) & 0xf8;
        code.bytes[8] |= (crc >> 5) & 0x3f;

        // バイト単位データを、文字(6 bit)単位に変換
        const codes: number[] = [];
        let data_len = 0;
        for (let i = 0; i < code.len; i++) {
            if (i % 3 === 0) {
                codes[data_len++] = (code.bytes[i] >> 2) & 0x3f;
                codes[data_len] = (code.bytes[i] << 4) & 0x30;
            } else if (i % 3 === 1) {
                codes[data_len++] |= (code.bytes[i] >> 4) & 0x0f;
                codes[data_len] = (code.bytes[i] << 2) & 0x3c;
            } else if (i % 3 === 2) {
                codes[data_len++] |= (code.bytes[i] >> 6) & 0x03;
                codes[data_len++] = code.bytes[i] & 0x3f;
            }
        }
        if (code.len % 3 !== 0) {
            data_len++;
        }

        // 暗号化
        const nShift = ((codes[0] & 0x06) >> 1) + 1;
        for (let i = 1; i < data_len; i++) {
            codes[i] = (codes[i] + codes[i - 1] + nShift) & 0x3f;
        }

        return this.toStringPassword(codes);
    }

    /**
     * DQ2 用復活の呪文を解析する
     *
     * @param password 復活の呪文
     * @return 解析結果
     */
    analyzePassword(password: string): Dq2PasswordInfo | undefined {
        const normalized = this.toNormalizePassword(password);
        const passwordNums = this.toNumberPassword(normalized);
        if (passwordNums.length < JUMON_MIN_LENGTH || JUMON_MAX_LENGTH < passwordNums.length) {
            return undefined;
        }

        // 復号
        const nShift = ((passwordNums[0] & 0x06) >> 1) + 1;
        for (let i = passwordNums.length - 1; 0 < i; i--) {
            passwordNums[i] = (passwordNums[i] - passwordNums[i - 1] - nShift) & 0x3f;
        }

        // 文字(6bit)単位を、バイト単位に変換
        const codes = new BitArray();
        passwordNums.forEach(it => codes.appendBits(it, 6));
        if (codes.bit !== 0) {
            codes.len++;
            codes.bit = 0;
        }

        const crc = ((codes.bytes[0] & 0xf8) >> 3) | ((codes.bytes[8] & 0x3f) << 5)
        codes.bytes[0] &= ~0xf8;
        codes.bytes[8] &= ~0x3f;

        if (codes.len === 39) {
            codes.bytes[39] = codes.bytes[8] & 0xc0;
            codes.len = 40;
        }

        let error = false;

        // 復活の場所
        const town = codes.bytes[0] & 0x07;

        let ro_name_code = [
            codes.bytes[3] & 0x3f,
            (
                ((codes.bytes[1] << 4) & 0x30)
                | ((codes.bytes[5] << 3) & 0x08)
                | ((codes.bytes[3] >> 5) & 0x06)
                | ((codes.bytes[5] >> 7) & 0x01)
            ),
            (codes.bytes[1] >> 2) & 0x3f,
            (codes.bytes[5] >> 1) & 0x3f,
        ];

        if (ro_name_code.indexOf(63) !== -1) {
            error = true;
            ro_name_code = ro_name_code.filter(it => it !== 63);
        }

        // ローレシアの王子の名前
        const ro_name = this.toStringName(ro_name_code);

        // 所持金
        const gold = (codes.bytes[2] << 8) | codes.bytes[4];

        // 暗号化キー
        const cryptKey = (
            ((codes.bytes[6] >> 7) & 0x01)
            | ((codes.bytes[7] >> 4) & 0x0e)
        );
        // 洞窟の浅瀬で月のかけらを false:使ってない, true:使った
        const flag_moon = ((codes.bytes[6] >> 6) & 0x01) !== 0;
        // テパの村の水門を false:開いていない, true:開いた
        const flag_gate = ((codes.bytes[6] >> 5) & 0x01) !== 0;
        // 「みずのはごろも」を false:縫ってもらっていない, true:縫ってもらった
        const flag_plumage = ((codes.bytes[6] >> 4) & 0x01) !== 0;
        // ルプガナの街で 0:何もしていない, 1:女の子を助けた, 2:船をもらった
        const stat_ship = (codes.bytes[6] >> 2) & 0x03;
        // サマルトリアの王子を 0:見つけていない, 1:探して、王様にあった, 2:探して、勇者の泉に行った, 3:見つけた
        const stat_prince = codes.bytes[6] & 0x03;

        // 命の紋章
        const crest_life = (codes.bytes[7] & 0x10) !== 0;
        // 水の紋章
        const crest_water = (codes.bytes[7] & 0x08) !== 0;
        // 月の紋章
        const crest_moon = (codes.bytes[7] & 0x04) !== 0;
        // 星の紋章
        const crest_star = (codes.bytes[7] & 0x02) !== 0;
        // 太陽の紋章
        const crest_sun = (codes.bytes[7] & 0x01) !== 0;

        const bitReader = new BitReader(codes);
        bitReader.len = 9;

        let ro_exp = bitReader.readBits(16)
        ro_exp |= bitReader.readBits(4) << 16
        let ro_item_len = bitReader.readBits(4);
        if (8 < ro_item_len) {
            error = true;
            ro_item_len = 8;
        }
        const ro_item = [...Array(ro_item_len)].map(_ => bitReader.readBits(7));

        const sa_flag = bitReader.readBits(1) !== 0;
        let sa_exp = 0;
        let sa_item_len = 0;
        let sa_item: number[] = [];
        let mu_flag = false;
        let mu_exp = 0;
        let mu_item_len = 0;
        let mu_item: number[] = [];

        if (sa_flag) {
            sa_exp = bitReader.readBits(16)
            sa_exp |= bitReader.readBits(4) << 16
            sa_item_len = bitReader.readBits(4);
            if (8 < sa_item_len) {
                error = true;
                sa_item_len = 8;
            }
            sa_item = [...Array(sa_item_len)].map(_ => bitReader.readBits(7));

            mu_flag = bitReader.readBits(1) !== 0;
            if (mu_flag) {
                mu_exp = bitReader.readBits(16)
                mu_exp |= bitReader.readBits(4) << 16
                mu_item_len = bitReader.readBits(4);
                if (8 < mu_item_len) {
                    error = true;
                    mu_item_len = 8;
                }
                mu_item = [...Array(mu_item_len)].map(_ => bitReader.readBits(7));
            }
        }

        // byte(8 bit 単位) ⇒ 文字(6 bit 単位) ⇒ byte(8 bit 単位)と変換すると
        // 端数で間延びすることがある。
        // そのため、解析で使用したデータ長から CRC を求める範囲を決める
        const bytesLen = bitReader.len + (bitReader.bit !== 0 ? 1 : 0);
        if (bytesLen === 40) {
            // 40 byte の場合、最後のバイトは 2 bit のみ使用するが、
            // その 2 bit は、bytes[8] に格納して 39 byte として扱う
            codes.len = 39;
        } else {
            codes.len = bytesLen;
        }
        // チェックコード(CRC)を計算する. 0 なら正常
        const checkCode = crc - this.calcuteCrc(codes);

        const info: Dq2PasswordInfo = {
            ro_name,
            ro_item,
            ro_exp,
            sa_flag,
            sa_item,
            sa_exp,

            mu_flag,
            mu_item,
            mu_exp,

            gold,
            town,

            flag_moon,
            flag_gate,
            flag_plumage,
            stat_ship,
            stat_prince,

            crest_life,
            crest_water,
            crest_moon,
            crest_star,
            crest_sun,

            cryptKey,
            checkCode,
            valid: false,
        };

        // 呪文が正しいかどうかをチェック
        const valid = this.checkInfo(info);
        info.valid = valid && !error;
        return info;
    }

    /** アイテム一覧に不正なアイテム、不正な装備がないことをチェック */
    private isValidItems(itemList: number[], mask: number): boolean {
        const equippedTypes: string[] = [];
        for (const item of itemList) {
            const itemInfo = items[item & 0x3f];
            if (itemInfo.illegal) {
                return false;
            }
            const equipped = (item & 0x40) !== 0;
            if (equipped && (!itemInfo.equip || (itemInfo.equip & mask) === 0)) {
                return false;
            }
            const equipType = itemInfo.type;
            if (equipped && equipType) {
                if (equippedTypes.includes(equipType)) {
                    // 同じタイプを二重に装備
                    return false;
                }
                equippedTypes.push(equipType);
            }
        }
        return true;
    }

    /** 呪文が正しいかどうかをチェック */
    checkInfo(info: Dq2PasswordInfo): boolean {
        if (info.checkCode !== 0) {
            // チェックコードがあっていない
            return false;
        }
        if (info.stat_ship === 3) {
            // ルプガナの街の船のステータス不正
            return false;
        }
        if (EXP_MAX_VALUE < info.ro_exp) {
            // 経験値の範囲が異常
            return false;
        }
        if (!this.isValidItems(info.ro_item, 1)) {
            // 不正なアイテム、不正な装備をしている
            return false;
        }
        if (info.town === 7) {
            // 復活の場所が不正
            return false;
        }
        if (info.sa_flag) {
            if (EXP_MAX_VALUE < info.sa_exp) {
                // 経験値の範囲が異常
                return false;
            }
            // 不正なアイテム、不正な装備をしている
            if (!this.isValidItems(info.sa_item, 2)) {
                return false;
            }
        }
        if (info.sa_flag && info.mu_flag) {
            if (EXP_MAX_VALUE < info.mu_exp) {
                // 経験値の範囲が異常
                return false;
            }
            // 不正なアイテム、不正な装備をしている
            if (!this.isValidItems(info.mu_item, 4)) {
                return false;
            }
        }
        return true;
    }

    /**
     * ハテナ付き呪文を元に、有効な呪文を作成する.
     *
     * @param password ハテナ付きパスワード
     * @return 有効なパスワードの配列
     */
    hatenaPassword(password: string): string[] {
        // ハテナを探す
        const position = password.indexOf("？");
        if (position === -1) {
            // ハテナが無い
            const info = this.analyzePassword(password);
            return (info && info.valid)
                ? [this.createPassword(info)]
                : [];
        } else {
            // ハテナがあった
            const passwords: string[] = [];
            for (var i = 0; i < JUMON_ALPHABET.length; i++) {
                // 先頭のハテナに呪文に使える文字を仮定して、再帰呼び出しする
                const newPassword = password.substring(0, position)
                    + JUMON_ALPHABET.charAt(i)
                    + password.substring(position + 1);
                const resolved = this.hatenaPassword(newPassword);
                Array.prototype.push.apply(passwords, resolved);
            }
            return passwords;
        }
    }

    /**
     * ハテナの数を数える.
     * @param password ハテナ付きパスワード（正規化済）
     * @return ハテナの数
     */
    countHatena(password: string): number {
        return password.split('').filter(ch => ch === '？').length;
    }

    /**
     * アスタリスクの数を数える.
     * @param password アスタリスク付きパスワード（正規化済）
     * @return アスタリスクの数
     */
    countAstarisk(password: string): number {
        return password.split('').filter(ch => ch === '＊').length;
    }

    /**
     * パスワードを編集する.
     *
     * ゆうて　いみや　おうきむ
     * こうほ　りいゆ　うじとり
     * やまあ　きらぺ　ぺぺぺぺ
     * ぺぺぺ　ぺぺぺ　ぺぺぺぺ
     * ぺぺぺ　ぺぺぺ　ぺぺぺぺ　ぺぺ
     *
     * @param pswd パスワード(18～52文字)
     * @return 編集後パスワード
     */
    editPassword(pswd: string): string {
        let rest = pswd;
        let output = "";
        for (let i = 0; i < 5; i++) {
            if (rest.length <= 3) {
                break;
            }
            output += rest.substring(0, 3) + "　";
            rest = rest.substring(3);
            if (rest.length <= 3) {
                break;
            }
            output += rest.substring(0, 3) + "　";
            rest = rest.substring(3);
            if (rest.length <= 4) {
                break;
            }
            output += rest.substring(0, 4) + (i === 4 ? "　" : "\n");
            rest = rest.substring(4);
        }
        output += rest;
        return output;
    }

    getPartyNames(ro_name: string): { sa_name: string, mu_name: string } {
        const sa_names = [
            "パウロ　", "ランド　", "カイン　", "アーサー",
            "コナン　", "クッキー", "トンヌラ", "すけさん",
        ];
        const mu_names = [
            "まいこ　", "リンダ　", "サマンサ", "アイリン",
            "マリア　", "ナナ　　", "あきな　", "プリン　",
        ];

        const ro_name_num = this.toNumberName(ro_name);
        let sum = 0;
        let i = 0;
        for (const num of ro_name_num) {
            if (10 <= num && num <= 31) {
                sum += num + 33;
            } else if (32 <= num && num <= 59) {
                sum += num - 31;
            } else if (60 <= num && num <= 61) {
                sum += num - 47;
            } else {
                break;
            }
        }
        if (i > 1) {
            sum--;
        }
        const sa_name = sa_names[((sum + 5) >> 3) & 0x07];
        const mu_name = mu_names[sum % 8];
        return { sa_name, mu_name };
    }

}
