import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';

import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  BackButton,
  UserAvatar,
  Content,
  ProvidersList,
  ProvidersListContainer,
  ProviderAvatar,
  ProviderContainer,
  ProviderName,
  Calendar,
  CalendarTitle,
  OpenDatePickerButon,
  CalendarButtonText,
  Schedule,
  Title,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './CreateAppointment.styles';

interface RouteParams {
  providerId: string;
}

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

interface ISchedule {
  hour: number;
  avaible: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const routeParams = route.params as RouteParams;
  const [selectProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  const { goBack, navigate } = useNavigation();

  useEffect(() => {
    async function loadProviders() {
      const response = await api.get('/providers');

      setProviders(response.data);
    }
    loadProviders();
  }, []);

  useEffect(() => {
    async function loadAvailableSchedulesInDay(
      providerId: string,
      month: number,
      day: number,
      year: number,
    ) {
      const response = await api.get(
        `providers/${providerId}/day-avalability`,
        {
          params: {
            month,
            day,
            year,
          },
        },
      );

      setSchedules(response.data);
    }

    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear();

    loadAvailableSchedulesInDay(routeParams.providerId, month, day, year);
  }, [selectedDate, routeParams]);

  const hadleSelectedProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleDateChange = useCallback((event, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      // para quando clicar no ok remover da tela no android
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/appointments', {
        provider_id: routeParams.providerId,
        date,
      });

      navigate('AppointmentCreated' as never, { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar o agendamento',
        'Tente novamente meu parceiro',
      );
    }
  }, [navigate, routeParams, selectedDate, selectedHour]);

  // deixar qualquer formatação de data fora do ruturn do jsx usar o use memo para isso
  const morningSchedules = useMemo(() => {
    return schedules
      .filter((schedule) => {
        return schedule.hour < 12;
      })
      .map(({ hour, avaible }) => {
        return {
          hour,
          avaible,
          hourFormated: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [schedules]);

  const eveningSchedules = useMemo(() => {
    return schedules
      .filter((schedule) => {
        return schedule.hour >= 12;
      })
      .map(({ hour, avaible }) => {
        return {
          hour,
          avaible,
          hourFormated: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [schedules]);

  return (
    <Container>
      <Header>
        <BackButton
          onPress={() => {
            goBack();
          }}
        >
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleileiros</HeaderTitle>
        <UserAvatar
          source={{
            uri:
              'data:image/jpeg;base64,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',
          }}
        />
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(provider) => {
              return provider.id;
            }}
            renderItem={({ item: provider }) => {
              return (
                <ProviderContainer
                  onPress={() => {
                    hadleSelectedProvider(provider.id);
                  }}
                  selected={selectProvider === provider.id}
                >
                  <ProviderAvatar
                    source={{
                      uri:
                        'data:image/jpeg;base64,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',
                    }}
                  />

                  <ProviderName selected={selectProvider === provider.id}>
                    {provider.name}
                  </ProviderName>
                </ProviderContainer>
              );
            }}
          />
        </ProvidersListContainer>

        <Calendar>
          <CalendarTitle> Escolha uma data </CalendarTitle>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={selectedDate}
              display="calendar"
              onChange={handleDateChange}
            />
          )}
          <OpenDatePickerButon
            onPress={() => {
              setShowDatePicker(!showDatePicker);
            }}
          >
            <CalendarButtonText>Open up</CalendarButtonText>
          </OpenDatePickerButon>
        </Calendar>

        <Schedule>
          <Title>Escolha o horario</Title>

          <Section>
            <SectionTitle>Manha</SectionTitle>

            <SectionContent showsHorizontalScrollIndicator={false}>
              {morningSchedules.map((schedule) => {
                return (
                  <Hour
                    selected={selectedHour === schedule.hour}
                    available={schedule.avaible}
                    key={schedule.hourFormated}
                    onPress={() => {
                      handleSelectHour(schedule.hour);
                    }}
                    enabled={schedule.avaible}
                  >
                    <HourText selected={selectedHour === schedule.hour}>
                      {schedule.hourFormated}
                    </HourText>
                  </Hour>
                );
              })}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent showsHorizontalScrollIndicator={false}>
              {eveningSchedules.map((schedule) => {
                return (
                  <Hour
                    selected={selectedHour === schedule.hour}
                    onPress={() => {
                      handleSelectHour(schedule.hour);
                    }}
                    available={schedule.avaible}
                    key={schedule.hourFormated}
                    enabled={schedule.avaible}
                  >
                    <HourText selected={selectedHour === schedule.hour}>
                      {schedule.hourFormated}
                    </HourText>
                  </Hour>
                );
              })}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton
          onPress={() => {
            handleCreateAppointment();
          }}
        >
          <CreateAppointmentButtonText>
            Criar Agendamento
          </CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
