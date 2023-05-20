import React, { useState, useEffect } from 'react';
import InputString from './parts/InputString';
import InputNumber from './parts/InputNumber';
import SelectItem from './parts/SelectItem';
import OutputLabel from './parts/OutputLabel';
import EquipmentItem from './parts/EquipmentItem';
import * as dq2pswd from './dq2pswd/dq2pswd';
import * as utils from './dq2utils';

interface Props {
    password: string;
    setPassword: (password: string) => void;
    moveAnalize: () => void;
}

const dq2 = new dq2pswd.Dq2Password();

const cryptItems: ReadonlyArray<dq2pswd.LabelInfo> = [
    { id: 0, name: "#0" },
    { id: 1, name: "#1" },
    { id: 2, name: "#2" },
    { id: 3, name: "#3" },
    { id: 4, name: "#4" },
    { id: 5, name: "#5" },
    { id: 6, name: "#6" },
    { id: 7, name: "#7" },
    { id: 8, name: "#8" },
    { id: 9, name: "#9" },
    { id: 10, name: "#10" },
    { id: 11, name: "#11" },
    { id: 12, name: "#12" },
    { id: 13, name: "#13" },
    { id: 14, name: "#14" },
    { id: 15, name: "#15" },
];

type ItemList = [
    number, number, number, number,
    number, number, number, number,
];

const toItemList = (items: number[]): ItemList => {
    return [...Array(8)].map((_, i) => (i < items.length) ? items[i] : 0) as ItemList;
}

export const partyLabels: ReadonlyArray<dq2pswd.LabelInfo> = [
    { id: 0, name: "まだ仲間になっていない" },
    { id: 1, name: "仲間になった" },
];

