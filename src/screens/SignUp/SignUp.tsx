import React, { useEffect, useState, useCallback } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText,
} from './SignUp.styles';
import logoImg from '../../assets/logo.png';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

import api from '../../services/api';

const SignUp: React.FC = () => {
  const navigation = useNavigation();

  const handleSignUp = useCallback(async (signUpFormData) => {
    try {
      await api.post('/users', signUpFormData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro no Cadastro ', 'Tente novamente');
    }
  }, []);

  const [isKeyBoard, setIsKeyBoard] = useState(false);

  const singInSchema = Yup.object().shape({
    name: Yup.string().required('O Campo nome é obrigatorio'),
    email: Yup.string()
      .required('O Campo email é obrigatorio')
      .email('Digite um email valido'),
    password: Yup.string()
      .min(6, 'No minimo 6 digitos')
      .required('O Campo senha é obrigatorio'),
  });

  const keyboardDidShow = () => {
    setIsKeyBoard(true);
  };

  const keyboardDidHide = () => {
    setIsKeyBoard(false);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <Title>Cadastre-Se </Title>

            <Formik
              validationSchema={singInSchema}
              initialValues={{ name: '', email: '', password: '' }}
              onSubmit={(values) => {
                handleSignUp(values);
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
                <>
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
                    error={
                      !isValid &&
                      Boolean(touched.email) &&
                      Boolean(errors.email)
                    }
                  />
                  {errors.email && touched.email && (
                    <ErrorMessage message={errors.email} />
                  )}

                  <Input
                    onChangeText={handleChange('password')}
                    value={values.password}
                    iconName="lock"
                    placeholder="Senha"
                    secureTextEntry
                    error={
                      !isValid &&
                      Boolean(touched.password) &&
                      Boolean(errors.password)
                    }
                  />
                  {errors.password && touched.password && (
                    <ErrorMessage message={errors.password} />
                  )}

                  <Button
                    onPress={() => {
                      handleSubmit();
                    }}
                  >
                    Entrar
                  </Button>
                </>
              )}
            </Formik>
          </Container>
        </ScrollView>

        {!isKeyBoard ? (
          <BackToSignIn
            onPress={() => {
              navigation.navigate('SignIn' as never);
            }}
          >
            <Icon name="arrow-left" size={20} color="#fff" />
            <BackToSignInText>Ja tem uma conta ?</BackToSignInText>
          </BackToSignIn>
        ) : null}
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
