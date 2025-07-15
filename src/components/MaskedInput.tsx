import React from 'react';
import { IMaskInput } from 'react-imask';
import ValidatedInput from './ValidatedInput';

interface MaskedInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  type?: string;
  placeholder?: string;
  required?: boolean;
  mask: any;
}

const MaskedInput: React.FC<MaskedInputProps> = (props) => {
  const { mask, onChange, onBlur, ...rest } = props;

  return (
    <IMaskInput
      mask={mask}
      onAccept={onChange}
      onBlur={onBlur}
      value={props.value}
    >
      {(inputProps: any) => <ValidatedInput {...rest} {...inputProps} />}
    </IMaskInput>
  );
};

export default MaskedInput;
