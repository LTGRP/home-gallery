import * as React from "react";
import { useState } from 'react';

import { SearchInput } from './SearchInput';

export const MobileSearch = ({children, onSearch}) => {
  const [ expand, setExpand ] = useState(false);

  return (
    <>
      { !expand &&
        <>
          {children}
          <div>
            <button className="button -default" onClick={() => setExpand(true)}><i className="fas fa-search"></i></button>
          </div>
        </>
      }
      { expand &&
        <>
          <div>
            <a className="nav__link link" onClick={() => setExpand(!expand)}><i className="fas fa-arrow-left"></i> <span className="hide-sm">Back</span></a>
          </div>
          <SearchInput focus={true} onSearch={onSearch} />
        </>
      }
    </>
  )

}