import React, { useState, useEffect } from 'react';
import InputString from './parts/InputString';
import InputNumber from './parts/InputNumber';
import SelectItem from './parts/SelectItem';
import OutputLabel from './parts/OutputLabel';
import EquipmentItem from './parts/EquipmentItem';
import CrestButtons from './parts/CrestButtons';
import ButtonWithDialog from './parts/ButtonWithDialog';
import TweetButton from './parts/TweetButton';
import * as dq2 from './dq2pswd/dq2pswd';
import * as utils from './utils/dq2utils';

interface Props {
  password: string;
  setPassword: (password: string) => void;
  moveAnalize: () => void;
}

// アイテムは 8 個固定
type ItemList = [number, number, number, number, number, number, number, number];

/** number[] を ItemList に変換 (空きは 0 を入れる) */
const toItemList = (items: number[]): ItemList => {
  return utils.range(8).map((i) => (i < items.length ? items[i] : 0)) as ItemList;
};

const partyLabels: ReadonlyArray<dq2.LabelInfo> = [
  { id: 0, name: 'まだ仲間になっていない' },
  { id: 1, name: '仲間になった' },
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

  const [crestLife, setCrestLife] = useState<boolean>(false);
  const [crestWater, setCrestWater] = useState<boolean>(false);
  const [crestMoon, setCrestMoon] = useState<boolean>(false);
  const [crestStar, setCrestStar] = useState<boolean>(false);
  const [crestSun, setCrestSun] = useState<boolean>(false);

  const [crypt, setCrypt] = useState<number>(0);
  const [crc, setCrc] = useState<number>(0);

  /** App 側のパスワードを取り込む(新規/更新時) */
  useEffect(() => {
    if (!props.password) {
      return;
    }
    const info = dq2.analyzePassword(props.password);
    if (info) {
      setRoName(info.roName.replaceAll(/\u3000+$/g, ''));
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

      setCrestLife(info.crestLife);
      setCrestWater(info.crestWater);
      setCrestMoon(info.crestMoon);
      setCrestStar(info.crestStar);
      setCrestSun(info.crestSun);

      setCrypt(info.cryptKey);
      setCrc(info.checkCode);
    }
  }, [props.password]);

  /** 入力内容から復活の呪文を作成 */
  const createPassword = () => {
    const info: dq2.Dq2PasswordInfo = {
      roName,
      roItems: [...roItems],
      roExp,

      saFlag: saFlag !== 0,
      saItems: [...saItems],
      saExp,

      muFlag: muFlag !== 0,
      muItems: [...muItems],
      muExp,

      gold,
      town,

      flagMoon: flagMoon !== 0,
      flagGate: flagGate !== 0,
      flagPlumage: flagPlumage !== 0,
      statShip,
      statPrince,

      crestLife,
      crestWater,
      crestMoon,
      crestStar,
      crestSun,

      cryptKey: crypt,
      checkCode: 0, // dummy
      valid: true, // dummy
    };
    return dq2.createPassword(info);
  };

  /** 復活の呪文を表示するためのモーダルダイアログ */
  const modalDialog = () => {
    const password = createPassword();
    const info = dq2.analyzePassword(password);
    if (!info) {
      return null;
    }

    return (
      <div id='overlay' onClick={() => setShow(false)}>
        <div className='frame' onClick={(e) => e.stopPropagation()}>
          <h2>勇者「{info.roName}」</h2>
          {info.valid ? (
            <div className='passwd-block'>
              {/* formatter が行頭の全角空白を削除することがある。注意 */}
              ＊「そなたに&#x3000;ふっかつのじゅもんを
              <br />
              &emsp;&emsp;おしえよう！
              <br />
              <br />
              {dq2
                .editPassword(password)
                .split('\n')
                .map((it, i) => (
                  <React.Fragment key={`pswd-${i}`}>
                    &emsp;&emsp;{it}
                    <br />
                  </React.Fragment>
                ))}
              <br />
              ＊「これを&#x3000;かきとめておくのだぞ。
              <br />
            </div>
          ) : (
            <div className='passwd-block'>
              <span className='error'>じゅもんが&#x3000;ちがいます</span>
              <br />
              <br />
              {dq2
                .editPassword(password)
                .split('\n')
                .map((it, i) => (
                  <React.Fragment key={`pswd-${i}`}>
                    {it}
                    <br />
                  </React.Fragment>
                ))}
            </div>
          )}
          <br />
          <div className='button-area'>
            <div className='button' onClick={() => setShow(false)}>
              【閉じる】
            </div>
            <ButtonWithDialog
              buttonLabel='【コピー】'
              dialogLabel='Copied!'
              timeout={700}
              onClick={() => void utils.clipboardCopy(dq2.editPassword(password))}
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
      <div className='frame'>
        <h2>ローレシアの王子</h2>
        <InputString label='なまえ' value={roName} setValue={setRoName} placeholder='なまえをいれてください' />
        <InputNumber
          label='ＥＸ'
          value={roExp}
          setValue={setRoExp}
          max={dq2.EXP_MAX_VALUE}
          title='0～1,000,000 の範囲で入力してください'
        />
        <InputNumber label='Ｇ' value={gold} setValue={setGold} title='0～65,535 の範囲で入力してください' />
        <br />
        <OutputLabel label='どうぐ' value='' />
        {utils.range(8).map((i) => (
          <EquipmentItem
            key={`ro_item_${i}`}
            mask={1}
            value={roItems[i]}
            setValue={(value) => {
              const items: ItemList = [...roItems];
              items[i] = value;
              setRoItems(items);
            }}
            items={dq2.itemLabels}
          />
        ))}
      </div>
      <div className='frame'>
        <h2>サマルトリアの王子</h2>
        <SelectItem label='' value={saFlag} setValue={setSaFlag} items={partyLabels} />
        <br />
        <OutputLabel label='なまえ' value={names.saName} />
        {saFlag !== 0 && (
          <>
            <InputNumber
              label='ＥＸ'
              value={saExp}
              setValue={setSaExp}
              max={dq2.EXP_MAX_VALUE}
              title='0～1,000,000 の範囲で入力してください'
            />
            <br />
            <OutputLabel label='どうぐ' value='' />
            {utils.range(8).map((i) => (
              <EquipmentItem
                key={`sa_item_${i}`}
                mask={2}
                value={saItems[i]}
                setValue={(value) => {
                  const items: ItemList = [...saItems];
                  items[i] = value;
                  setSaItems(items);
                }}
                items={dq2.itemLabels}
              />
            ))}
          </>
        )}
      </div>
      <div className='frame'>
        <h2>ムーンブルクの王女</h2>
        {saFlag !== 0 ? (
          <SelectItem label='' value={muFlag} setValue={setMuFlag} items={partyLabels} />
        ) : (
          <OutputLabel label='' value='まだ仲間になっていない' />
        )}
        <br />
        <OutputLabel label='なまえ' value={names.muName} />
        {saFlag !== 0 && muFlag !== 0 && (
          <>
            <InputNumber
              label='ＥＸ'
              value={muExp}
              setValue={setMuExp}
              max={dq2.EXP_MAX_VALUE}
              title='0～1,000,000 の範囲で入力してください'
            />
            <br />
            <OutputLabel label='どうぐ' value='' />
            {utils.range(8).map((i) => (
              <EquipmentItem
                key={`mu_item_${i}`}
                mask={4}
                value={muItems[i]}
                setValue={(value) => {
                  const items: ItemList = [...muItems];
                  items[i] = value;
                  setMuItems(items);
                }}
                items={dq2.itemLabels}
              />
            ))}
          </>
        )}
      </div>
      <div className='frame'>
        <h2>ストーリー</h2>
        <SelectItem label='洞窟の浅瀬で' value={flagMoon} setValue={setFlagMoon} items={dq2.flagMoonLabels} />
        <SelectItem label='テパの村で' value={flagGate} setValue={setFlagGate} items={dq2.flagGateLabels} />
        <SelectItem
          label='水のはごろもを'
          value={flagPlumage}
          setValue={setFlagPlumage}
          items={dq2.flagPlumageLabels}
        />
        <SelectItem label='ルプガナの街で' value={statShip} setValue={setStatShip} items={dq2.statShipLabels} />
        <SelectItem label='仲間の王子を' value={statPrince} setValue={setStatPrince} items={dq2.statPrinceLabels} />
        <SelectItem label='復活の場所は' value={town} setValue={setTown} items={dq2.towns} />
        <br />
        <CrestButtons
          sun={crestSun}
          star={crestStar}
          moon={crestMoon}
          water={crestWater}
          life={crestLife}
          setSun={setCrestSun}
          setStar={setCrestStar}
          setMoon={setCrestMoon}
          setWater={setCrestWater}
          setLife={setCrestLife}
        />
      </div>
      <div className='frame'>
        <h2>そのほか</h2>
        <InputNumber
          label='パターン'
          value={crypt}
          setValue={setCrypt}
          max={15}
          title='0～15 の範囲で入力してください'
        />
        <OutputLabel label='チェックコード' value={utils.toHex2(crc)} error={crc !== 0} />
      </div>
      <div className='footer'>
        <div className='button-area'>
          <span
            className='button'
            onClick={() => {
              props.setPassword(createPassword());
              props.moveAnalize();
            }}
          >
            呪文を入力
          </span>
          <span
            className='button'
            onClick={() => {
              props.setPassword(createPassword());
              setShow(true);
            }}
          >
            呪文を確認
          </span>
        </div>
      </div>
      {show && modalDialog()}
    </div>
  );
};

export default Dq2Edit;
