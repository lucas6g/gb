import React, { useCallback, useContext } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import {
  launchImageLibrary,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ImageLibraryOptions,
} from 'react-native-image-picker';

import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
  Form,
  Header,
  SignOutButton,
} from './Profile.styles';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser, signOut } = useContext(AuthContext);

  const handleChangeProfile = useCallback(
    async (signUpFormData) => {
      try {
        const reponse = await api.put('/profile', signUpFormData);
        await updateUser(reponse.data);
        navigation.goBack();
      } catch (error) {
        Alert.alert('Erro na atualização do perfil', 'Tente novamente');
      }
    },
    [navigation, updateUser],
  );

  const handleSelectPostImage = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo' } as ImageLibraryOptions,
      async (response) => {
        if (!response.didCancel && response?.assets) {
          const data = new FormData();

          data.append('avatar', {
            uri: response.assets[0].uri,
            name: `${user.user_id}.jpeg`,
            type: 'image/jpg',
          });

          const updatedResponse = await api.patch('users/avatar', data);

          updateUser(updatedResponse.data);
        }
      },
    );
  }, [updateUser, user.user_id]);

  const profileSchema = Yup.object().shape({
    name: Yup.string().required('O Campo nome é obrigatorio'),
    email: Yup.string()
      .required('O Campo email é obrigatorio')
      .email('Digite um email valido'),

    old_password: Yup.string().required('O campo Senha Atual é obrigatorio'),
    newPassword: Yup.string().required('O campo Nova senha é obrigatorio'),

    newPasswordConfirmation: Yup.string()
      .required('O campo Nova senha é obrigatorio')
      .oneOf([Yup.ref('newPassword'), undefined], 'Confirmação incorreta'),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: '100%', alignItems: 'center' }}
      >
        <Container>
          <Header>
            <BackButton
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <SignOutButton
              onPress={() => {
                signOut();
              }}
            >
              <Icon name="log-out" size={24} color="#999591" />
            </SignOutButton>
          </Header>

          <UserAvatarButton onPress={handleSelectPostImage}>
            <UserAvatar
              source={{
                uri: user.avatar_url,
              }}
            />
          </UserAvatarButton>
          <Title>Meu Perfil </Title>

          <Formik
            validationSchema={profileSchema}
            initialValues={{
              name: user.name,
              email: user.email,

              old_password: '',
              newPassword: '',
              newPasswordConfirmation: '',
            }}
            onSubmit={(values) => {
              handleChangeProfile(values);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              isValid,
              touched,
            }) => (
              <Form>
                <Input
                  onChangeText={handleChange('name')}
                  iconName="user"
                  placeholder="Nome"
                  value={values.name}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  error={
                    !isValid && Boolean(touched.name) && Boolean(errors.name)
                  }
                />
                {errors.name && touched.name && (
                  <ErrorMessage message={errors.name} />
                )}

                <Input
                  onChangeText={handleChange('email')}
                  iconName="mail"
                  placeholder="E-mail"
                  value={values.email}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  containerStyle={{ marginBottom: 16 }}
                  error={
                    !isValid && Boolean(touched.email) && Boolean(errors.email)
                  }
                />
                {errors.email && touched.email && (
                  <ErrorMessage message={errors.email} />
                )}

                <Input
                  onChangeText={handleChange('old_password')}
                  value={values.old_password}
                  iconName="lock"
                  placeholder="Senha Atual"
                  secureTextEntry
                  autoCorrect={false}
                  autoCapitalize="none"
                  error={
                    !isValid &&
                    Boolean(touched.old_password) &&
                    Boolean(errors.old_password)
                  }
                />
                {errors.old_password && touched.old_password && (
                  <ErrorMessage message={errors.old_password} />
                )}
                <Input
                  onChangeText={handleChange('newPassword')}
                  value={values.newPassword}
                  iconName="lock"
                  placeholder="Nova Senha"
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry
                  error={
                    !isValid &&
                    Boolean(touched.newPassword) &&
                    Boolean(errors.newPassword)
                  }
                />
                {errors.newPassword && touched.newPassword && (
                  <ErrorMessage message={errors.newPassword} />
                )}
                <Input
                  onChangeText={handleChange('newPasswordConfirmation')}
                  value={values.newPasswordConfirmation}
                  iconName="lock"
                  placeholder="Confirme a nova senha"
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry
                  error={
                    !isValid &&
                    Boolean(touched.newPasswordConfirmation) &&
                    Boolean(errors.newPasswordConfirmation)
                  }
                />
                {errors.newPasswordConfirmation &&
                  touched.newPasswordConfirmation && (
                    <ErrorMessage message={errors.newPasswordConfirmation} />
                  )}

                <Button
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  Confirmar Mudanças
                </Button>
              </Form>
            )}
          </Formik>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
