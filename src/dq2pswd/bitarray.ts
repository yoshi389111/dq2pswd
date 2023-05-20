
export class BitReader {
    bytes: number[];
    len: number;
    bit: number;

    constructor(bitArray: BitArray) {
        this.bytes = Array.from(bitArray.bytes);
        this.len = 0;
        this.bit = 0;
    }

    public readBits(length: number): number {

        const mask = (1 << length) - 1;

        if (this.bit + length < 8) {
            // 今の byte で読み込める(余りあり)
            const value = (this.bytes[this.len] >> (8 - this.bit - length)) & mask;
            this.bit += length;
            return value;

        } else if (this.bit + length === 8) {
            // 今の byte で読み込める(ちょうど)
            const value = this.bytes[this.len++] & mask;
            this.bit = 0;
            return value;

        } else {
            // 今の byte だけでは足りない
            let value = this.bytes[this.len++] << (this.bit + length - 8);
            let restLength = this.bit + length - 8;
            this.bit = 0;
            while (8 <= restLength) {
                value |= (this.bytes[this.len++] & 0xff) << (restLength - 8);
                restLength -= 8;
            }
            if (0 < restLength) {
                value |= (this.bytes[this.len] & 0xff) >> (8 - restLength);
                this.bit = restLength;
            }
            return value & mask;
        }
    }
}

export class BitArray {
    bytes: number[];
    len: number;
    bit: number;

    constructor() {
        this.bytes = [];
        this.len = 0;
        this.bit = 0;
    }

    public appendBits(
        value: number,
        length: number,
    ) {
        if (0 < length && this.bit === 0) {
            this.bytes[this.len] = 0;
        }

        const bit = value & ((1 << length) - 1);

        if (this.bit + length < 8) {
            // 今の byte に書き込める(余裕あり)
            this.bytes[this.len] |= bit << (8 - this.bit - length);
            this.bit += length;

        } else if (this.bit + length === 8) {
            // 今の byte に書き込める(ちょうど)
            this.bytes[this.len++] |= bit;
            this.bit = 0;

        } else {
            // 今の byte では余裕がない
            this.bytes[this.len++] |= bit >> (this.bit + length - 8);

            let bit_temp = this.bit + length - 8;
            this.bit = 0;

            while (bit_temp >= 8) {
                this.bytes[(this.len)++] = (bit >> (bit_temp - 8)) & 0xff;
                bit_temp -= 8;
            }
            if (bit_temp > 0) {
                this.bytes[this.len] = (bit << (8 - bit_temp)) & 0xff;
                this.bit = bit_temp;
            }
        }
    }
}



