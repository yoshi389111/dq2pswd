import * as dq2pswd from './dq2pswd/dq2pswd';

/** 任意の文字列をクリップボードにコピー */
export const clipboardCopy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    alert('コピーしました');
}

/** 復活の呪文をツイートする */
export const doTweet = (info: dq2pswd.Dq2PasswordInfo, password: string): void => {
    if (info.valid) {
        const dq2 = new dq2pswd.Dq2Password()
        const message = "勇者「" + info.roName + "」\n" +
            dq2.editPassword(password) + "\n" +
            "#復活の呪文 #dq2pswd\n";
        const url = "https://twitter.com/share?text=" + encodeURIComponent(message);
        window.open(url, "_blank");
    }
}

/** 16進数2桁に編集(0xHH形式) */
export const toHex2 = (value: number) => {
    return '0x' + (('0' + value.toString(16)).toUpperCase().substr(-2));
}

