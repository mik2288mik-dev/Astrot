declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void;
        expand(): void;
        close(): void;
        enableClosingConfirmation(): void;
        disableClosingConfirmation(): void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
        };
        platform: 'ios' | 'android' | 'web' | 'macos' | 'tdesktop';
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          show(): void;
          hide(): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
          isVisible: boolean;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          showProgress(leaveActive?: boolean): void;
          hideProgress(): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
          setText(text: string): void;
          setParams(params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_visible?: boolean;
            is_progress_visible?: boolean;
            is_active?: boolean;
          }): void;
        };
        HapticFeedback: {
          impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
          notificationOccurred(type: 'error' | 'success' | 'warning'): void;
          selectionChanged(): void;
        };
        CloudStorage: {
          getItem(key: string): Promise<string | null>;
          setItem(key: string, value: string): Promise<void>;
          getItems(keys: string[]): Promise<Record<string, string | null>>;
          removeItem(key: string): Promise<void>;
          removeItems(keys: string[]): Promise<void>;
          getKeys(): Promise<string[]>;
        };
        BiometricManager: {
          isInited: boolean;
          isSupported: boolean;
          isBiometricAvailable: boolean;
          isAccessRequested: boolean;
          isAccessGranted: boolean;
          init(): Promise<void>;
          authenticate(): Promise<void>;
          requestAccess(): Promise<void>;
        };
        showAlert(message: string, callback?: () => void): void;
        showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
        showPrompt(message: string, defaultText?: string, callback?: (text: string | null) => void): void;
        showPopup(params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string | null) => void): void;
        showScanQrPopup(params: {
          text?: string;
        }, callback?: (data: string | null) => void): void;
        closeScanQrPopup(): void;
        readTextFromClipboard(): Promise<string | null>;
        requestWriteAccess(): Promise<boolean>;
        requestContact(): Promise<{
          phone_number: string;
          first_name: string;
          last_name?: string;
          user_id?: number;
          vcard?: string;
        } | null>;
        invokeCustomMethod(method: string, params?: any): Promise<any>;
        sendData(data: string): void;
        switchInlineQuery(query: string, choose_chat_types?: string[]): void;
        openLink(url: string, options?: {
          try_instant_view?: boolean;
        }): void;
        openTelegramLink(url: string): void;
        openInvoice(url: string, callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void): void;
        setupMainButton(text: string, callback: () => void): void;
        setupBackButton(callback: () => void): void;
        setupClosingConfirmation(enabled: boolean): void;
        setupHeaderButton(text: string, callback: () => void): void;
        setupSettingsButton(callback: () => void): void;
        setupPopupButton(text: string, callback: () => void): void;
        setupScanQrButton(callback: (data: string) => void): void;
        setupContactButton(callback: (contact: {
          phone_number: string;
          first_name: string;
          last_name?: string;
          user_id?: number;
          vcard?: string;
        }) => void): void;
        setupClipboardButton(callback: (text: string) => void): void;
        setupWriteAccessButton(callback: (granted: boolean) => void): void;
        setupCustomMethodButton(method: string, callback: (result: any) => void): void;
        setupDataButton(callback: (data: string) => void): void;
        setupInlineQueryButton(callback: (query: string) => void): void;
        setupLinkButton(callback: (url: string) => void): void;
        setupTelegramLinkButton(callback: (url: string) => void): void;
        setupInvoiceButton(callback: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void): void;
      };
    };
  }
}

export {};
