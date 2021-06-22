import React, { useState, useCallback } from 'react';

import { TextInputProps } from 'react-native';
import { Container, TextInput, Icon } from './Input.styles';

interface InputProps extends TextInputProps {
  iconName: string;
  error: boolean;
  containerStyle?: {};
}

const Input: React.FC<InputProps> = ({
  iconName,
  value,
  error,
  containerStyle,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFiled, setIsFiled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    if (value) {
      setIsFiled(true);
    } else {
      setIsFiled(false);
    }
  }, [value]);

  return (
    <Container style={containerStyle} isErrored={error} isFocused={isFocused}>
      <Icon
        isError={error}
        name={iconName}
        size={20}
        color={isFocused || isFiled || value ? '#f59000' : '#fff'}
      />
      <TextInput
        keyboardAppearance="dark"
        placeholderTextColor="#fff"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        value={value}
        {...rest}
      />
    </Container>
  );
};

export default Input;
