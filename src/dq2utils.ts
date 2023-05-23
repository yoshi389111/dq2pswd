
/** 任意の文字列をクリップボードにコピー */
export const clipboardCopy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
}

/** 16進数2桁に編集(0xHH形式) */
export const toHex2 = (value: number) => {
    return '0x' + (('0' + value.toString(16)).toUpperCase().substr(-2));
}

