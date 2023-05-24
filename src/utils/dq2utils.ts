/** 任意の文字列をクリップボードにコピー */
export const clipboardCopy = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};

/** 16進数2桁に編集(0xHH形式) */
export const toHex2 = (value: number) => {
  return '0x' + value.toString(16).toUpperCase().padStart(2, '0');
};

export const range = (count: number): number[] => {
  return [...Array<undefined>(count)].map((_, i) => i);
};
