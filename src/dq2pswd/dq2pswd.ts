/** DQ2用復活の呪文の解析/捏造 */
import { BitArray, BitReader } from './bitarray';
import * as utils from '../utils/dq2utils';

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
  '０１２３４５６７８９' +
  'あいうえお' +
  'かきくけこ' +
  'さしすせそ' +
  'たちつてと' +
  'なにぬねの' +
  'はひふへほ' +
  'まみむめも' +
  'やゆよ' +
  'らりるれろ' +
  'わをん' +
  'っゃゅょ' +
  '゛゜　'; // 全角スペース

/** 半角カナを全角かなに変換する読み替えデータ */
const HANKAKU_TO_ZENKAKU: Readonly<{ [key: string]: string }> = {
  '0': '０',
  '1': '１',
  '2': '２',
  '3': '３',
  '4': '４',
  '5': '５',
  '6': '６',
  '7': '７',
  '8': '８',
  '9': '９',
  ｦ: 'を',
  ｧ: 'ぁ',
  ｨ: 'ぃ',
  ｩ: 'ぅ',
  ｪ: 'ぇ',
  ｫ: 'ぉ',
  ｬ: 'ゃ',
  ｭ: 'ゅ',
  ｮ: 'ょ',
  ｯ: 'っ',
  ｰ: 'ー',
  ｱ: 'あ',
  ｲ: 'い',
  ｳ: 'う',
  ｴ: 'え',
  ｵ: 'お',
  ｶ: 'か',
  ｷ: 'き',
  ｸ: 'く',
  ｹ: 'け',
  ｺ: 'こ',
  ｻ: 'さ',
  ｼ: 'し',
  ｽ: 'す',
  ｾ: 'せ',
  ｿ: 'そ',
  ﾀ: 'た',
  ﾁ: 'ち',
  ﾂ: 'つ',
  ﾃ: 'て',
  ﾄ: 'と',
  ﾅ: 'な',
  ﾆ: 'に',
  ﾇ: 'ぬ',
  ﾈ: 'ね',
  ﾉ: 'の',
  ﾊ: 'は',
  ﾋ: 'ひ',
  ﾌ: 'ふ',
  ﾍ: 'へ',
  ﾎ: 'ほ',
  ﾏ: 'ま',
  ﾐ: 'み',
  ﾑ: 'む',
  ﾒ: 'め',
  ﾓ: 'も',
  ﾔ: 'や',
  ﾕ: 'ゆ',
  ﾖ: 'よ',
  ﾗ: 'ら',
  ﾘ: 'り',
  ﾙ: 'る',
  ﾚ: 'れ',
  ﾛ: 'ろ',
  ﾜ: 'わ',
  ﾝ: 'ん',
  ﾞ: '゛',
  ﾟ: '゜',
  ' ': '　',
};

