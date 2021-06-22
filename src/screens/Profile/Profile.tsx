import React, { useCallback, useContext, useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from 'react-native';

import CameraRoll, {
  PhotoIdentifier,
} from '@react-native-community/cameraroll';

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
} from './Profile.styles';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState<PhotoIdentifier[]>([]);

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

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  const handleUpdateUserAvatar = useCallback(async () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then((r) => {
        setAvatar(r.edges);
      })
      .catch((err) => {
        // Error Loading Images
      });
  }, []);

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
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>
          <UserAvatarButton onPress={handleUpdateUserAvatar}>
            <UserAvatar
              source={{
                uri: '',
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
