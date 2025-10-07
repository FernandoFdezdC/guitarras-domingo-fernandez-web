import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/navbar";

// Mock translations
jest.mock("../lib/useLocaleDictionary", () => ({
  useLocaleDictionary: (lang) => {
    const en = require("../locales/en.json");
    const es = require("../locales/es.json");
    if (lang === "en") return en;
    if (lang === "es") return es;
    return en;
  },
}));

test("renders Navbar links in English", async () => {
  render(
    <MemoryRouter initialEntries={["/en"]}>
      <Navbar />
    </MemoryRouter>
  );

  const en = require("../locales/en.json");

  // Wait for the effect to update currentLang
  expect(await screen.findByText(en.navbar.home)).toBeInTheDocument();
  expect(await screen.findByText(en.navbar.guitars)).toBeInTheDocument();
  expect(await screen.findByText(en.navbar.contact)).toBeInTheDocument();
});