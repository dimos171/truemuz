import React from 'react';
import { IoIosSearch } from "react-icons/io";

import './index.scss';

export default function Header() {
  return (
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
  );
}
