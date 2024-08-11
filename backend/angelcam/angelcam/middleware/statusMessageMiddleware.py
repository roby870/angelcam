from django.utils.deprecation import MiddlewareMixin


class StatusMessageMiddleware(MiddlewareMixin):
    
    
    def process_response(self, request, response):
        if response.status_code == 400:
            response.data = {'message': 'Invalid.'}
        elif response.status_code == 401:
            response.data = {'message': 'Not authenticated.'}
        elif response.status_code == 403:
            response.data = {'message': 'Permission denied.'}
        elif response.status_code == 404:
            response.data = {'message': 'Not found.'}
        return response