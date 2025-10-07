import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Mock components
jest.mock("./components/navbar", () => () => <div>Navbar</div>);
jest.mock("./components/redirectByCookie", () => () => <div>RedirectByCookie</div>);

// Mock translations dynamically inside the factory
jest.mock("./lib/useLocaleDictionary", () => ({
  useLocaleDictionary: (lang) => {
    const en = require("./locales/en.json");
    const es = require("./locales/es.json");
    if (lang === "en") return en;
    if (lang === "es") return es;
    return en; // fallback
  },
}));

// Mock BrowserRouter so MemoryRouter works
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    BrowserRouter: ({ children }) => <>{children}</>, // just render children
  };
});

describe("App routing", () => {
  test("renders RedirectByCookie on root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("RedirectByCookie")).toBeInTheDocument();
  });

  test("renders Home for /es path", () => {
    render(
      <MemoryRouter initialEntries={["/es"]}>
        <App />
      </MemoryRouter>
    );
    const es = require("./locales/es.json"); // require inside test
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText(es.home.aboutUs)).toBeInTheDocument();
  });

  test("renders Guitars page for /es/guitarras path", () => {
    render(
      <MemoryRouter initialEntries={["/es/guitarras"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText(/guitarras/i)).toBeInTheDocument();
  });

  test("renders Contact page for /es/contacto path", () => {
    render(
      <MemoryRouter initialEntries={["/es/contacto"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Navbar")).toBeInTheDocument();
  });
});