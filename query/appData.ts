import {
  type Participant,
  type ParticipantTransaction,
  type Payment,
} from "@/components/DynamicForm/context";
import CryptoJS from "crypto-js";

const EDNPOINT_URL = "https://api.jsonstorage.net";
const ENCRYPTED_ENDPOINT_API_KEY =
  "U2FsdGVkX18rkuOG6VN9QseQMml00RdJ0o58m1F2ACBq10kuleGUZAF9YfIHJjrob+NiJS56XGanZUNrTxCC2g==";
const ENCRYPTED_ITEM_ID =
  "U2FsdGVkX19++/YFqC9xkztPAtAd23ptytGKZL4r8Y4N/onsDGvySaf8YV+ZW292sGJefkA3ziTcWL4lzWPrjqh2NYMR+W5ifQYFD002RaeUADZfzlRFYpnw0wXfnMWQ";

type AppData = {
  participants: Participant[];
  participantTransactions: ParticipantTransaction[];
  payments: Payment[];
  deletedParticipantIds: string[];
  deletedPaymentIds: string[];
};

export const fetchAppData = async (password: string): Promise<AppData> => {
  const itemId = CryptoJS.AES.decrypt(ENCRYPTED_ITEM_ID, password).toString(
    CryptoJS.enc.Utf8
  );

  const response = await fetch(`${EDNPOINT_URL}/v1/json/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const updateAppData = async (data: AppData, password: string) => {
  const itemId = CryptoJS.AES.decrypt(ENCRYPTED_ITEM_ID, password).toString(
    CryptoJS.enc.Utf8
  );
  const apiKey = CryptoJS.AES.decrypt(
    ENCRYPTED_ENDPOINT_API_KEY,
    password
  ).toString(CryptoJS.enc.Utf8);

  const response = await fetch(
    `${EDNPOINT_URL}/v1/json/${itemId}?apiKey=${apiKey}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};

export const setAppData = async (data: AppData, password: string) => {
  const apiKey = CryptoJS.AES.decrypt(
    ENCRYPTED_ENDPOINT_API_KEY,
    password
  ).toString(CryptoJS.enc.Utf8);

  const response = await fetch(
    `${EDNPOINT_URL}/v1/json?apiKey=${apiKey}&name=debt-settlement`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};
