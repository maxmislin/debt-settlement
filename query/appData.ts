import {
  type Participant,
  type ParticipantTransaction,
  type Payment,
} from "@/components/DynamicForm/context";
import { Item } from "@/app/context";
import CryptoJS from "crypto-js";

const EDNPOINT_URL = "https://api.jsonstorage.net";
const ENCRYPTED_ENDPOINT_API_KEY =
  "U2FsdGVkX18rkuOG6VN9QseQMml00RdJ0o58m1F2ACBq10kuleGUZAF9YfIHJjrob+NiJS56XGanZUNrTxCC2g==";
const ENCRYPTED_ITEM_ID =
  "U2FsdGVkX1/11cl0pMeoVV+vZgNUDlKIL58HYOVNy82nDrxk/ByEKjcT91o/Qt9baY6L2KGamC/yRbgprRlNoTuDNbCpjFK3UiApcg/WDWXxe49CvQeq19J+ln1V+GNS";

type ItemData = {
  participants: Participant[];
  participantTransactions: ParticipantTransaction[];
  payments: Payment[];
  deletedParticipantIds: string[];
  deletedPaymentIds: string[];
  status?: number;
};

export type AppData = {
  items: Item[];
  updatedAt: string;
};

type CreateItemResponse = {
  uri: string;
};

export const emptyItemTemplate = {
  participants: [],
  participantTransactions: [],
  payments: [],
  deletedParticipantIds: [],
  deletedPaymentIds: [],
};

export const fetchAppData = async (password: string): Promise<AppData> => {
  const itemId = CryptoJS.AES.decrypt(ENCRYPTED_ITEM_ID, password).toString(
    CryptoJS.enc.Utf8,
  );
  const apiKey = CryptoJS.AES.decrypt(
    ENCRYPTED_ENDPOINT_API_KEY,
    password,
  ).toString(CryptoJS.enc.Utf8);

  const response = await fetch(
    `${EDNPOINT_URL}/v1/json/${itemId}?apiKey=${apiKey}`,
    {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    },
  );

  return response.json();
};

export const updateAppData = async (data: AppData, password: string) => {
  const itemId = CryptoJS.AES.decrypt(ENCRYPTED_ITEM_ID, password).toString(
    CryptoJS.enc.Utf8,
  );

  return updateItemData(data, password, itemId);
};

export const fetchItemData = async (itemId: string): Promise<ItemData> => {
  const response = await fetch(`${EDNPOINT_URL}/v1/json/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const deleteItem = async (
  itemId: string,
  password: string,
): Promise<boolean> => {
  const apiKey = CryptoJS.AES.decrypt(
    ENCRYPTED_ENDPOINT_API_KEY,
    password,
  ).toString(CryptoJS.enc.Utf8);

  await fetch(`${EDNPOINT_URL}/v1/json/${itemId}?apiKey=${apiKey}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return true;
};

export const updateItemData = async (
  data: Record<string, unknown>,
  password: string,
  itemId: string,
) => {
  const apiKey = CryptoJS.AES.decrypt(
    ENCRYPTED_ENDPOINT_API_KEY,
    password,
  ).toString(CryptoJS.enc.Utf8);

  const response = await fetch(
    `${EDNPOINT_URL}/v1/json/${itemId}?apiKey=${apiKey}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return response.json();
};

export const createItemData = async (
  data: Record<string, unknown>,
  password: string,
  name: string,
): Promise<CreateItemResponse> => {
  const apiKey = CryptoJS.AES.decrypt(
    ENCRYPTED_ENDPOINT_API_KEY,
    password,
  ).toString(CryptoJS.enc.Utf8);

  const response = await fetch(
    `${EDNPOINT_URL}/v1/json?apiKey=${apiKey}&name=${name}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return response.json();
};