/** 名前読み換えデータ */
const NAME_ALIAS: Readonly<{ [key: string]: string }> = {
  ぁ: 'あ',
  ぃ: 'い',
  ぅ: 'う',
  ぇ: 'え',
  ぉ: 'お',
  が: 'か゛',
  ぎ: 'き゛',
  ぐ: 'く゛',
  げ: 'け゛',
  ご: 'こ゛',
  ざ: 'さ゛',
  じ: 'し゛',
  ず: 'す゛',
  ぜ: 'せ゛',
  ぞ: 'そ゛',
  だ: 'た゛',
  ぢ: 'ち゛',
  づ: 'つ゛',
  で: 'て゛',
  ど: 'と゛',
  ば: 'は゛',
  び: 'ひ゛',
  ぶ: 'ふ゛',
  べ: 'へ゛',
  ぼ: 'ほ゛',
  ぱ: 'は゜',
  ぴ: 'ひ゜',
  ぷ: 'ふ゜',
  ぺ: 'へ゜',
  ぽ: 'ほ゜',
  ゐ: 'い',
  ゑ: 'え',
  '\u3094': 'う゛', // 「う」＋濁点
  '\u308e': 'わ', // 小さい「わ」
  '\u3095': 'か', // 小さい「か」
  '\u3096': 'け', // 小さい「け」
  ァ: 'あ',
  ィ: 'い',
  ゥ: 'う',
  ェ: 'え',
  ォ: 'お',
  ア: 'あ',
  イ: 'い',
  ウ: 'う',
  エ: 'え',
  オ: 'お',
  カ: 'か',
  キ: 'き',
  ク: 'く',
  ケ: 'け',
  コ: 'こ',
  サ: 'さ',
  シ: 'し',
  ス: 'す',
  セ: 'せ',
  ソ: 'そ',
  タ: 'た',
  チ: 'ち',
  ツ: 'つ',
  テ: 'て',
  ト: 'と',
  ナ: 'な',
  ニ: 'に',
  ヌ: 'ぬ',
  ネ: 'ね',
  ノ: 'の',
  ハ: 'は',
  ヒ: 'ひ',
  フ: 'ふ',
  ヘ: 'へ',
  ホ: 'ほ',
  マ: 'ま',
  ミ: 'み',
  ム: 'む',
  メ: 'め',
  モ: 'も',
  ヤ: 'や',
  ユ: 'ゆ',
  ヨ: 'よ',
  ラ: 'ら',
  リ: 'り',
  ル: 'る',
  レ: 'れ',
  ロ: 'ろ',
  ワ: 'わ',
  ヲ: 'を',
  ン: 'ん',
  ガ: 'か゛',
  ギ: 'き゛',
  グ: 'く゛',
  ゲ: 'け゛',
  ゴ: 'こ゛',
  ザ: 'さ゛',
  ジ: 'し゛',
  ズ: 'す゛',
  ゼ: 'せ゛',
  ゾ: 'そ゛',
  ダ: 'た゛',
  ヂ: 'ち゛',
  ヅ: 'つ゛',
  デ: 'て゛',
  ド: 'と゛',
  バ: 'は゛',
  ビ: 'ひ゛',
  ブ: 'ふ゛',
  ベ: 'へ゛',
  ボ: 'ほ゛',
  パ: 'は゜',
  ピ: 'ひ゜',
  プ: 'ふ゜',
  ペ: 'へ゜',
  ポ: 'ほ゜',
  ャ: 'ゃ',
  ュ: 'ゅ',
  ョ: 'ょ',
  ッ: 'っ',
  ヰ: 'い',
  ヱ: 'え',
  ヴ: 'う゛',
  '\u30ee': 'わ', // 小さい「ワ」
  '\u30f5': 'か', // 小さい「カ」
  '\u30f6': 'け', // 小さい「ケ」
  '\u30f7': 'わ゛', // 「ワ」＋濁点
  '\u30f8': 'い゛', // 「ヰ」＋濁点
  '\u30f9': 'え゛', // 「ヱ」＋濁点
  '\u30fa': 'を゛', // 「ヲ」＋濁点
  '\u3099': '\u309b', // 結合文字用濁点
  '\u309a': '\u309c', // 結合文字用半濁点
  // アイヌ語表音拡張（小さいカタカナ）
  '\u31f0': 'く',
  '\u31f1': 'し',
  '\u31f2': 'す',
  '\u31f3': 'と',
  '\u31f4': 'ぬ',
  '\u31f5': 'は',
  '\u31f6': 'ひ',
  '\u31f7': 'ふ',
  '\u31f8': 'へ',
  '\u31f9': 'ほ',
  '\u31fa': 'む',
  '\u31fb': 'ら',
  '\u31fc': 'り',
  '\u31fd': 'る',
  '\u31fe': 'れ',
  '\u31ff': 'ろ',
};

/** 復活の呪文用五十音 */
const JUMON_ALPHABET: Readonly<string> =
  'あいうえお' +
  'かきくけこ' +
  'さしすせそ' +
  'たちつてと' +
  'なにぬねの' +
  'はひふへほ' +
  'まみむめも' +
  'やゆよ' +
  'らりるれろ' +
  'わ' +
  'がぎぐげご' +
  'ざじずぜぞ' +
  'ばびぶべぼ' +
  'ぱぴぷぺぽ';

/** 復活の呪文読み換えデータ */
const JUMON_ALIAS: Readonly<{ [key: string]: string }> = {
  ぁ: 'あ',
  ぃ: 'い',
  ぅ: 'う',
  ぇ: 'え',
  ぉ: 'お',
  ゃ: 'や',
  ゅ: 'ゆ',
  ょ: 'よ',
  っ: 'つ',
  を: 'お',
  '?': '？',
  '*': '＊',
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
  type?: 'weapon' | 'armor' | 'shield' | 'helmet';
}

