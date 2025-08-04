"use client";

import { useState } from "react";
import Image from "next/image";
import { App as Framework7App, View } from "framework7-react";
import {
  Page,
  Navbar,
  Block,
  List,
  ListInput,
  Button,
} from "konsta/react";
import { Sun } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { SDKProvider, useInitData } from "@tma.js/sdk-react";
import { getSunSign } from "@/lib/astro";
import { upsertProfile } from "@/lib/supabase";


export default function TelegramPage() {
  return (
    <SDKProvider>
      <TelegramInner />
    </SDKProvider>
  );
}

function TelegramInner() {
  const initData = useInitData();
  const user = initData?.user;
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [sunSign, setSunSign] = useState<string | undefined>();

  const telegramName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    undefined;
  const telegramUsername = user?.username;
  const telegramPhotoUrl = user?.photo_url;
  const telegramId = user?.id;

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
                {telegramPhotoUrl ? (
                  <Image
                    src={telegramPhotoUrl}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <UserIcon className="h-16 w-16 text-indigo-400" />
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
            <Transition
              show={Boolean(sunSign)}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              {sunSign && (
                <Block strong className="mt-4 flex items-center space-x-2">
                  <motion.div
                    initial={{ rotate: 0, scale: 0.8 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  >
                    <Sun className="h-5 w-5 text-yellow-400" />
                  </motion.div>
                  <p
                    className={twMerge(
                      clsx("font-medium", "text-sm"),
                    )}
                  >
                    Your Sun sign is {sunSign}.
                  </p>
                </Block>
              )}
            </Transition>
          </Block>
        </Page>
      </View>
    </Framework7App>
  );
}

