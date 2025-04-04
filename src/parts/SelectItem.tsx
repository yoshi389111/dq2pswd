import React from 'react';
import * as dq2 from '../dq2pswd/dq2pswd';

interface Props {
  /** ラベル名 */
  label: string;
  /** 値 */
  value: number;
  /** 値を変更 */
  setValue: (val: number) => void;
  /** 選択肢 */
  items: ReadonlyArray<dq2.LabelInfo>;
}

const SelectItem: React.FC<Props> = (props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    props.setValue(value);
  };

  const options = props.items.map((item) => (
    <option value={item.id} key={item.id}>
      {item.name}
    </option>
  ));

  const selected = props.items.find((item) => item.id === props.value);
  const error = selected && selected.illegal;

  return (
    <div className='row-line'>
      <span className={['label', error ? 'error' : ''].join(' ')}>{props.label}</span>
      <select className={['value', error ? 'error' : ''].join(' ')} value={props.value} onChange={handleChange}>
        {options}
      </select>
    </div>
  );
};

export default SelectItem;
