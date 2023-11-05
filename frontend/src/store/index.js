

import React from 'react';
import nodesStore from './Nodes';

let defaultValue = {
    nodesStore
};
export const StoreContext = React.createContext(defaultValue);

export const useStores = () => React.useContext(StoreContext);

export const StoreProvider = ({children}) => {
    return (
        <StoreContext.Provider value={defaultValue}>
            {children}
        </StoreContext.Provider>
    )
}