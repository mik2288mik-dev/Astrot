import React, { useState, useEffect } from 'react';
import { Page, Navbar, List, ListItem, Toggle } from 'konsta/react';

export default function SettingsPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  };

  return (
    <Page>
      <Navbar title="Настройки" />
      <List strong inset>
        <ListItem
          title="Тёмная тема"
          after={<Toggle checked={dark} onChange={toggleTheme} />}
        />
      </List>
    </Page>
  );
}
