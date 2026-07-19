import { sys } from "cc";

declare global {
    interface Window {
        APP_STORE_URL?: string;
        GOOGLE_PLAY_URL?: string;
    }
}

const BASE_APP_STORE_LINK = "https://apps.apple.com/us/app/color-fill-3d/id1473024868";
const BASE_GOOGLE_LINK = "https://play.google.com/store/apps/details?id=com.gjg.colorfill3d";

enum TargetApp {
    GOOGLE,
    APP_STORE
}

export class super_html_playable {
    private _lastDownloadTs = 0;

    public download() {
        const now = Date.now();
        if (now - this._lastDownloadTs < 500) return;
        this._lastDownloadTs = now;

        const GOOGLE_URL = window.GOOGLE_PLAY_URL || BASE_GOOGLE_LINK; 
        const APP_STORE_URL = window.APP_STORE_URL || BASE_APP_STORE_LINK; 
        
        if (GOOGLE_URL.trim() == "" && APP_STORE_URL.trim() == "") {
            console.log("download_no_urls");
            
            this.html_game_download();
        } else {
            console.log("download");
            
            let url: string;
            let platform: TargetApp = this.getTargetApp();

            if (platform === TargetApp.APP_STORE) {
                this.html_set_app_store_url(url = APP_STORE_URL);
            } else {
                this.html_set_google_play_url(url = GOOGLE_URL);
            }
            
            console.log(`Opening store for ${TargetApp[platform]}: ${url}`);
            if (url.trim() != "" && !this.isVungleEnvironment()) this.safeOpen(url);
            
            this.html_game_download();
        }
    }
    
    

    private isVungleEnvironment(): boolean {
        const ua = (navigator.userAgent || "").toLowerCase();
        const w = window as unknown as Record<string, unknown>;
        return (
            ua.includes("vungle") ||
            typeof w["vungle"] !== "undefined" ||
            typeof w["Vungle"] !== "undefined" ||
            typeof w["vunglePlayable"] !== "undefined" ||
            typeof w["VunglePlayable"] !== "undefined"
        );
    }

    private safeOpen(url: string): void {
        try {
            const newWindow = window.open(url, '_blank');
            if (newWindow === null || newWindow.closed) {
                // Если всплывающее окно заблокировано, используем обходной метод
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error opening URL:", error);
            // Последняя попытка - просто переходим по ссылке
            window.location.href = url;
        }
    }
    
    
    private getTargetApp(): TargetApp {
        // Для нативных платформ (мобильные приложения)
        if (sys.isNative) {
            if (sys.os === sys.OS.ANDROID) {
                return TargetApp.GOOGLE;
            } else if (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX) {
                return TargetApp.APP_STORE; 
            }
        }
        

        // Для веб-версий (анализ userAgent)
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('android')) {
            return TargetApp.GOOGLE;
        } else if (userAgent.includes('iphone') || 
                userAgent.includes('ipad') || 
                userAgent.includes('ipod') ||
                userAgent.includes('macintosh')) {
            // Добавляем macintosh для macOS - тоже ведем в App Store
            return TargetApp.APP_STORE; 
        }
        
        
        // По умолчанию для всего остального (Windows, Linux и т.д.) - Android
        return TargetApp.GOOGLE;
    }



    private html_game_download() {
        //@ts-ignore
        window.super_html && super_html.game_end();
        //@ts-ignore
        window.super_html && super_html.download();
    }
    
    private html_set_google_play_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.google_play_url = url);
    }

    private html_set_app_store_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.appstore_url = url);
    }
}
export default new super_html_playable();