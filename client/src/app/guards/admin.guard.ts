import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  //dependency injection for router
  const router = inject(Router);

  // retirieve jwt token
  const jwtToken = localStorage.getItem('token');

  //decode jwt token
  const decodedToken = decodeToken(jwtToken);

  //extract role from decoded token
  const role =
    decodedToken?.[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];

  //allow access only if the role is '1' admin
  if (role === '1') return true;
  else if (role === '2') {
    // navigate to worker if user is worker
    router.navigate(['./worker/worker']);
    return false;
  } else {
    // navigate to login if user isnt admin and isnt logged in
    router.navigate(['./auth/login']);

    return false;
  }

  function decodeToken(token: string | null): any {
    if (!token) return null;

    try {
      // Decode the token payload
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding JWT token', e);
      return null;
    }
  }
};

/*
1. When a User Navigates to a Route
Before rendering a component for a route, the router checks the guard for that route.
Guards determine if the user is allowed to access the route.
2. Logic Example
If a logged-in user with the Admin role tries to access /admin-dashboard, adminGuard will:
Check if a valid JWT token exists.
Decode the token to ensure the role is Admin.
Allow access if the role matches; otherwise, redirect to /login.

*/
