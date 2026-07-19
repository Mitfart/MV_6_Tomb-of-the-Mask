import { log } from 'cc';

declare global {
    interface Window {
        LANGUAGE?: string;
    }
}

export enum LangCode {
    EN = "EN",
    DE = "DE",
    NL = "NL",
    FR = "FR",
    IT = "IT",
    ES = "ES",
}

export enum LandDataParam {
    bet,
    balance,
    difficulty,
    medium,
    go,
    cash_out,
    flag,
}

export class LangData {
    public bet: string;
    public balance: string;
    public difficulty: string;
    public medium: string;
    public go: string;
    public cash_out: string;
    public flag: string;
}


export class Localization {
    public static get CurrentLang(): LangCode { return Localization._currentLang; }
    public static get DATA(): LangData { return Localization._data; }

    private static _currentLang: LangCode;
    private static _data: LangData = null;


    public static setLanguage(lang: LangCode) {
        this._currentLang = lang;
        this._data = this.translations[this._currentLang];
    }


    public static get(param: LandDataParam): string {
        if (window.LANGUAGE) {
            try {
                this.setLanguage(LangCode[window.LANGUAGE])
            } catch(_){ log(`Language "${window.LANGUAGE}" not found`) }
        }

        switch(param) {
            case LandDataParam.bet: return this._data.bet;
            case LandDataParam.balance: return this._data.balance;
            case LandDataParam.difficulty: return this._data.difficulty;
            case LandDataParam.medium: return this._data.medium;
            case LandDataParam.go: return this._data.go;
            case LandDataParam.cash_out: return this._data.cash_out;
            case LandDataParam.flag: return this._data.flag;
            default: throw `NO MATCH FOR "${param}"`;
        }
    }


    private static translations: Record<LangCode, LangData> = {
        EN: {
            bet: 'bet',
            balance: 'balance',
            difficulty: 'difficulty',
            medium: 'medium',
            go: 'go',
            cash_out: 'Cash out',
            flag: 'EN',
        },
        DE: {
            bet: 'Wette',
            balance: 'Guthaben / Gleichgewicht*',
            difficulty: 'Schwierigkeit',
            medium: 'Mittel / mittel',
            go: 'gehen',
            cash_out: 'Jetzt auszahlen',
            flag: 'DE',
        },
        NL: {
            bet: 'weddenschap',
            balance: 'saldo / evenwicht*',
            difficulty: 'moeilijkheid',
            medium: 'middel / gemiddeld',
            go: 'gaan',
            cash_out: 'Nu opnemen',
            flag: 'NL',
        },
        FR: {
            bet: 'pari',
            balance: 'solde / équilibre*',
            difficulty: 'difficulté',
            medium: 'moyen',
            go: 'aller',
            cash_out: 'Retirer maintenant',
            flag: 'FR',
        },
        IT: {
            bet: 'scommessa',
            balance: 'saldo / equilibrio*',
            difficulty: 'difficoltà',
            medium: 'medio',
            go: 'andare',
            cash_out: 'Preleva ora',
            flag: 'IT',
        },
        ES: {
            bet: 'apuesta',
            balance: 'saldo / equilibrio*',
            difficulty: 'dificultad',
            medium: 'medio',
            go: 'ir',
            cash_out: 'Retirar ahora',
            flag: 'ES',
        },
    };
}