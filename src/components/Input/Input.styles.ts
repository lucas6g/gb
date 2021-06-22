import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

interface IconProps {
  isError: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background-color: #232129;
  border-radius: 10px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  border-width: 2px;
  border-style: solid;
  border-color: #232129;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${(props) =>
    props.isFocused &&
    css`
      border-color: #ff9000;
    `}
`;

export const Icon = styled(FeatherIcon)<IconProps>`
  margin-right: 16px;

  ${(props) =>
    props.isError &&
    css`
      color: #c53030;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: white;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;
