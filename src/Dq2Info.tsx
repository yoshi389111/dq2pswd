import React from 'react';
import OutputLabel from './parts/OutputLabel';
import * as dq2pswd from './dq2pswd/dq2pswd';
import * as utils from './dq2utils';

interface Props {
    password: string;
}

const Dq2Info: React.FC<Props> = (props) => {
    const dq2 = new dq2pswd.Dq2Password();
    const info = dq2.analyzePassword(props.password);
    if (!info) {
        return null;
    }

    const names = dq2.getPartyNames(info.ro_name);

    return (
        <div>
            <div className="frame">
                <h2>ローレシアの王子</h2>
                <OutputLabel label="なまえ" value={info.ro_name} />
                <OutputLabel label="ＥＸ" value={info.ro_exp.toString()} />
                <OutputLabel label="Ｇ" value={info.gold.toString()} />
                <br />
                {
                    [...Array(8)].map((_, i) => (
                        <OutputLabel
                            key={`ro-${i}`}
                            label={i === 0 ? "どうぐ" : ""}
                            value={
                                ((info.ro_item[i] & 0x40) !== 0 ? "Ｅ " : "　 ")
                                + dq2pswd.items[info.ro_item[i] & 0x3f].name
                            }
                            error={!!dq2pswd.items[info.ro_item[i] & 0x3f].illegal}
                        />
                    ))
                }
                <div className="button-area">
                    <span
                        className="button"
                        onClick={() => {
                            utils.clipboardCopy(dq2.editPassword(props.password));
                        }}
                    >【コピー】</span>
                    <span
                        className={[
                            "button",
                            info.valid ? "" : "disable",
                        ].join(' ')}
                        onClick={() => {
                            utils.doTweet(info, props.password);
                        }}
                    >【ツイート】</span>
                </div>
            </div>
            <div className="frame">
                <h2>サマルトリアの王子</h2>
                <OutputLabel label="なまえ" value={names.sa_name} />
                {info.sa_flag &&
                    <>
                        <OutputLabel label="ＥＸ" value={info.sa_exp.toString()} />
                        <br />
                        {
                            [...Array(8)].map((_, i) => (
                                <OutputLabel
                                    key={`sa-${i}`}
                                    label={i === 0 ? "どうぐ" : ""}
                                    value={
                                        ((info.sa_item[i] & 0x40) !== 0 ? "Ｅ " : "　 ")
                                        + dq2pswd.items[info.sa_item[i] & 0x3f].name
                                    }
                                    error={!!dq2pswd.items[info.sa_item[i] & 0x3f].illegal}
                                />
                            ))
                        }
                    </>
                }
            </div>

            <div className="frame">
                <h2>ムーンブルクの王女</h2>
                <OutputLabel label="なまえ" value={names.mu_name} />
                {info.mu_flag &&
                    <>
                        <OutputLabel label="ＥＸ" value={info.mu_exp.toString()} />
                        <br />
                        {
                            [...Array(8)].map((_, i) => (
                                <OutputLabel
                                    key={`mu-${i}`}
                                    label={i === 0 ? "どうぐ" : ""}
                                    value={
                                        ((info.mu_item[i] & 0x40) !== 0 ? "Ｅ " : "　 ")
                                        + dq2pswd.items[info.mu_item[i] & 0x3f].name
                                    }
                                    error={!!dq2pswd.items[info.mu_item[i] & 0x3f].illegal}
                                />
                            ))
                        }
                    </>
                }
            </div>
            <div className="frame">
                <h2>ストーリー</h2>
                <OutputLabel label="洞窟の浅瀬で" value={dq2pswd.flagMoonLabels[info.flag_moon ? 1 : 0].name} />
                <OutputLabel label="テパの村で" value={dq2pswd.flagGateLabels[info.flag_gate ? 1 : 0].name} />
                <OutputLabel label="水のはごろもを" value={dq2pswd.flagPlumageLabels[info.flag_plumage ? 1 : 0].name} />
                <OutputLabel label="ルプガナの街で" value={dq2pswd.statShipLabels[info.stat_ship].name} />
                <OutputLabel label="仲間の王子を" value={dq2pswd.statPrinceLabels[info.stat_prince].name} />
                <OutputLabel label="復活の場所は" value={dq2pswd.towns[info.town].name} />
            </div>
            <div className="frame">
                <h2>紋章</h2>
                <OutputLabel label="太陽" value={info.crest_sun ? "未入手" : "入手済"} />
                <OutputLabel label="星" value={info.crest_star ? "未入手" : "入手済"} />
                <OutputLabel label="月" value={info.crest_moon ? "未入手" : "入手済"} />
                <OutputLabel label="水" value={info.crest_water ? "未入手" : "入手済"} />
                <OutputLabel label="命" value={info.crest_life ? "未入手" : "入手済"} />
            </div>
            <div className="frame">
                <h2>そのほか</h2>
                <OutputLabel
                    label="パターン"
                    value={"#" + info.cryptKey} />
                <OutputLabel
                    label="チェックコード"
                    value={utils.toHex2(info.checkCode)}
                    error={info.checkCode !== 0} />
            </div>
        </div>
    );
}

export default Dq2Info;