/** アイテム一覧. id でソートしているので添え字アクセスも可能 */
export const itemLabels: ReadonlyArray<LabelInfo> = [
  { id: 0, name: '（なし）' },
  { id: 1, name: 'ひのきのぼう', equip: 7, type: 'weapon' },
  { id: 2, name: 'せいなるナイフ', equip: 7, type: 'weapon' },
  { id: 3, name: 'まどうしのつえ', equip: 7, type: 'weapon' },
  { id: 4, name: 'いかずちのつえ', equip: 7, type: 'weapon' },
  { id: 5, name: 'こんぼう', equip: 3, type: 'weapon' },
  { id: 6, name: 'どうのつるぎ', equip: 3, type: 'weapon' },
  { id: 7, name: 'くさりがま', equip: 3, type: 'weapon' },
  { id: 8, name: 'てつのやり', equip: 3, type: 'weapon' },
  { id: 9, name: 'はやぶさのけん', equip: 3, type: 'weapon' },
  { id: 10, name: 'はがねのつるぎ', equip: 1, type: 'weapon' },
  { id: 11, name: 'おおかなずち', equip: 1, type: 'weapon' },
  { id: 12, name: 'はかいのつるぎ', equip: 1, type: 'weapon' },
  { id: 13, name: 'ドラゴンキラー', equip: 1, type: 'weapon' },
  { id: 14, name: 'ひかりのつるぎ', equip: 1, type: 'weapon' },
  { id: 15, name: 'ロトのつるぎ', equip: 1, type: 'weapon' },
  { id: 16, name: 'いなずまのけん', equip: 1, type: 'weapon' },
  { id: 17, name: 'ぬののふく', equip: 7, type: 'armor' },
  { id: 18, name: 'みかわしのふく', equip: 7, type: 'armor' },
  { id: 19, name: 'みずのはごろも', equip: 7, type: 'armor' },
  { id: 20, name: 'ミンクのコート', equip: 7, type: 'armor' },
  { id: 21, name: 'かわのよろい', equip: 3, type: 'armor' },
  { id: 22, name: 'くさりかたびら', equip: 3, type: 'armor' },
  { id: 23, name: 'あくまのよろい', equip: 3, type: 'armor' },
  { id: 24, name: 'まほうのよろい', equip: 3, type: 'armor' },
  { id: 25, name: 'はがねのよろい', equip: 1, type: 'armor' },
  { id: 26, name: 'ガイアのよろい', equip: 1, type: 'armor' },
  { id: 27, name: 'ロトのよろい', equip: 1, type: 'armor' },
  { id: 28, name: 'かわのたて', equip: 3, type: 'shield' },
  { id: 29, name: 'ちからのたて', equip: 3, type: 'shield' },
  { id: 30, name: 'はがねのたて', equip: 1, type: 'shield' },
  { id: 31, name: 'しにがみのたて', equip: 1, type: 'shield' },
  { id: 32, name: 'ロトのたて', equip: 1, type: 'shield' },
  { id: 33, name: 'ふしぎなぼうし', equip: 7, type: 'helmet' },
  { id: 34, name: 'てつかぶと', equip: 1, type: 'helmet' },
  { id: 35, name: 'ロトのかぶと', equip: 1, type: 'helmet' },
  { id: 36, name: 'ロトのしるし' },
  { id: 37, name: 'ふねのざいほう' },
  { id: 38, name: 'つきのかけら' },
  { id: 39, name: 'ルビスのまもり' },
  { id: 40, name: 'じゃしんのぞう' },
  { id: 41, name: 'せかいじゅのは' },
  { id: 42, name: 'やまびこのふえ' },
  { id: 43, name: 'ラーのかがみ' },
  { id: 44, name: 'あまつゆのいと' },
  { id: 45, name: 'せいなりおりき' },
  { id: 46, name: 'かぜのマント', equip: 7 },
  { id: 47, name: 'あくまのしっぽ', equip: 7 },
  { id: 48, name: 'まよけのすず', equip: 7 },
  { id: 49, name: 'ふっかつのたま' },
  { id: 50, name: 'ゴールドカード' },
  { id: 51, name: 'ふくびきけん' },
  { id: 52, name: 'せいすい' },
  { id: 53, name: 'キメラのつばさ' },
  { id: 54, name: '（みみせん / 使用不可）', illegal: true },
  { id: 55, name: 'きんのかぎ' },
  { id: 56, name: 'ぎんのかぎ' },
  { id: 57, name: 'ろうやのかぎ' },
  { id: 58, name: 'すいもんのかぎ' },
  { id: 59, name: 'どくけしそう' },
  { id: 60, name: 'やくそう' },
  { id: 61, name: 'いのりのゆびわ' },
  { id: 62, name: '（しのオルゴール / 使用不可）', illegal: true },
  { id: 63, name: '（あぶないみずぎ / MSX 専用）', equip: 4, type: 'armor', illegal: true },
];

/** 復活の場所の一覧 */
export const towns: ReadonlyArray<LabelInfo> = [
  { id: 0, name: 'ローレシア' },
  { id: 1, name: 'サマルトリア' },
  { id: 2, name: 'ラダトーム' },
  { id: 3, name: 'デルコンダル' },
  { id: 4, name: 'ベラヌール' },
  { id: 5, name: 'ロンダルキア' },
  { id: 6, name: 'ムーンペタ' },
  { id: 7, name: '（不正な場所）', illegal: true },
];

export const flagMoonLabels: ReadonlyArray<LabelInfo> = [
  { id: 0, name: '何もしていない' },
  { id: 1, name: '月のかけらを使った' },
];

export const flagGateLabels: ReadonlyArray<LabelInfo> = [
  { id: 0, name: '何もしていない' },
  { id: 1, name: '水門を開けた' },
];

