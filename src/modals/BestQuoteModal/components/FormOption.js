import React, { useState } from 'react';
import styles from './FormOption.module.css';
import Checkbox from '@/ui/Checkbox';
import Radiobutton from '@/ui/Radiobutton';
import Counter from '@/ui/Counter';

const FormOption = ({
    type = 'checkbox', //checkbox | radiobutton
    enableCounter = false,
    ...restProps // Capture all other props, including checked and onChange for the input
}) => {
    const [counterValue, setCounterValue] = useState(1);

    function Input() {
        switch (type) {
            case 'checkbox':
                return (<Checkbox {...restProps} />)
            case 'radiobutton':
                return (<Radiobutton {...restProps} />);
            default:
                return null;
        }
    }
  return (
    <div className={styles.formOption}>
        <Input/>
        {enableCounter && restProps.checked && (
            <Counter
                value={counterValue}
                onChange={setCounterValue}
            />
        )}
    </div>
  );
};

export default FormOption; 