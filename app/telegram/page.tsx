"use client";

import { useEffect, useState } from "react";
import { App as Framework7App, View } from "framework7-react";
import { Page, Navbar, Block, List, ListInput, Button } from "konsta/react";
import { getSunSign } from "@/lib/astro";
import { upsertProfile } from "@/lib/supabase";

interface TelegramWebApp {
  expand: () => void;
  initDataUnsafe?: {
    user?: {
      id?: number;
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
  const [telegramId, setTelegramId] = useState<number | undefined>();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [sunSign, setSunSign] = useState<string | undefined>();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      setTelegramUser(tg.initDataUnsafe?.user?.first_name);
      setTelegramId(tg.initDataUnsafe?.user?.id);
    }
  }, []);

  const handleSubmit = async (
    e: React.FormEvent | React.MouseEvent
  ) => {
    e.preventDefault();
    if (!telegramId) return;
    try {
      await upsertProfile({
        id: telegramId.toString(),
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: birthPlace,
      });
      setSunSign(getSunSign(birthDate));
      alert("Saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  return (
    <Framework7App theme="ios">
      <View main>
        <Page>
          <Navbar title="AstroT" />
          <Block strong>
            {(telegramUser || telegramId) && (
              <p className="mb-4">
                {telegramUser && <>Hello, {telegramUser}! </>}
                {telegramId && <>Your Telegram ID is {telegramId}.</>}
              </p>
            )}
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
              <Button onClick={handleSubmit}>Save</Button>
            </form>
            {sunSign && (
              <Block strong className="mt-4">
                <p>Your Sun sign is {sunSign}.</p>
              </Block>
            )}
          </Block>
        </Page>
      </View>
    </Framework7App>
  );
}