export const flagPlumageLabels: ReadonlyArray<LabelInfo> = [
  { id: 0, name: 'まだ織ってもらっていない' },
  { id: 1, name: '織ってもらった' },
];

export const statShipLabels: ReadonlyArray<LabelInfo> = [
  { id: 0, name: '何もしていない' },
  { id: 1, name: '女の子を助けた' },
  { id: 2, name: '（船をもらった）' },
  { id: 3, name: '船をもらった' },
];

export const statPrinceLabels: ReadonlyArray<LabelInfo> = [
  { id: 0, name: '見つけていない' },
  { id: 1, name: '探して、王様にあった' },
  { id: 2, name: '探して、勇者の泉に行った' },
  { id: 3, name: '見つけた' },
];

export const crestLabels: ReadonlyArray<LabelInfo> = [
  { id: 0, name: '未入手' },
  { id: 1, name: '入手済' },
];

/** 復活の呪文の素 */
export interface Dq2PasswordInfo {
  /** 名前(4文字) */
  roName: string;
  /** アイテム(0～8) 下位 6 bit = アイテム番号, 7 bit 目 = 装備 */
  roItems: number[];
  /** 経験値(0～1,000,000) */
  roExp: number;

  /** サマルトリアの王子 */
  saFlag: boolean;
  /** アイテム(0～8) 下位 6 bit = アイテム番号, 7 bit 目 = 装備 */
  saItems: number[];
  /** 経験値(0～1,000,000) */
  saExp: number;

  /** ムーンブルクの王女 */
  muFlag: boolean;
  /** アイテム(0～8) 下位 6 bit = アイテム番号, 7 bit 目 = 装備 */
  muItems: number[];
  /** 経験値(0～1,000,000) */
  muExp: number;

  /** 所持金(0-65535) */
  gold: number;
  /** 復活の場所 */
  town: number;

  /** 洞窟の浅瀬で月のかけらを false:使ってない, true:使った */
  flagMoon: boolean;
  /** テパの村の水門を false:開いていない, true:開いた */
  flagGate: boolean;
  /** 「みずのはごろも」を false:織ってもらっていない, true:織ってもらった */
  flagPlumage: boolean;
  /** ルプガナの街で 0:何もしていない, 1:女の子を助けた, 3:船をもらった */
  statShip: number;
  /** サマルトリアの王子を 0:見つけていない, 1:探して、王様にあった, 2:探して、勇者の泉に行った, 3:見つけた */
  statPrince: number;

  /** 命の紋章 */
  crestLife: boolean;
  /** 水の紋章 */
  crestWater: boolean;
  /** 月の紋章 */
  crestMoon: boolean;
  /** 星の紋章 */
  crestStar: boolean;
  /** 太陽の紋章 */
  crestSun: boolean;

  /** 暗号化のキー(0-7) */
  cryptKey: number;
  /** チェックコード(11bit) */
  checkCode: number;
  /** 解析成功の場合に真 */
  valid: boolean;
}

/**
 * 名前を文字列に変換.
 * @param nameNums 数字配列の名前
 * @return 名前
 */
export const toStringName = (nameNums: number[]): string => {
  return nameNums
    .filter((num) => 0 <= num && num < NAME_ALPHABET.length)
    .map((num) => NAME_ALPHABET.charAt(num))
    .join('');
};

/**
 * 名前を数値配列に変換.
 * @param name 名前
 * @return 数値配列
 */
export const toNumberName = (name: string): number[] => {
  const nameNums = name
    .split('')
    .map((ch) => HANKAKU_TO_ZENKAKU[ch] || ch)
    .map((ch) => NAME_ALIAS[ch] || ch)
    .flatMap((ch) => ch.split(''))
    .map((ch) => NAME_ALPHABET.indexOf(ch))
    .filter((num) => num !== -1);

  while (nameNums.length < NAME_LENGTH) {
    nameNums.push(62); // スペース
  }

  return nameNums.length === NAME_LENGTH ? nameNums : nameNums.slice(0, NAME_LENGTH);
};

/**
 * 数値配列を復活の呪文に変換.
 * @param passwordNums 復活の呪文(数値配列)
 * @return 復活の呪文
 */
export const toStringPassword = (passwordNums: number[]): string => {
  return passwordNums
    .filter((num) => 0 <= num && num < JUMON_ALPHABET.length)
    .map((num) => JUMON_ALPHABET.charAt(num))
    .join('');
};

/**
 * 復活の呪文を数値配列に変換.
 * @param password 復活の呪文
 * @return 数値配列
 */
export const toNumberPassword = (password: string): number[] => {
  return password
    .split('')
    .map((ch) => JUMON_ALPHABET.indexOf(ch))
    .filter((num) => num !== -1);
};

