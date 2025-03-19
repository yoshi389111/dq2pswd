import React from 'react';
import OutputLabel from './parts/OutputLabel';
import CrestButtons from './parts/CrestButtons';
import ButtonWithDialog from './parts/ButtonWithDialog';
import TweetButton from './parts/TweetButton';
import * as dq2 from './dq2pswd/dq2pswd';
import * as utils from './utils/dq2utils';

interface Props {
  password: string;
}

const Dq2Info: React.FC<Props> = (props) => {
  const info = dq2.analyzePassword(props.password);
  if (!info) {
    return null;
  }

  const names = dq2.getPartyNames(info.roName);

  return (
    <div>
      <div className='frame'>
        <h2>ローレシアの王子</h2>
        <OutputLabel label='なまえ' value={info.roName} />
        <OutputLabel label='ＥＸ' value={info.roExp.toString()} />
        <OutputLabel label='Ｇ' value={info.gold.toString()} />
        <br />
        {utils.range(8).map((i) => (
          <OutputLabel
            key={`ro-${i}`}
            label={i === 0 ? 'どうぐ' : ''}
            value={((info.roItems[i] & 0x40) !== 0 ? 'Ｅ ' : '　 ') + dq2.itemLabels[info.roItems[i] & 0x3f].name}
            error={!!dq2.itemLabels[info.roItems[i] & 0x3f].illegal}
          />
        ))}
        <div className='button-area'>
          <ButtonWithDialog
            buttonLabel='【コピー】'
            dialogLabel='Copied!'
            timeout={700}
            onClick={() => void utils.clipboardCopy(dq2.editPassword(props.password))}
          />
          <TweetButton info={info} />
        </div>
      </div>
      <div className='frame'>
        <h2>サマルトリアの王子</h2>
        <OutputLabel label='なまえ' value={names.saName} />
        {info.saFlag && (
          <>
            <OutputLabel label='ＥＸ' value={info.saExp.toString()} />
            <br />
            {utils.range(8).map((i) => (
              <OutputLabel
                key={`sa-${i}`}
                label={i === 0 ? 'どうぐ' : ''}
                value={((info.saItems[i] & 0x40) !== 0 ? 'Ｅ ' : '　 ') + dq2.itemLabels[info.saItems[i] & 0x3f].name}
                error={!!dq2.itemLabels[info.saItems[i] & 0x3f].illegal}
              />
            ))}
          </>
        )}
      </div>

      <div className='frame'>
        <h2>ムーンブルクの王女</h2>
        <OutputLabel label='なまえ' value={names.muName} />
        {info.muFlag && (
          <>
            <OutputLabel label='ＥＸ' value={info.muExp.toString()} />
            <br />
            {utils.range(8).map((i) => (
              <OutputLabel
                key={`mu-${i}`}
                label={i === 0 ? 'どうぐ' : ''}
                value={((info.muItems[i] & 0x40) !== 0 ? 'Ｅ ' : '　 ') + dq2.itemLabels[info.muItems[i] & 0x3f].name}
                error={!!dq2.itemLabels[info.muItems[i] & 0x3f].illegal}
              />
            ))}
          </>
        )}
      </div>
      <div className='frame'>
        <h2>ストーリー</h2>
        <OutputLabel label='洞窟の浅瀬で' value={dq2.flagMoonLabels[info.flagMoon ? 1 : 0].name} />
        <OutputLabel label='テパの村で' value={dq2.flagGateLabels[info.flagGate ? 1 : 0].name} />
        <OutputLabel label='水のはごろもを' value={dq2.flagPlumageLabels[info.flagPlumage ? 1 : 0].name} />
        <OutputLabel label='ルプガナの街で' value={dq2.statShipLabels[info.statShip].name} />
        <OutputLabel label='仲間の王子を' value={dq2.statPrinceLabels[info.statPrince].name} />
        <OutputLabel label='復活の場所は' value={dq2.towns[info.town].name} />
        <br />
        <CrestButtons
          sun={info.crestSun}
          star={info.crestStar}
          moon={info.crestMoon}
          water={info.crestWater}
          life={info.crestLife}
        />
      </div>
      <div className='frame'>
        <h2>そのほか</h2>
        <OutputLabel label='パターン' value={`#${info.cryptKey}`} />
        <OutputLabel label='チェックコード' value={utils.toHex2(info.checkCode)} error={info.checkCode !== 0} />
      </div>
    </div>
  );
};

export default Dq2Info;
