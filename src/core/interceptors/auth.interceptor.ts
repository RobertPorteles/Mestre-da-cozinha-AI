import { HttpInterceptorFn } from "@angular/common/http";

export const AuthInterceptor : HttpInterceptorFn = (req, next) => {
    const auth = sessionStorage.getItem('token');
    if(auth && req.url.includes('http://localhost:8081/api/v1/receitas')){
        const accessToken = auth;

        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });

        return next(cloned);
    }
    return next(req);
}