const Dq2Edit: React.FC<Props> = (props) => {
    const [show, setShow] = useState<boolean>(false);

    const [roName, setRoName] = useState<string>('');
    const [roItem, setRoItem] = useState<ItemList>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [roExp, setRoExp] = useState<number>(0);

    const [saFlag, setSaFlag] = useState<number>(0);
    const [saItem, setSaItem] = useState<ItemList>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [saExp, setSaExp] = useState<number>(0);

    const [muFlag, setMuFlag] = useState<number>(0);
    const [muItem, setMuItem] = useState<ItemList>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [muExp, setMuExp] = useState<number>(0);

    const [gold, setGold] = useState<number>(0);
    const [town, setTown] = useState<number>(0);

    const [flagMoon, setFlagMoon] = useState<number>(0);
    const [flagGate, setFlagGate] = useState<number>(0);
    const [flagPlumage, setFlagPlumage] = useState<number>(0);
    const [statShip, setStatShip] = useState<number>(0);
    const [statPrince, setStatPrince] = useState<number>(0);

    const [crestLife, setCrestLife] = useState<number>(0);
    const [crestWater, setCrestWater] = useState<number>(0);
    const [crestMoon, setCrestMoon] = useState<number>(0);
    const [crestStar, setCrestStar] = useState<number>(0);
    const [crestSun, setCrestSun] = useState<number>(0);

    const [crypt, setCrypt] = useState<number>(0);
    const [crc, setCrc] = useState<number>(0);

    /** App 側のパスワードを取り込む(新規/更新時) */
    useEffect(() => {
        if (!props.password) {
            return;
        }
        const info = dq2.analyzePassword(props.password);
        if (info) {
            setRoName(info.ro_name.replaceAll(/　+$/g, ''));
            setRoItem(toItemList(info.ro_item));
            setRoExp(info.ro_exp);

            setSaFlag(info.sa_flag ? 1 : 0);
            setSaItem(toItemList(info.sa_item));
            setSaExp(info.sa_exp);

            setMuFlag(info.mu_flag ? 1 : 0);
            setMuItem(toItemList(info.mu_item));
            setMuExp(info.mu_exp);

            setGold(info.gold);
            setTown(info.town);

            setFlagMoon(info.flag_moon ? 1 : 0);
            setFlagGate(info.flag_gate ? 1 : 0);
            setFlagPlumage(info.flag_plumage ? 1 : 0);
            setStatShip(info.stat_ship);
            setStatPrince(info.stat_prince);

            setCrestLife(info.crest_life ? 1 : 0);
            setCrestWater(info.crest_water ? 1 : 0);
            setCrestMoon(info.crest_moon ? 1 : 0);
            setCrestStar(info.crest_star ? 1 : 0);
            setCrestSun(info.crest_sun ? 1 : 0);

            setCrypt(info.cryptKey);
            setCrc(info.checkCode);
        }
    }, [props.password])

    /** 入力内容から復活の呪文を作成 */
    const createPassword = () => {
        const info: dq2pswd.Dq2PasswordInfo = {

            ro_name: roName,
            ro_item: [...roItem],
            ro_exp: roExp,

            sa_flag: saFlag !== 0,
            sa_item: [...saItem],
            sa_exp: saExp,

            mu_flag: muFlag !== 0,
            mu_item: [...muItem],
            mu_exp: muExp,

            gold,
            town,

            flag_moon: flagMoon !== 0,
            flag_gate: flagGate !== 0,
            flag_plumage: flagPlumage !== 0,
            stat_ship: statShip,
            stat_prince: statPrince,

            crest_life: crestLife !== 0,
            crest_water: crestWater !== 0,
            crest_moon: crestMoon !== 0,
            crest_star: crestStar !== 0,
            crest_sun: crestSun !== 0,

            cryptKey: crypt,
            checkCode: 0, // dummy
            valid: true, // dummy
        };
        return dq2.createPassword(info);
    }

    /** 復活の呪文を表示するためのモーダルダイアログ */
    const modalDialog = () => {
        const password = createPassword();
        const info = dq2.analyzePassword(password);
        if (!info) {
            return null;
        }

        // 表示用編集(全角スペースで幅調整している。注意)
        const passwordInDialogue = (
            <span>
                {
                    dq2.editPassword(password).split('\n').map((it, i) => (
                        <React.Fragment key={`pswd-${i}`}>
                            {it}<br />
                        </React.Fragment>
                    ))
                }
            </span>
        );

        // 王様のセリフ
        const dialogue = info.valid ? (
            <div>
                ＊「そなたに　ふっかつのじゅもんを<br />
                おしえよう！　　　　　　　　　<br />
                <br />
                <div className="passwd-block">
                    {passwordInDialogue}
                </div>
                <br />
                ＊「これを　かきとめておくのだぞ。 <br />
            </div>
        ) : (
            <div>
                <span className="error">じゅもんが　ちがいます</span><br />
                <br />
                <div className="passwd-block">
                    {passwordInDialogue}
                </div>
            </div>
        );

        return (
            <div id="overlay" onClick={() => setShow(false)}>
                <div className="frame" onClick={(e) => e.stopPropagation()}>
                    <h2>勇者「{info.ro_name}」</h2>
                    {dialogue}
                    <br />
                    <div className="button-area">
                        <span
                            className="button"
                            onClick={() => setShow(false)}
                        >【閉じる】</span>
                        <span
                            className="button"
                            onClick={() => {
                                utils.clipboardCopy(dq2.editPassword(password));
                            }}
                        >【コピー】</span>
                        <span
                            className={[
                                "button",
                                info.valid ? "" : "disable",
                            ].join(' ')}
                            onClick={() => {
                                utils.doTweet(info, password);
                            }}
                        >【ツイート】</span>
                    </div>
                </div>
            </div>
        );
    };

    const names = dq2.getPartyNames(roName);

    return (
        <div>
            <div className="frame">
                <h2>ローレシアの王子</h2>
                <InputString
                    label="なまえ"
                    value={roName}
                    setValue={setRoName}
                    placeholder="なまえをいれてください"
                />
                <div title="0～1,000,000 の範囲で入力してください">
                    <InputNumber label="ＥＸ" value={roExp} setValue={setRoExp} max={dq2pswd.EXP_MAX_VALUE} />
                </div>
                <div title="0～65,535 の範囲で入力してください">
                    <InputNumber label="Ｇ" value={gold} setValue={setGold} />
                </div>
                <br />
                <OutputLabel label="どうぐ" value="" />
                {
                    [...Array(8)].map((_, i) => (
                        <EquipmentItem
                            key={`ro_item_${i}`}
                            mask={1}
                            value={roItem[i]}
                            setValue={(value) => {
                                const items: ItemList = [...roItem];
                                items[i] = value;
                                setRoItem(items);
                            }}
                            items={dq2pswd.items}
                        />
                    ))
                }
            </div>
            <div className="frame">
                <h2>サマルトリアの王子</h2>
                <SelectItem label="" value={saFlag} setValue={setSaFlag} items={partyLabels} />
                <br />
                <OutputLabel label="なまえ" value={names.sa_name} />
                {saFlag !== 0 &&
                    <>
                        <div title="0～1,000,000 の範囲で入力してください">
                            <InputNumber label="ＥＸ" value={saExp} setValue={setSaExp} max={dq2pswd.EXP_MAX_VALUE} />
                        </div>
                        <br />
                        <OutputLabel label="どうぐ" value="" />
                        {
                            [...Array(8)].map((_, i) => (
                                <EquipmentItem
                                    key={`sa_item_${i}`}
                                    mask={2}
                                    value={saItem[i]}
                                    setValue={(value) => {
                                        const items: ItemList = [...saItem];
                                        items[i] = value;
                                        setSaItem(items);
                                    }}
                                    items={dq2pswd.items}
                                />
                            ))
                        }
                    </>
                }
            </div>
            <div className="frame">
                <h2>ムーンブルクの王女</h2>
                {saFlag !== 0 &&
                    <>
                        <SelectItem label="" value={muFlag} setValue={setMuFlag} items={partyLabels} />
                        <br />
                    </>
                }
                <OutputLabel label="なまえ" value={names.mu_name} />
                {saFlag !== 0 && muFlag !== 0 &&
                    <>
                        <div title="0～1,000,000 の範囲で入力してください">
                            <InputNumber label="ＥＸ" value={muExp} setValue={setMuExp} max={dq2pswd.EXP_MAX_VALUE} />
                        </div>
                        <br />
                        <OutputLabel label="どうぐ" value="" />
                        {
                            [...Array(8)].map((_, i) => (
                                <EquipmentItem
                                    key={`mu_item_${i}`}
                                    mask={4}
                                    value={muItem[i]}
                                    setValue={(value) => {
                                        const items: ItemList = [...muItem];
                                        items[i] = value;
                                        setMuItem(items);
                                    }}
                                    items={dq2pswd.items}
                                />
                            ))
                        }
                    </>
                }
            </div>
            <div className="frame">
                <h2>ストーリー</h2>
                <SelectItem label="洞窟の浅瀬で" value={flagMoon} setValue={setFlagMoon} items={dq2pswd.flagMoonLabels} />
                <SelectItem label="テパの村で" value={flagGate} setValue={setFlagGate} items={dq2pswd.flagGateLabels} />
                <SelectItem label="水のはごろもを" value={flagPlumage} setValue={setFlagPlumage} items={dq2pswd.flagPlumageLabels} />
                <SelectItem label="ルプガナの街で" value={statShip} setValue={setStatShip} items={dq2pswd.statShipLabels} />
                <SelectItem label="仲間の王子を" value={statPrince} setValue={setStatPrince} items={dq2pswd.statPrinceLabels} />
                <SelectItem label="復活の場所は" value={town} setValue={setTown} items={dq2pswd.towns} />
            </div>
            <div className="frame">
                <h2>紋章</h2>
                <SelectItem label="太陽" value={crestSun} setValue={setCrestSun} items={dq2pswd.crestLabels} />
                <SelectItem label="星" value={crestStar} setValue={setCrestStar} items={dq2pswd.crestLabels} />
                <SelectItem label="月" value={crestMoon} setValue={setCrestMoon} items={dq2pswd.crestLabels} />
                <SelectItem label="水" value={crestWater} setValue={setCrestWater} items={dq2pswd.crestLabels} />
                <SelectItem label="命" value={crestLife} setValue={setCrestLife} items={dq2pswd.crestLabels} />
            </div>
            <div className="frame">
                <h2>そのほか</h2>
                <SelectItem label="パターン" value={crypt} setValue={setCrypt} items={cryptItems} />
                <OutputLabel
                    label="チェックコード"
                    value={utils.toHex2(crc)}
                    error={crc !== 0}
                />
            </div>
            <div className="footer">
                <div className="button-area">
                    <span className="button" onClick={props.moveAnalize}>呪文を入力</span>
                    <span className="button" onClick={() => {
                        props.setPassword(createPassword());
                        setShow(true);
                    }}>呪文を確認</span>
                </div>
            </div>
            {show && modalDialog()}
        </div>
    );
}

export default Dq2Edit;
