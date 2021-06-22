import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  width: 100%;
`;
export const Title = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Medium';
  margin-top: 30px;
  margin-bottom: 24px;
  align-self: flex-start;
`;

export const Form = styled.View`
  width: 100%;
  align-items: center;
`;

export const UserAvatarButton = styled.TouchableOpacity``;
export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
`;

export const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-top: 14px;
`;
