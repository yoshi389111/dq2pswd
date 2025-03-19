import { expect, it } from 'vitest';
import { BitArray, BitReader } from './bitarray';

it('BitArray and BitReader', () => {
  const bitArray = new BitArray();
  bitArray.appendBits(0x3, 4);
  bitArray.appendBits(0xa, 4);
  bitArray.appendBits(0x1f, 8);
  bitArray.appendBits(0x1, 2);
  bitArray.appendBits(0xace, 12);
  bitArray.appendBits(0x2, 2);
  const bitReader = new BitReader(bitArray);
  expect(bitReader.readBits(4)).toEqual(0x3);
  expect(bitReader.readBits(4)).toEqual(0xa);
  expect(bitReader.readBits(8)).toEqual(0x1f);
  expect(bitReader.readBits(2)).toEqual(0x1);
  expect(bitReader.readBits(12)).toEqual(0xace);
  expect(bitReader.readBits(2)).toEqual(0x2);
});
