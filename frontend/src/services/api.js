import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json"
    }
});

export const getGmailEmails = async () => {
    const response = await API.get("/gmail/emails");
    return response.data;
};

export const processEmail = async (gmailId) => {
    const response = await API.post(
        `/process/${encodeURIComponent(gmailId)}`
    );

    return response.data;
};

export const generateReply = async (emailId) => {
    const response = await API.post(
        `/generate-reply/${emailId}`
    );

    return response.data;
};

export const sendReply = async (emailId) => {
    const response = await API.post(
        `/send/${emailId}`
    );

    return response.data;
};

export const regenerateReply = async (emailId, instruction) => {
    const response = await API.post(
        `/emails/${encodeURIComponent(emailId)}/regenerate-reply`,
        {
            instruction
        }
    );

    return response.data;
};

export default API;