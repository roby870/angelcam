from django.test import TestCase, RequestFactory
from rest_framework.test import APIRequestFactory
from unittest.mock import patch
from .views import *
from .models import CustomUser


class CustomUserTest(TestCase):
    
    def setUp(self):
        CustomUser.objects.create(email='test_user@gmail.com')

    def test_model_creation(self):
        obj = CustomUser.objects.get(email='test_user@gmail.com')
        self.assertEqual(obj.email, 'test_user@gmail.com')


class ExternalTokenAuthenticationTest(TestCase):

    @patch('requests.get')
    def test_successful_authentication(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'email': 'test@example.com'}
        factory = RequestFactory()
        request = factory.get('/some-url')
        request.COOKIES['token'] = 'validtoken'
        auth = ExternalTokenAuthentication()
        user, token = auth.authenticate(request)
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(token, 'validtoken')
    

    @patch('requests.get')
    def test_no_token_cookie(self, mock_get):
        factory = RequestFactory()
        request = factory.get('/some-url')
        auth = ExternalTokenAuthentication()
        self.assertIsNone(auth.authenticate(request)) 


    @patch('requests.get')
    def test_invalid_authentication(self, mock_get):
        mock_get.return_value.status_code = 401
        mock_get.return_value.json.return_value = {'email': 'test@example.com'}
        factory = RequestFactory()
        request = factory.get('/some-url')
        request.COOKIES['token'] = 'invalidtoken'
        auth = ExternalTokenAuthentication()
        response = auth.authenticate(request)
        self.assertEqual(response.status_code, 401)


class LoginViewTest(TestCase):

    @patch('requests.get')
    def test_successful_login_existing_user(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'email': 'test@example.com'}
        CustomUser.objects.create(email='test@example.com')
        factory = APIRequestFactory()
        request = factory.post('/login/', {'token': 'validtoken', 'email': 'test@example.com'}, format='json')
        view = LoginView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)


    @patch('requests.get')
    def test_user_registration(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'email': 'newuser@example.com'}
        factory = APIRequestFactory()
        request = factory.post('/login/', {'token': 'validtoken', 'email': 'newuser@example.com'}, format='json')
        view = LoginView.as_view()
        response = view(request)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(CustomUser.objects.first().email, 'newuser@example.com')
        self.assertEqual(response.status_code, 200)


    @patch('requests.get')
    def test_invalid_login(self, mock_get):
        mock_get.return_value.status_code = 401
        mock_get.return_value.json.return_value = {'email': 'test@example.com'}
        CustomUser.objects.create(email='test@example.com')
        factory = APIRequestFactory()
        request = factory.post('/login/', {'token': 'validtoken', 'email': 'test@example.com'}, format='json')
        view = LoginView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 401)