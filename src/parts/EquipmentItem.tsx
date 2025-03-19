import React from 'react';
import * as dq2 from '../dq2pswd/dq2pswd';

interface Props {
  /** 装備者マスク. 1: ローレシア, 2: サマルトリア, 4: ムーンブルク */
  mask: 1 | 2 | 4;
  /** 値 */
  value: number;
  /** 値を変更 */
  setValue: (val: number) => void;
  /** 選択肢 */
  items: ReadonlyArray<dq2.LabelInfo>;
}

const EquipmentItem: React.FC<Props> = (props) => {
  const canEquip = (itemNo: number): boolean => {
    const itemEquip = props.items[itemNo].equip;
    return itemEquip !== undefined && (itemEquip & props.mask) !== 0;
  };

  const handleItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const itemNo = Number(event.target.value);
    if (canEquip(itemNo)) {
      // 装備状態を引き継ぐ
      props.setValue(itemNo | (props.value & 0x40));
    } else {
      // 装備状態はリセット
      props.setValue(itemNo);
    }
  };

  const handleEquipChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const equip = Number(event.target.value);
    if (equip) {
      // 装備
      props.setValue(props.value | 0x40);
    } else {
      // 装備解除
      props.setValue(props.value & ~0x40);
    }
  };

  const options = props.items.map((it) => (
    <option value={it.id} key={it.id}>
      {it.name}
    </option>
  ));

  const selected = props.items.find((it) => it.id === props.value);
  const error = selected && selected.illegal;
  const equipable = canEquip(props.value & 0x3f);

  return (
    <div className='row-line'>
      {
        <select
          className={['label', error ? 'error' : ''].join(' ')}
          value={equipable ? props.value & 0x40 : 0}
          onChange={handleEquipChange}
          disabled={!equipable}
        >
          <option value={0}>（未装備）</option>
          <option value={0x40}>Ｅ</option>
        </select>
      }
      <select
        className={['value', error ? 'error' : ''].join(' ')}
        value={props.value & 0x3f}
        onChange={handleItemChange}
      >
        {options}
      </select>
    </div>
  );
};

export default EquipmentItem;
