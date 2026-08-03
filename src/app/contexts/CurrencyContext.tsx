import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type CurrencyCode =
  | 'OMR'
  | 'SAR'
  | 'AED'
  | 'QAR'
  | 'KWD'
  | 'BHD'
  | 'JOD'
  | 'USD';

interface Currency {
  code: CurrencyCode;
  flagUrl: string;
  name: string;
  symbol: string;
  rate: number;
  decimals: number;
}

export const currencies: Currency[] = [
  {
    code: 'OMR',
    flagUrl: 'https://flagcdn.com/w40/om.png',
    name: 'الريال العماني',
    symbol: 'ر.ع',
    rate: 1,
    decimals: 3,
  },
  {
    code: 'SAR',
    flagUrl: 'https://flagcdn.com/w40/sa.png',
    name: 'الريال السعودي',
    symbol: 'ر.س',
    rate: 9.75,
    decimals: 2,
  },
  {
    code: 'AED',
    flagUrl: 'https://flagcdn.com/w40/ae.png',
    name: 'الدرهم الإماراتي',
    symbol: 'د.إ',
    rate: 9.56,
    decimals: 2,
  },
  {
    code: 'QAR',
    flagUrl: 'https://flagcdn.com/w40/qa.png',
    name: 'الريال القطري',
    symbol: 'ر.ق',
    rate: 9.48,
    decimals: 2,
  },
  {
    code: 'KWD',
    flagUrl: 'https://flagcdn.com/w40/kw.png',
    name: 'الدينار الكويتي',
    symbol: 'د.ك',
    rate: 0.8,
    decimals: 3,
  },
  {
    code: 'BHD',
    flagUrl: 'https://flagcdn.com/w40/bh.png',
    name: 'الدينار البحريني',
    symbol: 'د.ب',
    rate: 0.98,
    decimals: 3,
  },
  {
    code: 'JOD',
    flagUrl: 'https://flagcdn.com/w40/jo.png',
    name: 'الدينار الأردني',
    symbol: 'د.أ',
    rate: 1.845,
    decimals: 3,
  },
  {
    code: 'USD',
    flagUrl: 'https://flagcdn.com/w40/us.png',
    name: 'الدولار الأمريكي',
    symbol: '$',
    rate: 2.6,
    decimals: 2,
  },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: CurrencyCode) => void;
  convertPrice: (omrPrice: number) => number;
  formatPrice: (omrPrice: number) => string;
}

const CurrencyContext =
  createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currencyCode, setCurrencyCodeState] =
    useState<CurrencyCode>(() => {
      const savedCurrency = localStorage.getItem(
        'selectedCurrency',
      ) as CurrencyCode | null;

      return savedCurrency || 'OMR';
    });

  const currency =
    currencies.find((item) => item.code === currencyCode) ||
    currencies[0];

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    localStorage.setItem('selectedCurrency', code);
  };

  const convertPrice = (omrPrice: number) => {
    return omrPrice * currency.rate;
  };

  const formatPrice = (omrPrice: number) => {
    const converted = convertPrice(omrPrice);

    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    });

    return currency.code === 'USD'
      ? `${currency.symbol}${formatted}`
      : `${formatted} ${currency.symbol}`;
  };

  useEffect(() => {
    document.documentElement.dataset.currency =
      currency.code;
  }, [currency.code]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrencyCode,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      'useCurrency must be used inside CurrencyProvider',
    );
  }

  return context;
}
