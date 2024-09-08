import crypto from "crypto-js";
import { cryptoPasswordIV, cryptoPasswordKey } from "../config";
export function parseJWT<T>(token: string): T {
  const base64Url = token.split(".")[1];
  if (!base64Url) {
    throw Error("No payload exists");
  }

  try {
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw error;
  }
}

export function convertTime(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  const timeUnits: { [key: string]: number } = {
    ms: 1,
    s: 1000,
    min: 60000,
    hr: 3600000,
    d: 86400000,
  };

  if (
    !timeUnits.hasOwnProperty(fromUnit) ||
    !timeUnits.hasOwnProperty(toUnit)
  ) {
    throw new Error("Invalid time unit");
  }

  const conversionFactor = timeUnits[fromUnit] / timeUnits[toUnit];
  const convertedValue = value * conversionFactor;

  return convertedValue;
}
export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
  return emailRegex.test(email);
}

export function encryptPassword(password: string): string {
  return crypto.AES.encrypt(
    password,
    crypto.enc.Base64.parse(cryptoPasswordKey),
    {
      iv: crypto.enc.Base64.parse(cryptoPasswordIV),
    }
  ).toString();
}

export function readFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (!event.target || !event.target.result)
        throw new Error("No content exists within the file");
      const fileContent = event.target.result as string;
      res(fileContent);
    };
    fileReader.onerror = (error) => {
      rej(error);
    };
    fileReader.readAsDataURL(file);
  });
}
export function checkCookieExists(cookieName: string): boolean {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return true;
    }
  }
  return false;
}
export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
export function pageControl(
  setPage: React.Dispatch<React.SetStateAction<number>>,
  totalPages: number
): { inc: () => void; dec: () => void } {
  return {
    inc: () => {
      setPage((oldPage) => {
        return Math.max(1, (oldPage + 1) % (totalPages + 1));
      });
    },
    dec: () => {
      setPage((oldPage) => {
        return oldPage - 1 === 0 ? totalPages : oldPage - 1;
      });
    },
  };
}
export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const interval = {
    year: seconds / 31536000,
    month: seconds / 2592000,
    day: seconds / 86400,
    hour: seconds / 3600,
    minute: seconds / 60,
  };

  if (interval.year >= 1) {
    return pluralize(Math.floor(interval.year), "year");
  } else if (interval.month >= 1) {
    return pluralize(Math.floor(interval.month), "month");
  } else if (interval.day >= 1) {
    return pluralize(Math.floor(interval.day), "day");
  } else if (interval.hour >= 1) {
    return pluralize(Math.floor(interval.hour), "hour");
  } else if (interval.minute >= 1) {
    return pluralize(Math.floor(interval.minute), "minute");
  }

  return pluralize(Math.floor(seconds), "second");
}

function pluralize(value: number, unit: string): string {
  if (value === 1) {
    return `${unit === "hour" ? "an" : "a"} ${unit}`;
  } else {
    return `${value} ${unit}s`;
  }
}