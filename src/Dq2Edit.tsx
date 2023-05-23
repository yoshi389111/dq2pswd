import React, { useState, useEffect } from 'react';
import InputString from './parts/InputString';
import InputNumber from './parts/InputNumber';
import SelectItem from './parts/SelectItem';
import OutputLabel from './parts/OutputLabel';
import EquipmentItem from './parts/EquipmentItem';
import ButtonWithDialog from './parts/ButtonWithDialog';
import TweetButton from './parts/TweetButton'
import * as dq2pswd from './dq2pswd/dq2pswd';
import * as utils from './dq2utils';

interface Props {
    password: string;
    setPassword: (password: string) => void;
    moveAnalize: () => void;
}

const dq2 = new dq2pswd.Dq2Password();

// アイテムは 8 個固定
type ItemList = [
    number, number, number, number,
    number, number, number, number,
];

/** number[] を ItemList に変換 (空きは 0 を入れる) */
const toItemList = (items: number[]): ItemList => {
    return [...Array(8)].map((_, i) => (i < items.length) ? items[i] : 0) as ItemList;
}

export const partyLabels: ReadonlyArray<dq2pswd.LabelInfo> = [
    { id: 0, name: "まだ仲間になっていない" },
    { id: 1, name: "仲間になった" },
];

const Dq2Edit: React.FC<Props> = (props) => {
    // モーダルダイアログの表示状態
    const [show, setShow] = useState<boolean>(false);

    const [roName, setRoName] = useState<string>('');
    const [roItems, setRoItems] = useState<ItemList>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [roExp, setRoExp] = useState<number>(0);

    const [saFlag, setSaFlag] = useState<number>(0);
    const [saItems, setSaItems] = useState<ItemList>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [saExp, setSaExp] = useState<number>(0);

    const [muFlag, setMuFlag] = useState<number>(0);
    const [muItems, setMuItems] = useState<ItemList>([0, 0, 0, 0, 0, 0, 0, 0]);
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
            setRoName(info.roName.replaceAll(/　+$/g, ''));
            setRoItems(toItemList(info.roItems));
            setRoExp(info.roExp);

            setSaFlag(info.saFlag ? 1 : 0);
            setSaItems(toItemList(info.saItems));
            setSaExp(info.saExp);

            setMuFlag(info.muFlag ? 1 : 0);
            setMuItems(toItemList(info.muItems));
            setMuExp(info.muExp);

            setGold(info.gold);
            setTown(info.town);

            setFlagMoon(info.flagMoon ? 1 : 0);
            setFlagGate(info.flagGate ? 1 : 0);
            setFlagPlumage(info.flagPlumage ? 1 : 0);
            setStatShip(info.statShip);
            setStatPrince(info.statPrince);

            setCrestLife(info.crestLife ? 1 : 0);
            setCrestWater(info.crestWater ? 1 : 0);
            setCrestMoon(info.crestMoon ? 1 : 0);
            setCrestStar(info.crestStar ? 1 : 0);
            setCrestSun(info.crestSun ? 1 : 0);

            setCrypt(info.cryptKey);
            setCrc(info.checkCode);
        }
    }, [props.password])

    /** 入力内容から復活の呪文を作成 */
    const createPassword = () => {
        const info: dq2pswd.Dq2PasswordInfo = {

            roName: roName,
            roItems: [...roItems],
            roExp: roExp,

            saFlag: saFlag !== 0,
            saItems: [...saItems],
            saExp: saExp,

            muFlag: muFlag !== 0,
            muItems: [...muItems],
            muExp: muExp,

            gold,
            town,

            flagMoon: flagMoon !== 0,
            flagGate: flagGate !== 0,
            flagPlumage: flagPlumage !== 0,
            statShip: statShip,
            statPrince: statPrince,

            crestLife: crestLife !== 0,
            crestWater: crestWater !== 0,
            crestMoon: crestMoon !== 0,
            crestStar: crestStar !== 0,
            crestSun: crestSun !== 0,

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

        // 表示用編集
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

        // 王様のセリフ(全角スペースで幅調整している。注意)
        const dialogue = info.valid ? (
            <div>
                ＊「そなたに　ふっかつのじゅもんを<br />
                おしえよう！　　　　　　　　　　<br />
                <br />
                <div className="passwd-block">
                    {passwordInDialogue}
                </div>
                <br />
                ＊「これを　かきとめておくのだぞ。<br />
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
                    <h2>勇者「{info.roName}」</h2>
                    {dialogue}
                    <br />
                    <div className="button-area">
                        <div
                            className="button"
                            onClick={() => setShow(false)}
                        >【閉じる】</div>
                        <ButtonWithDialog
                            buttonLabel='【コピー】'
                            dialogLabel='Copied!'
                            timeout={700}
                            onClick={() => utils.clipboardCopy(dq2.editPassword(password))}
                        />
                        <TweetButton info={info} />
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
                            value={roItems[i]}
                            setValue={(value) => {
                                const items: ItemList = [...roItems];
                                items[i] = value;
                                setRoItems(items);
                            }}
                            items={dq2pswd.itemLabels}
                        />
                    ))
                }
            </div>
            <div className="frame">
                <h2>サマルトリアの王子</h2>
                <SelectItem label="" value={saFlag} setValue={setSaFlag} items={partyLabels} />
                <br />
                <OutputLabel label="なまえ" value={names.saName} />
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
                                    value={saItems[i]}
                                    setValue={(value) => {
                                        const items: ItemList = [...saItems];
                                        items[i] = value;
                                        setSaItems(items);
                                    }}
                                    items={dq2pswd.itemLabels}
                                />
                            ))
                        }
                    </>
                }
            </div>
            <div className="frame">
                <h2>ムーンブルクの王女</h2>
                {saFlag !== 0 ? (
                    <SelectItem label="" value={muFlag} setValue={setMuFlag} items={partyLabels} />
                ) : (
                    <OutputLabel label="" value="まだ仲間になっていない" />
                )}
                <br />
                <OutputLabel label="なまえ" value={names.muName} />
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
                                    value={muItems[i]}
                                    setValue={(value) => {
                                        const items: ItemList = [...muItems];
                                        items[i] = value;
                                        setMuItems(items);
                                    }}
                                    items={dq2pswd.itemLabels}
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
                <div title="0～15 の範囲で入力してください">
                    <InputNumber label="パターン" value={crypt} setValue={setCrypt} max={15} />
                </div>
                <OutputLabel
                    label="チェックコード"
                    value={utils.toHex2(crc)}
                    error={crc !== 0}
                />
            </div>
            <div className="footer">
                <div className="button-area">
                    <span className="button" onClick={() => {
                        props.setPassword(createPassword());
                        props.moveAnalize();
                    }}>呪文を入力</span>
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
