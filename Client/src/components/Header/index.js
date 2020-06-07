import React from 'react';
import { IoIosSearch, IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { AzureAD, AuthenticationState } from 'react-aad-msal';

import './index.scss';
import { authProvider } from '../../services/authProvider';

export default function Header() {
  return (
    <div>
      <div className="auth">
        <div className="col-md-5 col-sm-3 p-0">
          <AzureAD provider={authProvider} forceLogin={false}>
            {
              ({ login, logout, authenticationState, error, accountInfo }) => {
                switch (authenticationState) {
                  case AuthenticationState.Authenticated:
                    return (
                      <h6>
                        <span className="d-none d-lg-inline">Welcom, {accountInfo.account.name}!</span>
                        <span className="d-none d-lg-inline icon ml-2" onClick={logout}>Logout </span>

                        <div className="d-lg-none icon account-name text-truncate w-100" onClick={logout}>{accountInfo.account.name}</div>
                        <span className="d-lg-none icon" onClick={logout}>Logout </span>
                        
                        <IoMdLogOut className="icon" onClick={logout}></IoMdLogOut>
                      </h6>
                    );
                  case AuthenticationState.Unauthenticated:
                    return (
                      <div>
                        {error && <p><span>An error occured during authentication, please try again!</span></p>}
                        <h6>
                          <span className="d-none d-lg-inline">Hey stranger, you look new!</span>
                          <span className="icon ml-2" onClick={login}>Login </span>
                          <IoMdLogIn className="icon" onClick={login}></IoMdLogIn>
                        </h6>
                      </div>
                    );
                  case AuthenticationState.InProgress:
                    return (<p>Authenticating...</p>);
                }
              }
            }
          </AzureAD>
        </div>
      </div>
      <header className="header-container px-5 d-none d-lg-block">
        <div className="header-container-filler"></div>
        <div className="header-container-content d-flex align-items-center">
          <div className="col-5 p-0">
            <h4>
              TRUEMUZ
          </h4>
          </div>
          <div className="col-2 p-0 text-center">
            <h5>
              MODERNOVA
          </h5>
          </div>
          <div className="col-5 p-0 text-right">
            <IoIosSearch className="icon" size="1.3em" />
          </div>
        </div>
      </header>
    </div>
  );
}
