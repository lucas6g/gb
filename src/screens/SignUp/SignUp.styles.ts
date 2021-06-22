import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  padding-bottom: 130px;
`;
export const Title = styled.Text`
  color: #f4ede8;
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
  margin-top: 30px;
  margin-bottom: 16px;
`;

export const BackToSignIn = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #312e38;
  border-top-width: 1px;
  border-color: #232129;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
export const BackToSignInText = styled.Text`
  margin-left: 8px;
  color: white;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
`;
