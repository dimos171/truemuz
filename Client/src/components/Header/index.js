import React from 'react';
import { IoIosSearch, IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { AzureAD, AuthenticationState } from 'react-aad-msal';

import './index.scss';
import { authProvider } from '../../services/authProvider';

function Header() {
  const getAuthLayout = () => (
    <AzureAD provider={authProvider} forceLogin={false}>
      {
        ({ login, logout, authenticationState, error, accountInfo }) => {
          switch (authenticationState) {
            case AuthenticationState.Authenticated:
              return (
                <h6 className="mb-0">
                  <span className="d-none d-lg-inline">Welcome, {accountInfo.account.name}!</span>
                  <span className="d-none d-lg-inline icon ml-2" onClick={logout}>Logout </span>

                  <div className="d-lg-none icon account-name text-truncate w-100" onClick={logout}>{accountInfo.account.name}</div>
                  <span className="d-lg-none icon" onClick={logout}>Logout</span>
                  
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
  );

  return (
    <header className="header-container px-3 px-md-5">
      <div className="header-container-filler d-none d-lg-block"></div>
      <div className="header-container-content d-flex align-items-center">
        <div className="col-6 col-lg-5 p-0">
          <h4 className="d-none d-lg-block">TRUEMUS</h4>
          {getAuthLayout()}
        </div>

        <div className="col-2 p-0 text-center d-none d-lg-block">
          <h5>MODERNOVA</h5>
        </div>

        <div className="col-6 col-lg-5 p-0 text-right">
          <IoIosSearch className="icon" size="1.3em" />
        </div>
      </div>
    </header>
  );
}

export default React.memo(Header);