/**
 * 呪文を正規化する.
 * @param password 復活の呪文
 * @return 正規化した復活の呪文
 */
export const toNormalizePassword = (password: string): string => {
  return password
    .split('')
    .map((ch) => HANKAKU_TO_ZENKAKU[ch] || ch)
    .map((ch) => JUMON_ALIAS[ch] || ch)
    .filter((ch) => ch === '？' || ch === '＊' || JUMON_ALPHABET.includes(ch))
    .join('');
};

/**
 * 呪文に使えない文字を返す
 * @param password 復活の呪文
 * @return 呪文に使えない文字
 */
export const invalidCharsInPassword = (password: string): string => {
  const invalidChars = password
    .replaceAll(/\s/g, '')
    .split('')
    .map((ch) => HANKAKU_TO_ZENKAKU[ch] || ch)
    .map((ch) => JUMON_ALIAS[ch] || ch)
    .filter((ch) => ch !== '？' && ch !== '＊' && !JUMON_ALPHABET.includes(ch));
  return Array.from(new Set(invalidChars)).join('');
};

/** CRC を計算する */
const calcuteCrc = (code: BitArray): number => {
  let crc = code.len * 0x0101;
  for (let i = code.len - 1; i >= 0; i--) {
    let octed = code.code[i];
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
};

/**
 * DQ2 復活の呪文作成.
 * @param info 復活の呪文の素
 * @return 復活の呪文
 */
export const createPassword = (info: Dq2PasswordInfo): string => {
  const roName = toNumberName(info.roName);
  const bytes = new BitArray();

  // 復活の場所 (CRC は後で入れる)
  bytes.appendBits(info.town & 0x07, 8);

  // ローレシアの王子の名前と所持金
  bytes.appendBits(((roName[2] & 0x3f) << 2) | ((roName[1] & 0x30) >> 4), 8);
  bytes.appendBits((info.gold >> 8) & 0xff, 8);
  bytes.appendBits(((roName[1] & 0x06) << 5) | (roName[0] & 0x3f), 8);
  bytes.appendBits(info.gold & 0xff, 8);
  bytes.appendBits(((roName[1] & 0x01) << 7) | ((roName[3] & 0x3f) << 1) | ((roName[1] & 0x08) >> 3), 8);
  // 暗号化キーと各種フラグ
  bytes.appendBits(
    (info.cryptKey << 7) |
      ((info.flagMoon ? 1 : 0) << 6) |
      ((info.flagGate ? 1 : 0) << 5) |
      ((info.flagPlumage ? 1 : 0) << 4) |
      ((info.statShip & 0x03) << 2) |
      (info.statPrince & 0x03),
    8
  );
  // 暗号化キーと紋章
  bytes.appendBits(
    ((info.cryptKey & 0x0e) << 4) |
      (info.crestLife ? 0x10 : 0) |
      (info.crestWater ? 0x08 : 0) |
      (info.crestMoon ? 0x04 : 0) |
      (info.crestStar ? 0x02 : 0) |
      (info.crestSun ? 0x01 : 0),
    8
  );
  // CRC 他(後で入れる)
  bytes.appendBits(0, 8);

  // ローレシアの王子の経験値
  bytes.appendBits(info.roExp, 16);
  bytes.appendBits(info.roExp >> 16, 4);

  // ローレシアの王子のアイテム
  const roItems = [...info.roItems];
  while (roItems[roItems.length - 1] === 0) {
    roItems.pop();
  }
  bytes.appendBits(roItems.length, 4);
  for (const item of roItems) {
    bytes.appendBits(item, 7);
  }

  // サマルトリアの王子が仲間になっているか？
  bytes.appendBits(info.saFlag ? 1 : 0, 1);
  if (info.saFlag) {
    // サマルトリアの王子の経験値
    bytes.appendBits(info.saExp, 16);
    bytes.appendBits(info.saExp >> 16, 4);

    // サマルトリアの王子のアイテム
    const saItems = [...info.saItems];
    while (saItems[saItems.length - 1] === 0) {
      saItems.pop();
    }
    bytes.appendBits(saItems.length, 4);
    for (const item of saItems) {
      bytes.appendBits(item, 7);
    }

    // ムーンブルクの王女が仲間になっているか？
    bytes.appendBits(info.muFlag ? 1 : 0, 1);
    if (info.muFlag) {
      // ムーンブルクの王女の経験値
      bytes.appendBits(info.muExp, 16);
      bytes.appendBits(info.muExp >> 16, 4);

      // ムーンブルクの王女のアイテム
      const muItems = [...info.muItems];
      while (muItems[muItems.length - 1] === 0) {
        muItems.pop();
      }
      bytes.appendBits(muItems.length, 4);
      for (const item of muItems) {
        bytes.appendBits(item, 7);
      }
    }
  }

  if (bytes.bit !== 0) {
    // ビットが半端だった場合、byte 単位に切り上げる
    bytes.len++;
    bytes.bit = 0;
  }

  if (bytes.len === 40) {
    // 40 byte ある場合。最終バイトは 2bit までしかありえない。
    // 全員が 8 個づつアイテムを持っている時に、314 bit になる
    // 314 bit = 39 byte + 2 bit
    // その場合には、code[39] を、code[8] に格納する(上位 2 bit)
    bytes.code[8] = bytes.code[39];
    bytes.len--;
  }

  // 最小 97 bit (13 byte / 18 文字) ～ 最大 312 bit (39 byte / 52 文字)

  // チェックコード(CRC)を計算する
  const crc = calcuteCrc(bytes);
  bytes.code[0] |= (crc << 3) & 0xf8;
  bytes.code[8] |= (crc >> 5) & 0x3f;

  // バイト単位データを、文字(6 bit)単位に変換
  const chars: number[] = [];
  let dataLen = 0;
  for (let i = 0; i < bytes.len; i++) {
    if (i % 3 === 0) {
      chars[dataLen++] = (bytes.code[i] >> 2) & 0x3f;
      chars[dataLen] = (bytes.code[i] << 4) & 0x30;
    } else if (i % 3 === 1) {
      chars[dataLen++] |= (bytes.code[i] >> 4) & 0x0f;
      chars[dataLen] = (bytes.code[i] << 2) & 0x3c;
    } else if (i % 3 === 2) {
      chars[dataLen++] |= (bytes.code[i] >> 6) & 0x03;
      chars[dataLen++] = bytes.code[i] & 0x3f;
    }
  }
  if (bytes.len % 3 !== 0) {
    dataLen++;
  }

  // 暗号化
  const nShift = ((chars[0] & 0x06) >> 1) + 1;
  for (let i = 1; i < dataLen; i++) {
    chars[i] = (chars[i] + chars[i - 1] + nShift) & 0x3f;
  }

  return toStringPassword(chars);
};

/**
 * DQ2 用復活の呪文を解析する
 *
 * @param password 復活の呪文
 * @return 解析結果
 */
export const analyzePassword = (password: string): Dq2PasswordInfo | undefined => {
  const normalized = toNormalizePassword(password);
  const passwordNums = toNumberPassword(normalized);
  if (passwordNums.length < JUMON_MIN_LENGTH || JUMON_MAX_LENGTH < passwordNums.length) {
    return undefined;
  }

  // 復号
  const nShift = ((passwordNums[0] & 0x06) >> 1) + 1;
  for (let i = passwordNums.length - 1; 0 < i; i--) {
    passwordNums[i] = (passwordNums[i] - passwordNums[i - 1] - nShift) & 0x3f;
  }

  // 文字(6bit)単位を、バイト単位に変換
  const bytes = new BitArray();
  passwordNums.forEach((it) => bytes.appendBits(it, 6));
  if (bytes.bit !== 0) {
    bytes.len++;
    bytes.bit = 0;
  }
  // バイト列の長さを補正
  bytes.len = Math.floor((passwordNums.length * 6) / 8);

  const crc = ((bytes.code[0] & 0xf8) >> 3) | ((bytes.code[8] & 0x3f) << 5);

  // チェックコード(CRC)を計算する. 0 なら正常
  bytes.code[0] &= ~0xf8;
  bytes.code[8] &= ~0x3f;
  const checkCode = (crc - calcuteCrc(bytes)) & 0x7ff;

  if (bytes.len === 39) {
    bytes.code[39] = bytes.code[8] & 0xc0;
    bytes.len = 40;
  }

  let hasError = false;

  // 復活の場所
  const town = bytes.code[0] & 0x07;

  let roNameNums = [
    bytes.code[3] & 0x3f,
    ((bytes.code[1] << 4) & 0x30) |
      ((bytes.code[5] << 3) & 0x08) |
      ((bytes.code[3] >> 5) & 0x06) |
      ((bytes.code[5] >> 7) & 0x01),
    (bytes.code[1] >> 2) & 0x3f,
    (bytes.code[5] >> 1) & 0x3f,
  ];

  if (roNameNums.indexOf(63) !== -1) {
    hasError = true;
    roNameNums = roNameNums.filter((it) => it !== 63);
  }

  // ローレシアの王子の名前
  const roName = toStringName(roNameNums);

  // 所持金
  const gold = (bytes.code[2] << 8) | bytes.code[4];

  // 暗号化キー
  const cryptKey = ((bytes.code[6] >> 7) & 0x01) | ((bytes.code[7] >> 4) & 0x0e);
  // 洞窟の浅瀬で月のかけらを false:使ってない, true:使った
  const flagMoon = ((bytes.code[6] >> 6) & 0x01) !== 0;
  // テパの村の水門を false:開いていない, true:開いた
  const flagGate = ((bytes.code[6] >> 5) & 0x01) !== 0;
  // 「みずのはごろも」を false:縫ってもらっていない, true:縫ってもらった
  const flagPlumage = ((bytes.code[6] >> 4) & 0x01) !== 0;
  // ルプガナの街で 0:何もしていない, 1:女の子を助けた, 2:船をもらった
  const statShip = (bytes.code[6] >> 2) & 0x03;
  // サマルトリアの王子を 0:見つけていない, 1:探して、王様にあった, 2:探して、勇者の泉に行った, 3:見つけた
  const statPrince = bytes.code[6] & 0x03;

  // 命の紋章
  const crestLife = (bytes.code[7] & 0x10) !== 0;
  // 水の紋章
  const crestWater = (bytes.code[7] & 0x08) !== 0;
  // 月の紋章
  const crestMoon = (bytes.code[7] & 0x04) !== 0;
  // 星の紋章
  const crestStar = (bytes.code[7] & 0x02) !== 0;
  // 太陽の紋章
  const crestSun = (bytes.code[7] & 0x01) !== 0;

  const bitReader = new BitReader(bytes);
  bitReader.len = 9;

  let roExp = bitReader.readBits(16);
  roExp |= bitReader.readBits(4) << 16;
  let roItemLen = bitReader.readBits(4);
  if (8 < roItemLen) {
    hasError = true;
    roItemLen = 8;
  }
  const roItems = utils.range(roItemLen).map(() => bitReader.readBits(7));

  const saFlag = bitReader.readBits(1) !== 0;
  let saExp = 0;
  let saItemLen = 0;
  let saItems: number[] = [];
  let muFlag = false;
  let muExp = 0;
  let muItemLen = 0;
  let muItems: number[] = [];

  if (saFlag) {
    saExp = bitReader.readBits(16);
    saExp |= bitReader.readBits(4) << 16;
    saItemLen = bitReader.readBits(4);
    if (8 < saItemLen) {
      hasError = true;
      saItemLen = 8;
    }
    saItems = utils.range(saItemLen).map(() => bitReader.readBits(7));

    muFlag = bitReader.readBits(1) !== 0;
    if (muFlag) {
      muExp = bitReader.readBits(16);
      muExp |= bitReader.readBits(4) << 16;
      muItemLen = bitReader.readBits(4);
      if (8 < muItemLen) {
        hasError = true;
        muItemLen = 8;
      }
      muItems = utils.range(muItemLen).map(() => bitReader.readBits(7));
    }
  }

  const info: Dq2PasswordInfo = {
    // ローレシアの王子
    roName,
    roItems,
    roExp,
    // サマルトリアの王子
    saFlag,
    saItems,
    saExp,
    // ムーンブルクの王女
    muFlag,
    muItems,
    muExp,
    // お金
    gold,
    // 復活の場所
    town,
    // 各種フラグ、ステート
    flagMoon,
    flagGate,
    flagPlumage,
    statShip,
    statPrince,
    // 紋章
    crestLife,
    crestWater,
    crestMoon,
    crestStar,
    crestSun,
    // その他
    cryptKey,
    checkCode,
    valid: false,
  };

  // 呪文が正しいかどうかをチェック
  const valid = checkInfo(info);
  info.valid = valid && !hasError;
  return info;
};

/** アイテム一覧に不正なアイテム、不正な装備がないことをチェック */
const isValidItems = (items: number[], mask: number): boolean => {
  const equippedTypes: string[] = [];
  for (const item of items) {
    const itemInfo = itemLabels[item & 0x3f];
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
};

/** 呪文が正しいかどうかをチェック */
export const checkInfo = (info: Dq2PasswordInfo): boolean => {
  if (info.checkCode !== 0) {
    // チェックコードがあっていない
    return false;
  }
  if (EXP_MAX_VALUE < info.roExp) {
    // 経験値の範囲が異常
    return false;
  }
  if (!isValidItems(info.roItems, 1)) {
    // 不正なアイテム、不正な装備をしている
    return false;
  }
  if (info.town === 7) {
    // 復活の場所が不正
    return false;
  }
  if (info.saFlag) {
    if (EXP_MAX_VALUE < info.saExp) {
      // 経験値の範囲が異常
      return false;
    }
    // 不正なアイテム、不正な装備をしている
    if (!isValidItems(info.saItems, 2)) {
      return false;
    }
  }
  if (info.saFlag && info.muFlag) {
    if (EXP_MAX_VALUE < info.muExp) {
      // 経験値の範囲が異常
      return false;
    }
    // 不正なアイテム、不正な装備をしている
    if (!isValidItems(info.muItems, 4)) {
      return false;
    }
  }
  return true;
};

/**
 * ハテナ付き呪文を元に、有効な呪文を作成する.
 *
 * @param password ハテナ付きパスワード
 * @return 有効なパスワードの配列
 */
export const hatenaPassword = (password: string): string[] => {
  // ハテナを探す
  const position = password.indexOf('？');
  if (position === -1) {
    // ハテナが無い
    const info = analyzePassword(password);
    return info && info.valid ? [password] : [];
  } else {
    // ハテナがあった
    const passwords: string[] = [];
    for (let i = 0; i < JUMON_ALPHABET.length; i++) {
      // 先頭のハテナに呪文に使える文字を仮定して、再帰呼び出しする
      const newPassword = password.substring(0, position) + JUMON_ALPHABET.charAt(i) + password.substring(position + 1);
      const resolved = hatenaPassword(newPassword);
      Array.prototype.push.apply(passwords, resolved);
    }
    return passwords;
  }
};

/**
 * ハテナの数を数える.
 * @param password ハテナ付きパスワード（正規化済）
 * @return ハテナの数
 */
export const countHatena = (password: string): number => {
  return password.split('').filter((ch) => ch === '？').length;
};

/**
 * アスタリスクの数を数える.
 * @param password アスタリスク付きパスワード（正規化済）
 * @return アスタリスクの数
 */
export const countAstarisk = (password: string): number => {
  return password.split('').filter((ch) => ch === '＊').length;
};

/**
 * パスワードを空白で区切って編集する.
 *
 * ゆうて  いみや  おうきむ
 * こうほ  りいゆ  うじとり
 * やまあ  きらぺ  ぺぺぺぺ
 * ぺぺぺ  ぺぺぺ  ぺぺぺぺ
 * ぺぺぺ  ぺぺぺ  ぺぺぺぺ  ぺぺ
 *
 * @param pswd パスワード(18～52文字)
 * @return 編集後パスワード
 */
export const editPassword = (pswd: string): string => {
  let rest = pswd;
  let output = '';
  for (let i = 0; i < 5; i++) {
    if (rest.length <= 3) {
      break;
    }
    output += rest.substring(0, 3) + '　';
    rest = rest.substring(3);
    if (rest.length <= 3) {
      break;
    }
    output += rest.substring(0, 3) + '　';
    rest = rest.substring(3);
    if (rest.length <= 4) {
      break;
    }
    output += rest.substring(0, 4) + (i === 4 ? '　' : '\n');
    rest = rest.substring(4);
  }
  output += rest;
  return output;
};

/**
 * アスタリスク付き呪文を元に、有効な呪文を作成する.
 *
 * @param password アスタリスク付きパスワード
 * @return 有効なパスワードの配列
 */
export const astariskPassword = (password: string): string[] => {
  // アスタリスクを探す
  const position = password.indexOf('＊');
  if (position === -1) {
    // アスタリスクが無い
    return [];
  } else {
    // アスタリスクがあった. ※アスタリスクは1つだけの想定.
    const passwords: string[] = [];
    for (let i = 0; i < JUMON_ALPHABET.length; i++) {
      const length = password.length - 1;
      const repeatMin = Math.max(18 - length, 1);
      const repeatMax = 52 - length + 1;
      for (let len = repeatMin; len < repeatMax; len++) {
        // 先頭のアスタリスクに呪文に使える文字を仮定してチェックする
        const newPassword =
          password.substring(0, position) + JUMON_ALPHABET.charAt(i).repeat(len) + password.substring(position + 1);
        const info = analyzePassword(newPassword);
        if (info && info.valid) {
          passwords.push(newPassword);
        }
      }
    }
    return passwords;
  }
};

/** 仲間の名前を取得する.
 * @param roName ローレシアの王子の名前
 * @return サマルトリアの王子の名前とムーンブルクの王女の名前
 */
export const getPartyNames = (roName: string): { saName: string; muName: string } => {
  const saNames = ['パウロ　', 'ランド　', 'カイン　', 'アーサー', 'コナン　', 'クッキー', 'トンヌラ', 'すけさん'];
  const muNames = ['まいこ　', 'リンダ　', 'サマンサ', 'アイリン', 'マリア　', 'ナナ　　', 'あきな　', 'プリン　'];

  const roNameNums = toNumberName(roName);
  let sum = 0;
  let i = 0;
  for (const num of roNameNums) {
    if (10 <= num && num <= 31) {
      sum += num + 33;
    } else if (32 <= num && num <= 59) {
      sum += num - 31;
    } else if (60 <= num && num <= 61) {
      sum += num - 47;
    } else {
      break;
    }
    i++;
  }
  if (1 < i) {
    sum--;
  }
  const saName = saNames[((sum + 5) >> 3) & 0x07];
  const muName = muNames[sum % 8];
  return { saName, muName };
};
