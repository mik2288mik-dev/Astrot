"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export default function TelegramPage() {
  const [telegramName, setTelegramName] = useState<string | undefined>();
  const [telegramUsername, setTelegramUsername] =
    useState<string | undefined>();
  const [telegramPhotoUrl, setTelegramPhotoUrl] =
    useState<string | undefined>();
  const [telegramId, setTelegramId] = useState<number | undefined>();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [sunSign, setSunSign] = useState<string | undefined>();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        const name = [user.first_name, user.last_name]
          .filter(Boolean)
          .join(" ") ||
          "Unknown";
        setTelegramName(name);
        setTelegramUsername(user.username);
        setTelegramPhotoUrl(user.photo_url);
        setTelegramId(user.id);
      }
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
            {(telegramName || telegramUsername || telegramId || telegramPhotoUrl) && (
              <div className="mb-4 flex items-center space-x-4">
                {telegramPhotoUrl && (
                  <Image
                    src={telegramPhotoUrl}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  {telegramName && <p>Name: {telegramName}</p>}
                  {telegramUsername && <p>Login: @{telegramUsername}</p>}
                  {telegramId && <p>ID: {telegramId}</p>}
                </div>
              </div>
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

