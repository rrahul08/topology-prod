
import React, {
    useEffect,
} from "react";

let id = 1;
const getFId = () => `f${id++}`;
const getEID = () => `e${id++}`;

const InitialNodesAndEdges = () => {

    fetch('http://localhost:4000/network_graph_data')
        .then(response => response.json())
        .then(data => console.log(data));
};

export default InitialNodesAndEdges;