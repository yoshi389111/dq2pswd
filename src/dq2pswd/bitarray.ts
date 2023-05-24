export class BitReader {
  code: number[];
  len: number;
  bit: number;

  constructor(bitArray: BitArray) {
    this.code = Array.from(bitArray.code);
    this.len = 0;
    this.bit = 0;
  }

  public readBits(length: number): number {
    const mask = (1 << length) - 1;

    if (this.bit + length < 8) {
      // 今の byte で読み込める(余りあり)
      const value = (this.code[this.len] >> (8 - this.bit - length)) & mask;
      this.bit += length;
      return value;
    } else if (this.bit + length === 8) {
      // 今の byte で読み込める(ちょうど)
      const value = this.code[this.len++] & mask;
      this.bit = 0;
      return value;
    } else {
      // 今の byte だけでは足りない
      let value = this.code[this.len++] << (this.bit + length - 8);
      let restLength = this.bit + length - 8;
      this.bit = 0;
      while (8 <= restLength) {
        value |= (this.code[this.len++] & 0xff) << (restLength - 8);
        restLength -= 8;
      }
      if (0 < restLength) {
        value |= (this.code[this.len] & 0xff) >> (8 - restLength);
        this.bit = restLength;
      }
      return value & mask;
    }
  }
}

export class BitArray {
  code: number[];
  len: number;
  bit: number;

  constructor() {
    this.code = [];
    this.len = 0;
    this.bit = 0;
  }

  public appendBits(value: number, length: number) {
    if (0 < length && this.bit === 0) {
      this.code[this.len] = 0;
    }

    const bit = value & ((1 << length) - 1);

    if (this.bit + length < 8) {
      // 今の byte に書き込める(余裕あり)
      this.code[this.len] |= bit << (8 - this.bit - length);
      this.bit += length;
    } else if (this.bit + length === 8) {
      // 今の byte に書き込める(ちょうど)
      this.code[this.len++] |= bit;
      this.bit = 0;
    } else {
      // 今の byte では余裕がない
      this.code[this.len++] |= bit >> (this.bit + length - 8);

      let bitTemp = this.bit + length - 8;
      this.bit = 0;

      while (bitTemp >= 8) {
        this.code[this.len++] = (bit >> (bitTemp - 8)) & 0xff;
        bitTemp -= 8;
      }
      if (bitTemp > 0) {
        this.code[this.len] = (bit << (8 - bitTemp)) & 0xff;
        this.bit = bitTemp;
      }
    }
  }
}
