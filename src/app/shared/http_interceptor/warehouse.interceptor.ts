import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { WarehouseService } from '../warehouse.service';

@Injectable()
export class WarehouseInterceptor implements HttpInterceptor {

    private request: HttpRequest<any>[] = [];
    requestCounter = 0;
    reqUrl='';
    constructor(private service: WarehouseService) {



    }

    removeRequest(req: HttpRequest<any>) {
       
        this.requestCounter++;
        const i = this.request.indexOf(req);
        if (i >= 0) {
            this.request.splice(i, 1);
        }
        console.log(i, 'i ',this.requestCounter,"counter", );

        this.service.isLoading.next(this.request.length > 0);
        this.service.loadingValue.next(this.requestCounter);
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.url !== this.reqUrl){
            this.requestCounter =1;
            this.reqUrl=req.url;

        }
        this.request.push(req);
        console.log('No of request -->' + this.request.length);
        this.service.isLoading.next(true);
        this.service.loadingValue.next(this.request.length);
        this.service.bufferValue.next(this.request.length);
        this.requestCounter = this.request.length;
        return Observable.create(observer => {
            const subscription = next.handle(req).subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        this.removeRequest(req);
                        observer.next(event);
                    }
                },
                err => {
                    alert('error returned');
                    this.removeRequest(req);
                    observer.error(err);
                },
                () => {
                    this.removeRequest(req);
                    observer.complete();
                });
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };
        }
        );
    }


}



