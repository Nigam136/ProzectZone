import { createContext, useContext, useReducer } from "react";
import PropTypes from 'prop-types';

 const DataLayerContext = createContext();


export const DataLayer = ({ initialState, reducer, children }) => (
    <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </DataLayerContext.Provider>
);

DataLayer.propTypes = {
    initialState: PropTypes.object.isRequired, 
    reducer: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};
  

export const useDataLayerValues = () => useContext(DataLayerContext);