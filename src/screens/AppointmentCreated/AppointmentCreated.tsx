import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './AppointmentCreated.styles';

interface IRouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();

  const { params } = useRoute();

  const routeParams = params as IRouteParams;

  const handleOkButtonPress = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  const formatedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE ,'dia' dd 'de' MMMM 'de' yyyy 'ás' HH:mm'h'",
      {
        locale: ptBr,
      },
    );
  }, [routeParams]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>Gendamento concluido</Title>
      <Description>{formatedDate}</Description>

      <OkButton onPress={handleOkButtonPress}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
