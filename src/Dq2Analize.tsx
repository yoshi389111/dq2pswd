import React, { useState, useEffect } from 'react';
import * as dq2 from './dq2pswd/dq2pswd';
import Dq2Info from './Dq2Info'

interface Props {
    password: string;
    setPassword: (password: string) => void;
    moveEdit: () => void;
}

const Dq2Edit: React.FC<Props> = (props) => {
    // 入力中の呪文
    const [nowPassword, setNowPassword] = useState<string>('');
    // 詳細表示している呪文
    const [targetPassword, setTargetPassword] = useState<string>('');
    // 「？」に文字を割り当てた呪文リスト
    const [passwords, setPasswords] = useState<string[]>([]);

    const [validLength, setValidLength] = useState<boolean>(true);
    const [validHatena, setValidHatena] = useState<boolean>(true);
    const [emptyPasswords, setEmptyPasswords] = useState<boolean>(true);
    const [invalidChars, setInvalidChars] = useState<String>('');

    /** 呪文の形式が正しいかチェック */
    const canAnalyze = (password: string): boolean => {
        // フラグをクリア
        setValidLength(true);
        setValidHatena(true);

        setInvalidChars(dq2.invalidCharsInPassword(password));

        // 呪文を正規化
        const normalize = dq2.toNormalizePassword(password);
        if (normalize.length < 18 || 52 < normalize.length) {
            // 復活の呪文の長さが違う
            setValidLength(false);
            return false;
        }

        // 結果
        let valid = true;
        const count = dq2.countHatena(normalize);
        if (3 < count) {
            // ハテナが３個超過
            setValidHatena(false);
            valid = false;
        }
        // 「？」なしなら、エラーが出ても解析OK
        return count === 0 ? true : valid;
    };

    const analyze = async (password: string): Promise<void> => {
        if (!canAnalyze(password)) {
            setPasswords([]);
            setEmptyPasswords(false);
            setTargetPassword('');
            return;
        }

        const normalized = dq2.toNormalizePassword(password);
        const editPassword = dq2.editPassword(normalized);
        setNowPassword(editPassword);

        if (normalized.includes('？')) {
            // "？" が含まれる場合には、一覧表示
            setPasswords([]);
            setEmptyPasswords(false);
            setTargetPassword('');
            const list = dq2.hatenaPassword(normalized);
            setPasswords(list);
            setEmptyPasswords(list.length === 0);
        } else {
            // "？" が含まれない場合は、詳細表示
            setPasswords([]);
            setEmptyPasswords(false);
            setTargetPassword(normalized);
        }
    };

    // 初期表示
    useEffect(() => {
        if (props.password) {
            analyze(props.password);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.password])

    const errorMessage = (
        <div>
            <br />
            {!validLength && <div>ひらがな18～52文字で指定してね</div> }
            {!validHatena && <div>「？」は３つまでにしてね</div> }
            {emptyPasswords && <div>対象のふっかつのじゅもんがありません</div> }
            {invalidChars && <div>次の文字はつかえません「{ invalidChars }」</div> }
        </div>
    );

    const passwordList = passwords.length ? (
        <div className="frame">
            <br />
            {passwords.map((pswd, index) => (
                <div
                    className={[
                        "passwd-block",
                        "password-selection",
                    ].join(' ')}
                    key={`pw-${index}`}
                    onClick={() => {
                        props.setPassword(pswd.replaceAll(/[　\n]/g, ""));
                        window.scrollTo(0,0);
                    }}
                >
                    {dq2.editPassword(pswd).split("\n").map((it, i) => (
                        <React.Fragment key={`pswd-${i}`}>
                            {it}
                            <br />
                        </React.Fragment>
                    ))}
                    <br />
                </div>
            ))}
        </div>
    ) : (
        <div></div>
    );

    return (
        <div>
            <div className="frame">
                <h2>ふっかつのじゅもんを　いれてください</h2>
                <textarea
                    className="password-area"
                    cols={40}
                    rows={5}
                    value={nowPassword}
                    onChange={(e) => setNowPassword(e.target.value)}
                />
            </div>
            <div>※「？」は３つまで使えます。３つあると時間がかかります。</div>

            {errorMessage}

            {passwordList}

            {targetPassword && <Dq2Info password={targetPassword} />}

            <div className="footer">
                <div className="button-area">
                    <span
                        className="button"
                        onClick={() => {
                            props.setPassword(nowPassword);
                            props.moveEdit();
                        }
                        }
                    >項目を入力</span>
                    <span
                        className="button"
                        onClick={() => analyze(nowPassword)}
                    >呪文を確認</span>
                </div>
            </div>

        </div>
    );
}

export default Dq2Edit;
