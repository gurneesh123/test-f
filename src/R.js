import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getAllArt = async () =>{
    return api.get("/art");
};

export const oneArt = async (id) =>{
    return api.get(`/art/${id}`);
};

export const addBid = async (id, data) => {
    return api.post(`/art/${id}/bid`, data); 
};



