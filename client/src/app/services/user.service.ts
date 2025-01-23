import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Job } from 'src/app/interfaces/job';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:44330/api/User';

  /* behaviorSubject tracks logged-in status of user it uses result of method checkToken*/
  //behaviorSubject keeps track of latest value and emits it

  isLoggedInSubject = new BehaviorSubject<boolean>(this.checkToken());

  ///* რადგან behaviorSubject არის როგორც ობსერვაბლე ასევე ობსერვერ ჩვენ ვინახავთ
  //* isLoggedIn ცვლადში მხოლოდ როგორ ობსერვერ რათა კომპონენტებში მისი შესაბამისი მიზეზით გამოყენება შევძლოთ
  //* ანუ მხოლოდ მივიღოთ მისგან ინფორმაცია და კომპონენტში არ იყოს შესაძლებელი მნიშვნელობის გადაცემა მისთვის

  /* navbar  კომპონენტში ვიყენებ isLoggedIn ობსერვებლს რომ მხოლოდ მივიღო მინსგან მნიშვნელობა */
  /* login კომპონენტში ვიყენებ isLoggedInSubject როცა ვამოწმებ თოქენი
     ჩამახსივრებულია თუ არა როცა თაბი დავხურე ლოგ აუთის გარეშე
     და თუ არის მას გადავცემ მნიშვნელობას ანუ ვიყენებ როგორც ობსერვერს
   */
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getJobOptions(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  registerUser(UserData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, UserData);
  }

  loginUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'content-Type': 'application/json' });
    return (
      this.http
        .post<string>(`${this.apiUrl}/login`, userData, {
          headers,
          responseType: 'text' as 'json',
        }) ///?pipe method is used to compose multiple operators in sequence
        /*it takes serier of operator functions asa rguments and applies them to an observable*/
        .pipe(
          tap((token) => {
            localStorage.setItem('token', token);
            this.isLoggedInSubject.next(true);
          })
        )
    );
  }

  dashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  logOut() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false); // state update
  }

  checkToken(): boolean {
    return !!localStorage.getItem('token');
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('error decoding jwt token');
      return null;
    }
  }

  jobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs`);
  }
}

////? observables
/*
an observable represents stream of data you can subscribe to
it emits values over time and code reacts to these emitted values


////?subjects are both observables and observers
it can be subscribed to like an observable and it can also emit values like observer
Subjects are often used to breoadcast data to multiple subscribers, such as in event systems or shared state management

const subject = new Subject<number>();

subject.subscribe(value=>console.log("sub1", value));
subject.subscribe(value=>console.log("sub2", value));

subject.next(1);  both subscribers receive 1
subject.next(2);  both receive 2


////? observable subjects
specialized subject type with specific behaviour

- it required an inital value and emits the latest value to any new subscribers
- it keeps track of the last emitted value making it useful for state management

mag
const behaviorSubject = new BehaviorSubject<number>(0) initial value is 0

subscriber 1
behhaviorSubject.subscribe(value=>console.log("sub1", value));

emit values
behaviorSubject.next(1);
behaviorSubject.next(2);

subscriber 2 gets the lastest value
behaviorSubject.subscribe(value=>console.log("sub2", value))

Subscriber 1: 0
Subscriber 1: 1
Subscriber 1: 2
Subscriber 2: 2



*/
