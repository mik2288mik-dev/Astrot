"use client";

import { useEffect, useState } from "react";
import { App as Framework7App, View } from "framework7-react";
import { Page, Navbar, Block, List, ListInput, Button } from "konsta/react";

interface TelegramWebApp {
  expand: () => void;
  initDataUnsafe?: {
    user?: {
      first_name?: string;
    };
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export default function TelegramPage() {
  const [telegramUser, setTelegramUser] = useState<string | undefined>();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      setTelegramUser(tg.initDataUnsafe?.user?.first_name);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Birth info:\nDate: ${birthDate}\nTime: ${birthTime}\nPlace: ${birthPlace}`;
    alert(message);
  };

  return (
    <Framework7App theme="ios">
      <View main>
        <Page>
          <Navbar title="AstroT" />
          <Block strong>
            {telegramUser && <p className="mb-4">Hello, {telegramUser}!</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <List strong inset>
                <ListInput
                  label="Date of Birth"
                  type="date"
                  value={birthDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBirthDate(e.target.value)
                  }
                />
                <ListInput
                  label="Time of Birth"
                  type="time"
                  value={birthTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBirthTime(e.target.value)
                  }
                />
                <ListInput
                  label="Place of Birth"
                  type="text"
                  value={birthPlace}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBirthPlace(e.target.value)
                  }
                  placeholder="City"
                />
              </List>
              <Button type="submit">Save</Button>
            </form>
          </Block>
        </Page>
      </View>
    </Framework7App>
  );
}

