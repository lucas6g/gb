import React, { useEffect, useState, useCallback, useContext } from 'react';
import * as Yup from 'yup';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import { Formik } from 'formik';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAcountButton,
  CreateAcountButtonText,
} from './SignIn.styles';

import logoImg from '../../assets/logo.png';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

import { AuthContext } from '../../context/AuthContext';

const SignIn: React.FC = () => {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

  const [isKeyBoard, setIsKeyBoard] = useState(false);

  const handleSignIn = useCallback(
    async (signFormData) => {
      try {
        await signIn(signFormData);
        Alert.alert('Autenticado com sucessos');
      } catch (error) {

        Alert.alert(
          'Erro na Autenticação ',
          'cheque suas credenciais de acesso',
        );
      }
    },
    [signIn],
  );

  const singInSchema = Yup.object().shape({
    email: Yup.string()
      .required('O Campo email é obrigatorio')
      .email('Digite um email valido'),
    password: Yup.string()
      .min(6, 'No minimo 6 digitos')
      .required('O Campo senha é obrigatorio'),
  });

  const keyboardDidShow = useCallback(() => {
    setIsKeyBoard(true);
  }, []);

  const keyboardDidHide = useCallback(() => {
    setIsKeyBoard(false);
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, [keyboardDidHide, keyboardDidShow]);

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
            <Title>Faça seu login </Title>
            <Formik
              validationSchema={singInSchema}
              initialValues={{ email: '', password: '' }}
              onSubmit={(values) => {
                handleSignIn(values);
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

            {!isKeyBoard ? (
              <ForgotPassword
                onPress={() => {
                  // console.log('viado');
                }}
              >
                <ForgotPasswordText>Esqueceu sua senha ?</ForgotPasswordText>
              </ForgotPassword>
            ) : null}
          </Container>
        </ScrollView>

        {!isKeyBoard ? (
          <CreateAcountButton
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <Icon name="log-in" size={20} color="#ff9000" />
            <CreateAcountButtonText>Criar sua conta</CreateAcountButtonText>
          </CreateAcountButton>
        ) : null}
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
