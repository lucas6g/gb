import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

interface ContainerProps {
  isError?: boolean;
}

// sempre que for estilizar um componente de fora do styled usar ()
export const Container = styled(RectButton)<ContainerProps>`
  width: 100%;
  height: 50px;
  background-color: #ff9000;
  border-radius: 10px;
  margin-bottom: 16px;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.isError &&
    css`
      opacity: 0.4;
    `}
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 18px;
`;
